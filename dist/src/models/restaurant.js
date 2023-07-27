import mongoose from 'mongoose';
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    },
    cuisineType: {
        required: true,
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}).index({
    location: '2dsphere'
});
export const Restaurant = mongoose.model('Restaurant', dataSchema);
