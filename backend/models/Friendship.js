import mongoose from "mongoose"

const friendshipSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        index:true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        index:true,
    },
    pairKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
},{timestamps: true});

friendshipSchema.index({requester:1, recipient: 1}, {unique: true});

friendshipSchema.pre("validate", function () {
    if (!this.requester || !this.recipient) {
        return;
    }

    const [first, second] = [this.requester.toString(), this.recipient.toString()].sort();
    this.pairKey = `${first}:${second}`;
});

export default mongoose.model("Friendship", friendshipSchema);
