const { extractObject, queryModel } = require( "../utilities" );
const mongoose = require( "mongoose" );

const Movie = mongoose.model( "Movie" );
exports.getMovie = ( req, res ) => {
    const { movie } = req;
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
    const { field } = req.body;
    const movies = queryModel( Movie, field );
    movies
        .then( ( results ) => res.success( results ) )
        .catch( ( err ) => res.send( err ) );
};

exports.getMoviesForUser = ( req, res ) => {
    const { id } = req.user;
    const queryCondition = { addedBy: id };

    const movies = queryModel( Movie, queryCondition );
    movies
        .then( ( results ) => res.success( results ) )
        .catch( ( ) => res.notFound() );
};
