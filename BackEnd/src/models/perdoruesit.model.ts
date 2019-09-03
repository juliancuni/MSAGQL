import { Schema, model } from 'mongoose';

const perdoruesSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    enabled: {
        type: Boolean,
        required: false,
        default: true
    }
})

const PerdoruesModel = model('Perdorues', perdoruesSchema);

export { PerdoruesModel };