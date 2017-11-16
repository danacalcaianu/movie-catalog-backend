const mongoose = require( "mongoose" );
const extractObject = require( "../utilities" ).extractObject;
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcrypt-nodejs" );

const User = mongoose.model( "User" );
const Movie = mongoose.model( "Movie" );
const SECRET = "superSuperSecret";

/* eslint consistent-return: "off" */
exports.register = ( req, res ) => {
    let user = req.user;
    if ( user ) {
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

    if ( !user || !password ) {
        return res.json( {
            success: false,
            message: "Authentication failed.",
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
    user.editUser( req.body );
    user.save( ( err, savedUser ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( savedUser );
    } );
};

exports.delete = ( req, res ) => {
    const user = req.user;
    user.deleted = true;
    user.save();
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

exports.rateMovie = ( req, res ) => {
    const movie = req.movie;
    movie.addRating( req.body.rating );
    movie.updateRating();
    movie.save();
    return res.success( movie );
};

exports.reviewMovie = ( req, res ) => {
    const movie = req.movie;
    movie.addReview( req.body, req.user.username );
    movie.save();
    return res.success( movie );
};

exports.editMovie = ( req, res ) => {
    const movie = req.movie;
    movie.editMovie( req.body );
    movie.save( ( err, result ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( result );
    } );
};


exports.removeReview = ( req, res ) => {
    const movie = req.movie;
    const user = req.user;
    const reviewId = req.params.reviewId;
    if ( !movie ) {
        return res.notFound();
    }
    const reviewIndex = movie.getReviewIndex( reviewId );
    if ( movie.reviews[ reviewIndex ].author !== user.username ) {
        return res.unauthorized();
    }
    movie.removeReview( reviewIndex );
    movie.save( ( err, updatedMovie ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( updatedMovie );
    } );
};
exports.markReviewAsSpam = ( req, res ) => {
    const movie = req.movie;
    const reviewId = req.params.reviewId;

    if ( !movie ) {
        return res.notFound();
    }

    const reviewIndex = movie.getReviewIndex( reviewId );
    movie.spamReview( reviewIndex );
    movie.save( ( err, result ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( result );
    } );
};
