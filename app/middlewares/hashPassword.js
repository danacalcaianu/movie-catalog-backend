const bcrypt = require( "bcrypt" );

module.exports = ( req, res, next ) => {
    const { password } = req.body;
    const saltRounds = 10;
    bcrypt.hash( password, saltRounds, ( err, hash ) => {
        req.hash = hash;
        return next();
    } );
};
