const { extractObject, queryModel, queryBatch } = require( "../utilities" );
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
    const field = undefined;
    const { param } = req.params;
    const movies = queryModel( Movie, field );
    movies
        .then( ( results ) => {
            if ( param ) {
                const final = results.filter( ( item ) => item.title.indexOf( param ) !== -1 );
                res.success( final );
                return;
            }
            res.success( results );
        } )
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

exports.getBatchOfMovies = async ( req, res ) => {
    const { page: pageNumber } = req.params;
    const limit = 10;

    const movies = queryBatch( Movie, pageNumber, limit );
    movies
        .then( ( results ) => res.success( results ) )
        .catch( ( ) => res.notFound() );
};
