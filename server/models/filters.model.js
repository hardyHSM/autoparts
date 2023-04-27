import { Schema, model } from 'mongoose'

const filtersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: false
    }
})

const FiltersModel = model('Filter', filtersSchema)

export default FiltersModel