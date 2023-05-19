import { Schema, model } from 'mongoose'

const feedbackSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        isAnswered: {
            type: Boolean,
            default: false
        },
        name: String,
        text: String,
        answer: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false }
    }
)

const FeedBackModel = model('Feedback', feedbackSchema)

export default FeedBackModel
