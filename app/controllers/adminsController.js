const mongoose = require( "mongoose" );
const { extractObject } = require( "../utilities" );
const { saveChangesToModel } = require( "../utilities/index" );

const Admin = mongoose.model( "Admin" );

/* eslint consistent-return: "off" */
exports.register = ( req, res ) => {
    let { admin } = req;
    if ( admin ) {
        return res.preconditionFailed( "existing_admin" );
    }
    admin = new Admin( req.body );
    admin.setId();
    admin.password = req.hash;
    saveChangesToModel( res, admin );
};

exports.login = ( req, res ) => {
    const { token } = req;
    return res.json( {
        success: true,
        token,
    } );
};

exports.edit = ( req, res ) => {
    const { admin } = req;
    admin.edit( req.body );
    saveChangesToModel( res, admin );
};

exports.deleteProfile = ( req, res ) => {
    const { admin } = req;

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
    const { movie } = req;
    const { admin } = req;

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
    const { admin } = req;
    const { user } = req;
    const { blockedReason } = req.body;

    user.blocked = true;
    user.blockedBy = admin.id;
    user.blockedReason = blockedReason;

    saveChangesToModel( res, user );
};

exports.removeReview = ( req, res ) => {
    const { movie } = req;
    const { reviewId } = req.params;
    const reviewIndex = movie.getReviewIndex( reviewId );
    const review = movie.getReviewForIndex( reviewIndex );
    const ratingIndex = movie.getRatingIndex( review.author );

    movie.deleteRating( ratingIndex );
    movie.updateRatingAverage();
    movie.removeReview( reviewIndex );
    saveChangesToModel( res, movie );
};
