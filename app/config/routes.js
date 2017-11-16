const errorsController = require( "../controllers/errorsController" );
const usersController = require( "../controllers/usersController" );
const moviesController = require( "../controllers/moviesController" );
const checkOwnership = require( "../middlewares/checkOwnership" );
const adminsController = require( "../controllers/adminsController" );
const validateToken = require( "../middlewares/validateToken" );
const checkExistingModel = require( "../middlewares/checkExistingModel" );
const checkRequestParameter = require( "../middlewares/checkRequestParameter" );
const getMovieForReview = require( "../middlewares/getMovieForReview" );
const checkUserAccess = require( "../middlewares/checkUserAccess" );
const checkEmailExists = require( "../middlewares/checkEmailExists" );
const checkEmailFormat = require( "../middlewares/checkEmailFormat" );


const express = require( "express" );

const router = express.Router( );

/**
*    @apiGroup User
*    @api {post} /users/registration Adding an user to the db.
*    @apiParam {String} id  User ID required.
*    @apiParam {String} username  Mandatory  username.
*    @apiParam {String} firstName  Mandatory first name.
*    @apiParam {String} lastName  Mandatory last name.
*    @apiParam {String} email  Mandatory email.
*    @apiExample {response} Example response:
*       {
*         "user": {
*            "id": 123456789,
*            "username": "user123"
*           }
*      }
*/
router.post( "/users/registration",
    checkExistingModel( "username", "User", "user" ),
    checkEmailExists( "User" ),
    checkEmailFormat(),
    usersController.register );

/**
*    @apiGroup User
*    @api {post} /users/login User login route.
*    @apiParam {String} id  User ID required.
*    @apiParam {String} username  User username required.
*    @apiParam {String} password  User password required.
*    @apiExample {response} Example response:
*       {
*         "user": {
*            "token": dahljkhajfhajku32974eq9kjh
*
*      }
*/
router.post( "/users/login",
    checkExistingModel( "username", "User", "user" ),
    checkUserAccess(),
    usersController.login );

/**
*    @apiGroup User
*    @api {put} /users/:userId/edit Edit the profile and filtering options.
*    @apiDescription Useful to change profile information
*    @apiParam {String} id  User ID required.
*    @apiParam {String} password  Mandatory password.
*/
router.put( "/users/:userId/edit",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    usersController.edit );

/**
*    @apiGroup User
*    @api {delete} /users/:userId/deleteProfile Delete an user.
*    @apiParam {String} id  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/users/:userId/deleteProfile",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    usersController.delete );

/**
*    @apiGroup User
*    @api {delete} /users/:userId/addMovie Add a movie.
*    @apiParam {String} id  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.put( "/users/:userId/addMovie",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "title", "Movie", "movie" ),
    usersController.addMovie );

/**
*    @apiGroup User
*    @api {put} /users/:userId/rateMovie/:movieId Rate a movie.
*/
router.put( "/users/:userId/rateMovie/:movieId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    usersController.rateMovie );

/**
*    @apiGroup User
*    @api {put} /users/:userId/reviewMovie/:movieId Review a movie.
*/
router.put( "/users/:userId/reviewMovie/:movieId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    usersController.reviewMovie );

/**
*    @apiGroup User
*    @api {put} /users/:userId/editMovie/:movieId Edit a movie.
*/
router.put( "/users/:userId/editMovie/:movieId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    checkOwnership( ),
    usersController.editMovie );

/**
*    @apiGroup Movie
*    @api {get} /movies/:movieId/getMovie Get a movie.
*    @apiParam {String} id  Movie ID required.
*    @apiSampleRequest http://localhost:3030/movies/1223frhs/getMovie
*/
router.get( "/movies/:movieId/getMovie",
    checkExistingModel( "movieId", "Movie", "movie" ),
    moviesController.getMovie );

/**
*    @apiGroup Movie
*    @api {get} /movies/getAll/:param Get all movies.
*    @apiDescription returns all movies if param is missing, otherwise filters by param value (rating, categories)
*/
router.get( "/movies/getAll/:param?",
    checkRequestParameter,
    moviesController.getAllMovies );

/**
*    @apiGroup Admin
*    @api {post} /admins/registration Adding an admin to the db.
*    @apiParam {String} id  Admin ID required.
*    @apiParam {String} username  Mandatory  username.
*    @apiParam {String} firstName  Mandatory first name.
*    @apiParam {String} lastName  Mandatory last name.
*    @apiParam {String} email  Mandatory email.
*    @apiExample {response} Example response:
*       {
*         "admin": {
*            "id": 123456789,
*            "username": "user123"
*           }
*      }
*/
router.post( "/admins/registration",
    checkEmailExists( "User" ),
    checkExistingModel( "username", "Admin", "admin" ),
    adminsController.register );

/**
*    @apiGroup Admin
*    @api {post} /admins/login Admin login route.
*    @apiParam {String} id  Admin ID required.
*    @apiParam {String} username  Admin username required.
*    @apiParam {String} password  Admin password required.
*    @apiExample {response} Example response:
*       {
*         "user": {
*            "token": dahljkhajfhajku32974eq9kjh
*           }
*      }
*/
router.post( "/admins/login",
    checkExistingModel( "username", "Admin", "admin" ),
    adminsController.login );

/**
*    @apiGroup Admin
*    @api {put} /admins/:adminId/edit Edit the profile and filtering options.
*    @apiDescription Useful to change profile information
*    @apiParam {String} id  Admin ID required.
*    @apiParam {String} password  Mandatory password.
*/
router.put( "/admins/:adminId/edit",
    checkExistingModel( "adminId", "Admin", "admin" ),
    validateToken,
    adminsController.edit );

/**
*    @apiGroup Admin
*    @api {delete} /admins/:adminId/deleteProfile Delete an admin.
*    @apiParam {String} adminId Admin ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/admins/:adminId/deleteProfile",
    checkExistingModel( "adminId", "Admin", "admin" ),
    validateToken,
    adminsController.deleteProfile );

/**
*    @apiGroup Admin
*    @api {delete} /admins/:adminId/deleteMovie/:movieId Delete a movie from an admin profile.
*    @apiParam {String} adminId Admin ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/admins/:adminId/deleteMovie/:movieId",
    checkExistingModel( "adminId", "Admin", "admin" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    adminsController.deleteMovie,
);

/**
*    @apiGroup Admin
*    @api {delete} /admins/:adminId/block/:userId Block a user from an admin profile.
*    @apiParam {String} adminId Admin ID required.
*    @apiParam {String} userId User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.put( "/admins/:adminId/block/:userId",
    checkExistingModel( "adminId", "Admin", "admin" ),
    validateToken,
    checkExistingModel( "userId", "User", "user" ),
    adminsController.blockUser );

/**
*    @apiGroup Admin
*    @api {delete} /admins/:adminId/deleteReview/:reviewId Block a user from an admin profile.
*    @apiParam {String} adminId Admin ID required.
*    @apiParam {String} userId User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/admins/:adminId/deleteReview/:reviewId",
    checkExistingModel( "adminId", "Admin", "admin" ),
    validateToken,
    getMovieForReview,
    adminsController.removeReview,
);

router.get( "/test", ( req, res ) => {
    res.json( { success: true } );
} );

router.use( errorsController.notFound );

module.exports = ( app ) => {
    app.use( "/", router );
    app.use( errorsController.errorLogger );
    app.use( errorsController.errorHandler );
};
