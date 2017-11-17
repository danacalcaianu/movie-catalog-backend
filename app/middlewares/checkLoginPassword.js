const bcrypt = require( "bcrypt" );

module.exports = ( ) => ( req, res, next ) => {
    const person = req.user || req.admin;
    if ( !req.body.password ) {
        res.status( 400 ).send( "password required" );
        return;
    }
    const password = bcrypt.compareSync( req.body.password, person.password );

    if ( !person || !password ) {
        res.unauthorized();
        return;
    }
    next();
};
