const mongoose = require( "mongoose" );

const Movie = mongoose.model( "Movie" );

module.exports = ( req, res, next ) => {
    const reviewId = req.params.reviewId;

    Movie.find( );
    return next();
};
