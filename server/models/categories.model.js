import { Schema, model } from 'mongoose'

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        unique: true
    }
})

const CategoriesModel = model('Category', categoriesSchema)

export default CategoriesModel