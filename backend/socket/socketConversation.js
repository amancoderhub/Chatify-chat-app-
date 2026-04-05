import Conversation from "../models/Conversation.js";
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";
import redisService from "../services/RedisService.js";
import { getChatRoom } from "./helper.js";

export const notifyConversationOnlineStatus = async (io, socket, online) => {
    try {
        const userId = socket.userId;
        const user = socket.user;

        const friendships = await Friendship.find({
            $or: [
                { requester: userId },
                { recipient: userId },
            ],
        });

        friendships.forEach((friendship) => {
            const isRequester = friendship.requester.toString() === userId.toString();
            const friendId = isRequester ? friendship.recipient : friendship.requester;

            io.to(friendId.toString()).emit("conversation:online-status", {
                friendId: userId,
                username: user.username,
                online,
            });
        });
    } catch (error) {
        console.error("notifyConversationOnlineStatus", error);
    }
};

export const conversationRequest = async (io, socket, data) => {
    try {
        const userId = socket.userId;
        const user = socket.user;
        const connectCode = data?.connectCode?.trim();

        if (!connectCode) {
            socket.emit("conversation:request:error", {
                error: "Connect ID is required",
            });
            return;
        }

        const friend = await User.findOne({ connectCode });

        if (!friend) {
            socket.emit("conversation:request:error", {
                error: "Unable to find conversation",
            });
            return;
        }

        if (friend._id.toString() === userId.toString()) {
            socket.emit("conversation:request:error", {
                error: "Can not add yourself as a friend",
            });
            return;
        }

        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: userId, recipient: friend._id },
                { requester: friend._id, recipient: userId },
            ],
        });

        if (existingFriendship) {
            socket.emit("conversation:request:error", {
                error: "Friendship already exists",
            });
            return;
        }

        await Friendship.create({
            requester: userId,
            recipient: friend._id,
        });

        const conversation = await Conversation.create({
            participants: [userId, friend._id.toString()],
        });

        const room = getChatRoom(userId, friend._id.toString());
        socket.join(room);

        const conversationData = {
            conversationId: conversation._id.toString(),
            lastMessage: null,
            unreadCounts: {
                [userId.toString()]: 0,
                [friend._id.toString()]: 0,
            },
        };

        io.to(userId.toString()).emit("conversation:accept", {
            ...conversationData,
            friend: {
                id: friend.id,
                fullName: friend.fullName,
                username: friend.username,
                connectCode: friend.connectCode,
                online: await redisService.isUserOnline(friend._id.toString()),
            },
        });

        io.to(friend._id.toString()).emit("conversation:accept", {
            ...conversationData,
            friend: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                connectCode: user.connectCode,
                online: await redisService.isUserOnline(user._id.toString()),
            },
        });
    } catch (error) {
        console.error("Error conversation:request", error);
        socket.emit("conversation:request:error", {
            error: "Error conversation:request",
        });
    }
};
