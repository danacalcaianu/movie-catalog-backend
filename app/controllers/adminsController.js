const mongoose = require( "mongoose" );
const extractObject = require( "../utilities" ).extractObject;
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcrypt-nodejs" );
const saveChangesToModel = require( "../utilities/index" ).saveChangesToModel;

const Admin = mongoose.model( "Admin" );
const SECRET = "superSuperSecret";

/* eslint consistent-return: "off" */
exports.register = ( req, res ) => {
    let admin = req.admin;
    if ( admin ) {
        return res.preconditionFailed( "existing_admin" );
    }
    admin = new Admin( req.body );
    admin.setId();
    admin.setPass( req.body.password );
    admin.save( ( err, savedAdmin ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedAdmin,
            [ "id", "username" ] ) );
    } );
};

exports.login = ( req, res ) => {
    const admin = req.admin;
    if ( !req.body.password ) {
        res.status( 400 ).send( "password required" );
        return;
    }
    const password = bcrypt.compareSync( req.body.password, admin.password );

    if ( !admin || !password ) {
        return res.json( {
            success: false,
            message: "Authentication failed.",
        } );
    }
    const token = jwt.sign( admin.toObject(), SECRET, { expiresIn: 1440 } );
    return res.json( {
        success: true,
        token,
    } );
};

exports.edit = ( req, res ) => {
    const admin = req.admin;
    const { email, firstName, lastName, avatar } = req.body;

    admin.email = email || admin.email;
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.avatar = avatar;
    saveChangesToModel( res, admin );
};

exports.deleteProfile = ( req, res ) => {
    const admin = req.admin;

    admin.deleted = true;
    admin.save( ( err, savedAdmin ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedAdmin,
            [ "id", "deleted" ],
        ) );
    } );
};

exports.deleteMovie = ( req, res ) => {
    const movie = req.movie;
    const admin = req.admin;

    movie.deleted = true;
    movie.deletedBy = admin.id;
    movie.save( ( err, savedMovie ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedMovie,
            [ "id", "deleted", "deletedBy" ],
        ) );
    } );
};

exports.blockUser = ( req, res ) => {
    const admin = req.admin;
    const user = req.user;
    const blockedReason = req.body.blockedReason;

    user.blocked = true;
    user.blockedBy = admin.id;
    user.blockedReason = blockedReason;

    saveChangesToModel( res, user );
};

exports.removeReview = ( req, res ) => {
    const movie = req.movie;
    const reviewId = req.params.reviewId;

    if ( !movie ) {
        return res.notFound();
    }

    const reviewIndex = movie.getReviewIndex( reviewId );
    const review = movie.getReviewForIndex( reviewIndex );
    const ratingIndex = movie.getRatingIndex( review.author );
    movie.deleteRating( ratingIndex );
    movie.updateRatingAverage();
    movie.removeReview( reviewIndex );
    saveChangesToModel( res, movie );
};
