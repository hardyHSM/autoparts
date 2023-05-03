import { Schema, model } from 'mongoose'

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    link: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    number: {
        type: Number
    }
})

const CategoriesModel = model('Category', categoriesSchema)

export default CategoriesModel

