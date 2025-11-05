import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

    issueId: {type: mongoose.Schema.Types.ObjectId, ref: 'Issue'},

    type: {type: String, enum: ["issue_assigned", "status_changed", "new_comment"], required: true},

    message: String,

    isRead: {type: Boolean, default: false},

    sentVia: {type: String, enum: ["email", "sms", "push"], required: true},

    createdAt: {type: Date, default: Date.now}
});

const Notifcation = mongoose.model("Notifcation", notificationSchema );
export default Notifcation;
