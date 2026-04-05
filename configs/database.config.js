const mongoose = require('mongoose');

module.exports.connectDatabase=async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_LINK);
    } catch (error) {
        handleError(error);
    }
    
}