import { Schema, model } from 'mongoose'

const productsSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    maker: {
        type: String,
        required: true,
        index: true
    },
    attributes: {
        type: Object
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        index: true
    },
    info: {
        type: Schema.Types.ObjectId,
        ref: 'Producer'
    },
    price: {
        type: Number,
        required: false
    },
    popularity: {
        type: Number,
        required: false,
        index: true,
        default: 0
    },
    stock: String,
    provider: String,
    count: Number
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
})

const ProductsModel = model('Product', productsSchema)

export default ProductsModel