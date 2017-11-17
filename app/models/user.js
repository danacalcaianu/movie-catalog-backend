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
        enum: [ "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance" ],
    } ],
    avatar: { type: String },
    deleted: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    blockedBy: { type: String },
    blockedReason: { type: String },
}, {
    timestamps: true,
} );
/* eslint func-names : off */
userSchema.methods.setId = function () {
    this.id = uid( 10 );
};

userSchema.methods.setPass = function( password ) {
    this.password = bcrypt.hashSync( password );
};

userSchema.methods.setFullName = function( ) {
    return `${ this.firstName } ${ this.lastName }`;
};

userSchema.methods.editUser = function( body ) {
    const { firstName, lastName, gender, age, categories, avatar, email } = body;

    this.firstName = firstName || this.firstName;
    this.lastName = lastName || this.lastName;
    this.gender = gender;
    this.age = age;
    this.categories = categories;
    this.avatar = avatar;
    this.email = email || this.email;
};

module.exports = mongoose.model( "User", userSchema );
