import { Schema, model } from 'mongoose'

const selectionsSchema = new Schema({
    vin: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    count: {
        type: Number, required: true
    },
    isAnswered: {
        type: Boolean, default: false
    },
    answer: {
        type: String, default: ''
    },
    name: String,
    detail: String,
    partType: String

}, {
    timestamps: {
        createdAt: 'createdAt', updatedAt: false
    }
})

const SelectionsModel = model('Selection', selectionsSchema)

export default SelectionsModel
