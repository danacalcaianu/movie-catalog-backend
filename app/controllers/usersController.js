const mongoose = require( "mongoose" );
const { saveChangesToModel, updateRating } = require( "../utilities/index" );

const User = mongoose.model( "User" );
const Movie = mongoose.model( "Movie" );

/* eslint consistent-return: "off" */
exports.register = ( req, res ) => {
    let { user } = req;
    if ( user ) {
        return res.preconditionFailed( "existing_user" );
    }
    user = new User( req.body );
    user.setId();
    user.password = req.hash;
    saveChangesToModel( res, user );
};

exports.login = ( req, res ) => {
    const { token } = req;

    return res.json( {
        success: true,
        token,
    } );
};

exports.edit = ( req, res ) => {
    const { user } = req;

    user.editUser( req.body );
    saveChangesToModel( res, user );
};

exports.delete = ( req, res ) => {
    const { user } = req;

    user.deleted = true;
    saveChangesToModel( res, user );
};

exports.addMovie = ( req, res ) => {
    const { user } = req;
    let { movie } = req;

    if ( movie ) {
        return res.preconditionFailed( "existing_movie" );
    }
    movie = new Movie( req.body );
    movie.addOwner( user.id );
    movie.addId( );
    saveChangesToModel( res, movie );
};

exports.rateMovie = ( req, res ) => {
    const { movie } = req;
    movie.addRating( req.body.rating );
    movie.updateRating();
    saveChangesToModel( res, movie );
};

exports.reviewMovie = ( req, res ) => {
    const { movie } = req;
    const { username } = req.user;
    movie.addReview( req.body, username );
    updateRating( movie, req.body.rating, username );
    saveChangesToModel( res, movie );
};

exports.editMovie = ( req, res ) => {
    const { movie } = req;
    movie.editMovie( req.body );
    saveChangesToModel( res, movie );
};

exports.removeReview = ( req, res ) => {
    const { movie } = req;
    const { username } = req.user;
    const { reviewId } = req.params;
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
    const { movie } = req;
    const { reviewId } = req.params;
    const reviewIndex = movie.getReviewIndex( reviewId );

    movie.spamReview( reviewIndex );
    saveChangesToModel( res, movie );
};

exports.editReview = ( req, res ) => {
    const { movie } = req;
    const { username } = req.user;
    const { reviewId } = req.params;
    const reviewIndex = movie.getReviewIndex( reviewId );

    if ( movie.reviews[ reviewIndex ].author !== username ) {
        return res.unauthorized();
    }
    movie.editReview( req.body, reviewIndex );
    updateRating( movie, req.body.rating, username );

    saveChangesToModel( res, movie );
};
