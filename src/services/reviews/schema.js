const {Schema } = require("mongoose")
const mongoose = require("mongoose")

const ReviewsSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
          },
        rate: {
            type: Number, 
            required: true
        }
    }
)

module.exports = mongoose.model("Reviews", ReviewsSchema)