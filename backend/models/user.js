
//Models
//Definition: Models represent your data structure and handle all database operations. They define the schema, validation rules, and business logic for your data.

//Role in Your Project:

//User Model: Defines farmer/worker profiles with skills, roles, and authentication



import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},  // Add name field

    email: {type: String, required: true, unique: true},

    password: {type: String, required: true},

    role: {type: String, default: "farmer", 
    enum: ["farmer", "worker", "manager", "admin"]},

    skills: [String],

    farmId: {type: mongoose.Schema.Types.ObjectId, ref: 'Farm'},  // Associate with farm

    phoneNumber: {type: String},  // for SMS notifications

    isActive: {type: Boolean, default: true},

    createdAt: {type: Date, default: Date.now},
    
    updatedAt: {type: Date, default: Date.now}
});

const User = mongoose.model("User", userSchema);
export default User;

