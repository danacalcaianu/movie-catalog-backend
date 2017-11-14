const mongoose = require( "mongoose" );

module.exports = ( reqParamter, model, result ) => ( req, res, next ) => {
    const identifier = req.params[ reqParamter ] || req.body[ reqParameter ];
    if ( !identifier ) {
        return res.preconditionFailed( "missing_parameter" );
    }

    const Collection = mongoose.model( model );
    return Collection.findOne(
            { identifier },
            ( err, foundModel ) => {
                if ( err ) {
                    return res.serverError( );
                }
                req[ result ] = foundModel;
                return next( );
            } );
};
