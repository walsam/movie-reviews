import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO{
    static async injectDB(conn){
        if(reviews) {
            return
        }
        try{
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews")
        }catch(e) {
            console.error("unable to establish connection handle in reviewsDAO: ${e}")
        }
    }

    static async addReview(movieId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: ObjectId(movieId)
            }
            const insertReview = await reviews.insertOne(reviewDoc)
            return insertReview
        } catch(e) {
            console.error("unable to post review: ${e}")
            return { error: e }
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateReview = await reviews.updateOne(
                {user_id: userId, _id: ObjectId(reviewId)},
                {$set: {review: review, date: date}}
            )
            return updateReview
        } catch(e) {
            console.error("unable to update review: ${e}")
            return { error: e }
        }
    }
    static async deleteReview(reviewId, userId) {
        try {
            const deleteReview = await reviews.deleteOne(
                {
                    _id: ObjectId(reviewId),
                    user_id: userId
                }
            )
            return deleteReview
        } catch(e) {
            console.error("unable to delete review: ${e}")
            return { error: e }
        }
    }
}