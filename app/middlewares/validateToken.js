const jwt = require( "jsonwebtoken" );

const SECRET = "superSuperSecret";

/* eslint consistent-return: "off" */
module.exports = ( req, res, next ) => {
    const token = req.body.token || req.query.token || req.headers[ "x-access-token" ];
    const id = req.user.id || req.admin.id;
    if ( token ) {
        jwt.verify( token, SECRET, ( err, decoded ) => {
            if ( err ) {
                return res.json( {
                    success: false,
                    message: "Failed to authenticate token.",
                } );
            }
            req.decoded = decoded;
            if ( id !== decoded.id ) {
                return res.unauthorized( );
            }
            return next( );
        } );
    } else {
        return res.unauthorized( );
    }
};
