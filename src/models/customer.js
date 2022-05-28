const { userSchema } = require("./user.js");
const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        information: {
            type: userSchema,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Customer", CustomerSchema);