const { extractObject } = require( "../utilities" );
const mongoose = require( "mongoose" );

const Movie = mongoose.model( "Movie" );
exports.getMovie = ( req, res ) => {
    const movie = req.movie;
    if ( !movie ) {
        return res.notFound();
    }
    return res.success( extractObject(
        movie,
        [ "title", "description", "director", "categories",
            "cast", "rating", "releaseDate", "reviews", "picture" ],
    ) );
};

exports.getAllMovies = ( req, res ) => {
    const field = req.body.field;
    return Movie.find(
        field,
        ( err, results ) => {
            if ( err ) {
                return res.serverError();
            }
            return res.success( results );
        } );
};
