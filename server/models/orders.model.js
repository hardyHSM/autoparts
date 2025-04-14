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
            default: false
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Location',
            required: true,
        },
        address: {
            type: String,
            required: true
        },
        tel: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        status: {
            type: String,
            default: 'Не обработан'
        },
        delivery: {
            type: Boolean,
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
        ],
        closeTime: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
)

const OrdersModel = model('Order', ordersSchema)

export default OrdersModel