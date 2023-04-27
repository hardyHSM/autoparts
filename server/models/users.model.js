import { Schema, model } from 'mongoose'

const UsersSchema = new Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        },
        tel: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isActivated: {
            type: Boolean,
            default: false
        },
        activationData: {
            type: Object
        },
        recoveryPasswordData: {
            type: Object
        },
        role: {
            type: String,
            default: 'USER'
        },
        cart: {
            list: [{
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                count: {
                    type: Number
                }
            }],
            updateTime: {
                type: Date,
                default: Date.now
            }
        },
        notifications: [
            {
                messageType: String,
                message: String,
                createdTime: {
                    type: Date,
                    default: Date.now
                },
                isChecked: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        orders: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Order'
            }
        ],
        feedbacks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Feedback'
            }
        ],
        selections: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Selection'
            }
        ],
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Location',
            default: null
        }
    },
    {
        timestamps: true
    }
)

const usersModel = model('User', UsersSchema)

export default usersModel