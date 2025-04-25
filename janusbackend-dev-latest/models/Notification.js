// Imports
import mongoose from 'mongoose';


// Schema
const NotificationSchema = mongoose.Schema({
    user:{type:String},
    component_code:{type:String}
});


// Export
export default mongoose.model('notifications', NotificationSchema);