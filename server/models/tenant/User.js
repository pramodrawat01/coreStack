import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Role',
        required : true,

    },
    status : {
        type : String,
        enum : ['Active', 'Invited', 'Deactivated'], 
        default : 'Active'
    }
}, {
    timestamps : true
})

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return 

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function (candidate){
    return bcrypt.compare(candidate, this.password)
}

export function getUserModel(connection){
    return connection.models.User || connection.model('User', userSchema)
}