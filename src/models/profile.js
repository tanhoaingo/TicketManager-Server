const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
    {
        account: {
            ref: "users",
            type: Schema.Types.ObjectId,
        },
        avatar: {
            type: String,
            required: false,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
        dob: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            required: false,
            enum: ["Male", "Female"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);