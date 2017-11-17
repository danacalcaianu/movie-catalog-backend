module.exports = () => ( req, res, next ) => {
    const password = req.body.password;
    if ( !( /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test( password ) ) ) {
        return res.preconditionFailed( "Password must contain minimum eight characters, at least one letter, one number and one special character!" );
    }
    return next();
};
