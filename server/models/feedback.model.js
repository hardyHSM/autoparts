import { Schema, model } from 'mongoose'

const feedbackSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
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
        timestamps: { createdAt: 'createdAt', updatedAt: true }
    }
)

const FeedBackModel = model('Feedback', feedbackSchema)

export default FeedBackModel
