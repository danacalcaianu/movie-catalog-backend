const mongoose = require( "mongoose" );
const extractObject = require( "../utilities" ).extractObject;
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcrypt-nodejs" );

const User = mongoose.model( "User" );
// const Movie = mongoose.model( "Movie" );
const isValidEmail = require( "../utilities" ).isValidEmail;

const SECRET = "superSuperSecret";

exports.register = ( req, res ) => {
    let user = req.user;
    const email = req.body.email;
    if ( user ) {
        return res.preconditionFailed( "existing_user" );
    }
    if ( !email ) {
        return res.preconditionFailed( "missing_email" );
    }
    if ( !isValidEmail( email ) ) {
        return res.preconditionFailed( "invalid_email" );
    }
    user = new User( req.body );
    user.setId();
    user.setPass( req.body.password );
    user.save( function( err, savedUser ) {
        if ( err ) {
            return res.validationError( err );
        } else {
            return res.success( extractObject(
                savedUser,
                [ "id", "username" ] ) );
        }
    } );
};

exports.login = ( req, res ) => {
    const user = req.user;
    if ( !req.body.password ) {
        res.status( 400 ).send( "password required" );
        return;
    }

    const password = bcrypt.compareSync( req.body.password, user.password );
    if ( user ) {
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
    }
    return res.json( {
        success: false,
        message: "Authentication failed. User not found.",
    } );
};

exports.edit = ( req, res ) => {
    const user = req.user;
    const name = req.body.name;
    const sex = req.body.sex;
    const age = req.body.age;

    user.name = name;
    user.sex = sex;
    user.age = age;

    user.save( function( err, savedUser ) {
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
    // check if user exists (  middlewares )
    const user = req.user;
    // check if movie exists (  middlewares )
    const movie = req.movie;

    if ( movie ) {
        return res.preconditionFailed( "existing_movie" );
    }

    const movieInfo = req.body;
    movie.create( movieInfo );
    movie.addedBy( user.userId );
    movie.addId( );
    movie.save( );

    return res.success( movie );
};
