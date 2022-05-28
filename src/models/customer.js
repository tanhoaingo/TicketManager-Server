const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        information: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Customer", CustomerSchema);