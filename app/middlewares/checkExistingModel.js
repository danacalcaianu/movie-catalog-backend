const mongoose = require( "mongoose" );

module.exports = ( reqParameter, model, result ) => ( req, res, next ) => {
    console.log( reqParameter );
    let property = reqParameter;
    const identifier = req.params[ reqParameter ] || req.body[ reqParameter ];
    if ( !identifier ) {
        return res.preconditionFailed( "missing_parameter" );
    }
    if ( reqParameter.includes( "Id" ) ) {
        property = "id";
    }
    const Collection = mongoose.model( model );
    return Collection.findOne(
        { [ `${ property }` ]: identifier },
        ( err, foundModel ) => {
            if ( err ) {
                return res.serverError( );
            }
            req[ result ] = foundModel;
            return next( );
        } );
};
