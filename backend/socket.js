import { leaveAllRooms } from "./socket/helper.js";
import { notifyConversationOnlineStatus } from "./socket/socketConversation.js";
import redisService from "./services/RedisService.js";

export const initializeSocket = async (io) => {
    io.on("connection", async (socket) => {
        try {
            const user = socket.user;
            console.log("User connected", user.id);
            socket.join(user._id.toString());

            await redisService.addUserSession(user.id, socket.id);
            await notifyConversationOnlineStatus(io, socket, true);

            socket.on("disconnect", async () => {
                await redisService.removeUserSession(user.id, socket.id);

                const isOnline = await redisService.isUserOnline(user.id);
                if (!isOnline) {
                    await notifyConversationOnlineStatus(io, socket, false);
                }

                leaveAllRooms(socket);
            });

        } catch (error) {
            console.error("Socket connection error", error);
            socket.emit("internal_error", { error: "Internal server error" });

        }
    });
};
