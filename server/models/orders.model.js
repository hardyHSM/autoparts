import { Schema, model } from 'mongoose'

const ordersSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: false
        },
        promo: {
            type: Boolean,
            default: false,
        },
        location: {
            type: String,
            required: true
        },
        tel: {
            type: String,
            required: true
        },
        delivery: {
            type: String,
            required: true
        },
        payment: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        products: [
            {
                count: Number,
                price: Number,
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const OrdersModel = model('Order', ordersSchema)

export default OrdersModel