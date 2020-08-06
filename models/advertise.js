const mongoose = require('mongoose');
//Create Schema
const AdvertiseSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    }
});
//Create and instantiate model with schema
const Advertise = mongoose.model("Advertise", AdvertiseSchema);
module.exports = Advertise;