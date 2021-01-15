const express = require("express")
const mongoose = require("mongoose")

const ProductsSchema = require("./schema")
const ReviewsSchema = require("../reviews/schema")
const { findById } = require("./schema")

const ProductsRouter = express.Router()

ProductsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsSchema.find()
    res.send(products)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

ProductsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const product = await ProductsSchema.findById(id)
    if (product) {
      res.send(product)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("A problem occurred!")
  }
})

ProductsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsSchema(req.body)
    const { _id } = await newProduct.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

ProductsRouter.put("/:id", async (req, res, next) => {
  try {
    const product = await ProductsSchema.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (product) {
      res.send(product)
    } else {
      const error = new Error(`Product with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

ProductsRouter.delete("/:id", async (req, res, next) => {
  try {
    const product = await ProductsSchema.findByIdAndDelete(req.params.id)
    if (product) {
      res.send("Deleted")
    } else {
      const error = new Error(`Product with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

// ProductsRouter.post("/:id/reviews/:reviewId", async (req, res, next) => {
//   try {
//     const article = await  ProductsSchema.findById(req.params.id)
//     if(article){

//       const reviewIndex =article.reviews.findIndex((review)=>review._id.toString()===req.params.reviewId)
//       if(reviewIndex!==-1){
//         const review = article.reviews[reviewIndex];
//          article.reviews[reviewIndex] = {...review._doc,...req.body}
//          await article.update({reviews:article.reviews})
         
//          res.send(article)
//       }
//       else{
//         res.status(404).send("not found")
//       }
//     }
//     else{
//       res.status(404).send("not found")
//     }
//   } catch (error) {
//     next(error)
//   }
// })

ProductsRouter.post("/:id/reviews/", async (req, res, next) => {
  try {
    const reviewId = req.body.reviewId
    const thatReview = await ReviewsSchema.findById(reviewId, { _id: 0 })
    const thatProduct = await ProductsSchema.findById(req.params.id)
    if(thatReview && thatProduct){
      const reviewToInsert = { ...thatReview.toObject(), date: new Date() }
  
      const updated = await ProductsSchema.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            reviews: reviewToInsert,
          },
        },
        { runValidators: true, new: true }
      )
      res.status(201).send(updated)

    }else{
      console.log("shit happened!")
    }
  } catch (error) {
    next(error)
  }
})

ProductsRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const productId = req.params.id
    const { reviews } = await ProductsSchema.findById(productId, {reviews: 1, _id: 0})
    console.log(reviews)
    res.send(reviews)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

ProductsRouter.get("/:id/reviews/:reviewId", async (req, res, next) =>{
    try {
      const productId = req.params.id
      const reviewId = req.params.reviewId

      const {reviews} = await ProductsSchema.findOne(
        {_id: mongoose.Types.ObjectId(productId)},
        {
          reviews: {
            $elemMatch: {
              _id: mongoose.Types.ObjectId(reviewId)
            }
          }
        }
      )
      res.send(reviews[0])
    } catch (error) {
      next(error)
    }
})

ProductsRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const productId = req.params.id
    const reviewId = req.params.reviewId

    const {reviews} = await ProductsSchema.findOne(
      {_id: mongoose.Types.ObjectId(productId)},
      {
        reviews: {
          $elemMatch: {_id: mongoose.Types.ObjectId(reviewId)}
        }
      }
    )

    const oldReviews = reviews[0].toObject()
    const modifiedReview = {...oldReviews, ...req.body}

    await ProductsSchema.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(productId),
        "reviews._id": mongoose.Types.ObjectId(reviewId)
      },
      {
        $set: {"reviews.$": modifiedReview}
      }
    )
    res.send("Went find")
  } catch (error) {
    console.log("did not went find")
    next(error)
  }
})

ProductsRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedProduct = await ProductsSchema.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id)
      },
      {
        $pull: {reviews: {_id: mongoose.Types.ObjectId(req.params.reviewId)}}
      },
      {runValidators: true, new: true}
    )
    res.send(modifiedProduct)
  } catch (error) {
    
  }
})
module.exports = ProductsRouter
