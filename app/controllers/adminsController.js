const mongoose = require( "mongoose" );
const extractObject = require( "../utilities" ).extractObject;
const jwt = require( "jsonwebtoken" );

const Admin = mongoose.model( "Admin" );
const SECRET = "superSuperSecret";

/* eslint consistent-return: "off" */
exports.register = ( req, res ) => {
    let admin = req.admin;
    if ( admin ) {
        return res.preconditionFailed( "existing_admin" );
    }
    admin = new Admin( req.body );
    admin.setPass( req.body.password );
    admin.save( ( err, savedAdmin ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedAdmin,
            [ "id", "username" ] ) );
    } );
};

exports.login = ( req, res ) => {
    const admin = req.admin;
    if ( !req.body.password ) {
        res.status( 400 ).send( "password required" );
        return;
    }

    const password = req.body.password;
    if ( admin ) {
        if ( admin.password !== password ) {
            return res.json( {
                success: false,
                message: "Authentication failed. Wrong password.",
            } );
        }

        const token = jwt.sign( admin.toObject(), SECRET, { expiresIn: 1440 } );
        return res.json( {
            success: true,
            token,
        } );
    }
    return res.json( {
        success: false,
        message: "Authentication failed. Admin not found.",
    } );
};

exports.edit = ( req, res ) => {
    const admin = req.admin;
    const { email, firstName, lastName, avatar } = req.body;

    admin.email = email;
    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.avatar = avatar;

    admin.save( ( err, savedAdmin ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedAdmin,
            [ "id", "email", "firstName", "lastName", "avatar" ] ) );
    } );
};

exports.deleteProfile = ( req, res ) => {
    const admin = req.admin;

    admin.deleted = true;
    admin.save( ( err, savedAdmin ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedAdmin,
            [ "id", "deleted" ],
        ) );
    } );
    res.success( );
};

exports.deleteMovie = ( req, res ) => {
    const movie = req.movie;
    const admin = req.admin;

    movie.deleted = true;
    movie.deletedBy = admin.id;
    movie.save( ( err, savedMovie ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedMovie,
            [ "id", "deleted", "deletedBy" ],
        ) );
    } );
};

exports.blockUser = ( req, res ) => {
    const user = req.user;
    const admin = req.admin;
    const blockedReason = req.blockEDReason;

    user.blocked = true;
    user.blockedBy = admin.id;
    user.blockedReason = blockedReason;

    user.save( ( err, savedUser ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedUser,
            [ "id", "blocked", "blockedBy", "blockedReason" ],
        ) );
    } );
};
