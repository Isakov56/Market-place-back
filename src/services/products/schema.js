const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ProductsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    imgUrl: {
      name: String,
      img: String,
    },
    price: {
      name: String,
      img: String
    },
    category: {
      type: String
    },
    reviews: [
      {
        comment: String,
        rate: Number,
        date: Date
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("Products", ProductsSchema)
