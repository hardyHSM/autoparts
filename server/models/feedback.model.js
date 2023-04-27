import { Schema, model } from 'mongoose'

const feedbackSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    text: String
})

const FeedBackModel = model('Feedback', feedbackSchema)

export default FeedBackModel
