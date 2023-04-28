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
        type: Object,
        index: true
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
    }
})

const ProductsModel = model('Product', productsSchema)

export default ProductsModel