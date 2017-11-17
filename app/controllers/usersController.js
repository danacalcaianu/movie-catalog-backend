const mongoose = require( "mongoose" );
const extractObject = require( "../utilities" ).extractObject;
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcrypt-nodejs" );
const updateRating = require( "../utilities/index" ).updateRating;
const saveChangesToModel = require( "../utilities/index" ).saveChangesToModel;

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
    saveChangesToModel( res, user );
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
    saveChangesToModel( res, user );
};

exports.delete = ( req, res ) => {
    const user = req.user;

    user.deleted = true;
    saveChangesToModel( res, user );
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
    saveChangesToModel( res, movie );
};

exports.rateMovie = ( req, res ) => {
    const movie = req.movie;
    movie.addRating( req.body.rating );
    movie.updateRating();
    saveChangesToModel( res, movie );
};

exports.reviewMovie = ( req, res ) => {
    const movie = req.movie;
    const { username } = req.user;
    movie.addReview( req.body, username );
    updateRating( movie, req.body.rating, username );
    saveChangesToModel( res, movie );
};

exports.editMovie = ( req, res ) => {
    const movie = req.movie;
    movie.editMovie( req.body );
    saveChangesToModel( res, movie );
};

exports.removeReview = ( req, res ) => {
    const movie = req.movie;
    const { username } = req.user;
    const reviewId = req.params.reviewId;
    const reviewIndex = movie.getReviewIndex( reviewId );

    if ( movie.reviews[ reviewIndex ].author !== username ) {
        return res.unauthorized();
    }
    movie.removeReview( reviewIndex );

    const ratingIndex = movie.getRatingIndex( username );
    movie.deleteRating( ratingIndex );
    movie.updateRatingAverage();

    saveChangesToModel( res, movie );
};

exports.markReviewAsSpam = ( req, res ) => {
    const movie = req.movie;
    const reviewId = req.params.reviewId;
    const reviewIndex = movie.getReviewIndex( reviewId );

    movie.spamReview( reviewIndex );
    saveChangesToModel( res, movie );
};

exports.editReview = ( req, res ) => {
    const movie = req.movie;
    const { username } = req.user;
    const reviewId = req.params.reviewId;
    const reviewIndex = movie.getReviewIndex( reviewId );

    if ( movie.reviews[ reviewIndex ].author !== username ) {
        return res.unauthorized();
    }
    movie.editReview( req.body, reviewIndex );
    updateRating( movie, req.body.rating, username );

    saveChangesToModel( res, movie );
};
