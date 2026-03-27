import mongoose from "mongoose"

const messsageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    read: {
        type: Boolean,
        default: false,
        index:true,
    }
}, {timestamps: true})

messsageSchema.index({conversation: 1, createdAt: -1});
messsageSchema.index({sender: 1, createdAt: -1});

messsageSchema.post("save", async function (doc) {
    try {
        const Conversation = mongoose.model("Conversation");

        const preview = {
            content: doc.content,
            timestamp: doc.createdAt,
        };

        await Conversation.findByIdAndUpdate(doc.conversation, {
            lastmassage: doc._id,
            lastMessagePreview: preview,
        });
    } catch (error) {
        console.error("Error updating conversation after message save", error);
    }
});

export default mongoose.model("Message", messsageSchema)
