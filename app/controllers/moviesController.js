const extractObject = require( "../utilities" ).extractObject;

exports.getMovie = ( req, res ) => {
    const movie = req.movie;
    console.log( movie );
    if ( !movie ) {
        return res.notFound();
    }
    return res.success( extractObject(
        movie,
        [ "title", "description", "director", "categories", "cast", "rating", "releaseDate", "reviews", "picture" ]
    ) );
};
