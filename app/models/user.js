const mongoose = require( "mongoose" );
const bcrypt = require( "bcrypt-nodejs" );
const uid = require( "uid" );

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    id: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: [ "male", "female" ] },
    categories: [ {
        type: String,
        enum: [ "action", "comedy", "drama", "horror", "Sci-Fi", "romance" ],
    } ],
    avatar: { type: String },
    deleted: { type: Boolean, default: false },
    blockedBy: { type: String },
    blockedReason: { type: String },
}, {
    timestamps: true,
} );

userSchema.methods.setId = () => {
    this.id = uid( 10 );
};

userSchema.methods.setPass = ( password ) => {
    this.password = bcrypt.hashSync( password );
};

userSchema.methods.setFullName = ( ) => `${ this.firstName } ${ this.lastName }`;

userSchema.methods.editUser = ( body ) => {
    const { firstName, lastName, gender, age, categories, avatar, email } = body;

    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.categories = categories;
    this.avatar = avatar;
    this.email = email;
};

module.exports = mongoose.model( "User", userSchema );
