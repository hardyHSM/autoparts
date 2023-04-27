import { Schema, model } from 'mongoose'

const productsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    maker: {
        type: String,
        required: true
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
        ref: 'Category'
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
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
        default: 0
    }
})


const ProductsModel = model('Product', productsSchema)

export default ProductsModel