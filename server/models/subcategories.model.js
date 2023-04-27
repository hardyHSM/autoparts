import { Schema, model } from 'mongoose'

const subCategoriesSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

const SubCategoriesModel = model('Subcategory', subCategoriesSchema)

export default  SubCategoriesModel