import { Schema, model } from 'mongoose'

const descriptionsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: Schema.Types.Mixed
    }
})

descriptionsSchema.index({'$**': 'text'});

const descriptionsModel = model('Description', descriptionsSchema)


export default descriptionsModel