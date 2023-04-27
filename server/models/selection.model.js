import { Schema, model } from 'mongoose'

const selectionsSchema = new Schema({
    vin: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    name: String,
    detail: String,
    partType: String
})

const SelectionsModel = model('Selection', selectionsSchema)

export default SelectionsModel
