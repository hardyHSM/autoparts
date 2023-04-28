import { Schema, model } from 'mongoose'

const filtersSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        default: false,
        index: true
    }
})

const FiltersModel = model('Filter', filtersSchema)

export default FiltersModel