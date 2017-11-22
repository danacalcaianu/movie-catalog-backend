module.exports = ( req, res, next ) => {
    const { user } = req;
    if ( user.deleted === true || user.blocked === true ) {
        return res.forbidden();
    }
    return next();
};
