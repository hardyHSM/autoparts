import { Schema, model } from 'mongoose'

const pagesSchema = new Schema({
        content: {
            type: String,
            required: true
        },
        editable: {
            type: Boolean,
            default: true
        },
        order: {
            type: Number,
            unique: false
        },
        name: {
            type: String,
            required: true
        },
        link: {
            type: String,
            unique: true,
            required: true
        },
        inHeader: {
            type: Boolean,
            default: true
        },
        inBottom: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }

)

const PagesModel = model('Pages', pagesSchema)

export default PagesModel
