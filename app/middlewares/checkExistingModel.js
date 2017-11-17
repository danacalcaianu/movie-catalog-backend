const mongoose = require( "mongoose" );

module.exports = ( reqParameter, model, result, needsAccess = false ) => ( req, res, next ) => {
    let property = reqParameter;
    const identifier = req.params[ reqParameter ] || req.body[ reqParameter ];

    if ( !identifier ) {
        return res.preconditionFailed( "missing_parameter" );
    }
    if ( reqParameter.includes( "Id" ) ) {
        property = "id";
    }
    const Collection = mongoose.model( model );

    if ( needsAccess ) {
        return Collection
            .findOne( { [ `${ property }` ]: identifier } )
            .and( [
                { blocked: false },
                { deleted: false },
            ] )
            .exec( ( err, foundModel ) => {
                if ( err ) {
                    return res.serverError( );
                }
                req[ result ] = foundModel;
                return next( );
            } );
    }
    return Collection
        .findOne( { [ `${ property }` ]: identifier } )
        .exec( ( err, foundModel ) => {
            if ( err ) {
                return res.serverError( );
            }
            req[ result ] = foundModel;
            return next( );
        } );
};
