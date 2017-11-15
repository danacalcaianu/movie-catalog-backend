const mongoose = require( "mongoose" );
const extractObject = require( "../utilities" ).extractObject;
const isValidEmail = require( "../utilities" ).isValidEmail;
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcrypt-nodejs" );

const User = mongoose.model( "User" );
const Movie = mongoose.model( "Movie" );
const SECRET = "superSuperSecret";

/* eslint consistent-return: "off" */
exports.register = ( req, res ) => {
    let user = req.user;
    const email = req.body.email;
    if ( user || !email || !isValidEmail( email ) ) {
        return res.preconditionFailed( "existing_user" );
    }
    user = new User( req.body );
    user.setId();
    user.setPass( req.body.password );
    user.save( ( err, savedUser ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedUser,
            [ "id", "username" ] ) );
    } );
};

exports.login = ( req, res ) => {
    const user = req.user;
    if ( !req.body.password ) {
        res.status( 400 ).send( "password required" );
        return;
    }
    const password = bcrypt.compareSync( req.body.password, user.password );

    if ( !user ) {
        return res.json( {
            success: false,
            message: "Authentication failed. User not found.",
        } );
    }
    if ( !password ) {
        return res.json( {
            success: false,
            message: "Authentication failed. Wrong password.",
        } );
    }
    const token = jwt.sign( user.toObject(), SECRET, { expiresIn: 1440 } );
    return res.json( {
        success: true,
        token,
    } );
};

exports.edit = ( req, res ) => {
    const user = req.user;
    const { firstName, lastName, gender, age, categories, avatar, email } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.age = age;
    user.categories = categories;
    user.avatar = avatar;
    user.email = email;

    user.save( ( err, savedUser ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedUser,
            [ "id", "name", "age", "sex" ] ) );
    } );
};

exports.delete = ( req, res ) => {
    const user = req.user;

    user.remove( );
    res.success( );
};

exports.addMovie = ( req, res ) => {
    const user = req.user;
    let movie = req.movie;
    if ( movie ) {
        return res.preconditionFailed( "existing_movie" );
    }

    movie = new Movie( req.body );
    movie.addOwner( user.id );
    movie.addId( );
    movie.save( );

    return res.success( movie );
};
