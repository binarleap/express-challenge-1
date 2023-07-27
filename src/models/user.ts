import mongoose, {Schema} from 'mongoose';

const dataSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    otps: [{
        type: Schema.Types.ObjectId,
        ref: 'UserOtp'
    }]
})

export const User = mongoose.model('User', dataSchema)
