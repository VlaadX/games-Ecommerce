import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Porfavor digite um nome']
    },
    email: {
        type: String,
        required: [true, 'Porfavor digite um email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Porfavor digite uma senha'],
        minLength: [6, 'A senha deve ter pelo menos 6 caracteres'],

    },
    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }

},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){ 
        return next();
    }

   try{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
   }catch(err){
    console.log(err);
    next(err);
   }
});

userSchema.methods.comparePassword = async function(password){
    return  bcrypt.compare(password, this.password);
}

export default User