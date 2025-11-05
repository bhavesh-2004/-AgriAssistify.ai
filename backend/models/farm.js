//Farm Model: Represents farm information and worker associations



import mongoose from "mongoose";

const farmSchema = new mongoose.Schema({
    name: {type: String, required: true},
    
    location: String,

    size: Number,  // in acres/hectares

    cropTypes: [String],

    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    workers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    createdAt: {type: Date, default: Date.now}
});

const Farm = mongoose.model("Farm ", farmSchema );
export default Farm ;
