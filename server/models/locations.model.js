import { Schema, model } from 'mongoose'


const LocationsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const LocationsModel = model('Location', LocationsSchema)

export default LocationsModel

