import { Schema, model } from 'mongoose'

const producersSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: [
        {
            title: String,
            text: String,
            textList: [String]
        }
    ]
})

producersSchema.index({'$**': 'text'});

const ProducersModel = model('Producer', producersSchema)


export default ProducersModel