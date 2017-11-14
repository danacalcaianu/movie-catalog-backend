const errorsController = require( "../controllers/errorsController" );
const usersController = require( "../controllers/usersController" );
const moviesController = require( "../controllers/moviesController" );
const validateToken = require( "../middlewares/validateToken" );
const checkExistingModel = require( "../middlewares/checkExistingModel" );
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
router.post( "/users/registration", checkExistingModel( "username", "User", "user" ), usersController.register );

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
*           }
*      }
*/
router.post( "/users/login", checkExistingModel( "username", "User", "user" ), usersController.login );

/**
*    @apiGroup User
*    @api {put} /users/:userId/edit Edit the profile and filtering options.
*    @apiDescription Useful to change profile information
*    @apiParam {String} id  User ID required.
*    @apiParam {String} password  Mandatory password.
*/
router.put( "/users/:userId/edit", checkExistingModel( "userId", "User", "user" ), validateToken, usersController.edit );

/**
*    @apiGroup User
*    @api {delete} /users/:userId/deleteProfile Delete an user.
*    @apiParam {String} id  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/users/:userId/deleteProfile", checkExistingModel( "userId", "User", "user" ), validateToken, usersController.delete );

/**
*    @apiGroup User
*    @api {delete} /users/:userId/addMovie Add a movie.
*    @apiParam {String} id  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.post( "/users/:userId/addMovie", checkExistingModel( "userId", "User", "user" ), validateToken, checkExistingModel( "title", "Movie", "movie" ), usersController.addMovie );

/**
*    @apiGroup User
*    @api {put} /users/:userId/rateMovie/:movieId Rate a movie.
*/
router.put( "/users/:userId/rateMovie/:movieId", checkExistingModel( "userId", "User", "user" ), validateToken, checkExistingModel( "movieId", "Movie", "movie" ), usersController.rateMovie );

/**
*    @apiGroup User
*    @api {put} /users/:userId/reviewMovie/:movieId Review a movie.
*/
router.put( "/users/:userId/reviewMovie/:movieId", checkExistingModel( "userId", "User", "user" ), validateToken, checkExistingModel( "movieId", "Movie", "movie" ), usersController.reviewMovie );

/**
*    @apiGroup Movie
*    @api {get} /movies/:movieId/getMovie Get a movie.
*    @apiParam {String} id  Movie ID required.
*    @apiSampleRequest http://localhost:3030/movies/1223frhs/getMovie
*/
router.get( "/movies/:movieId/getMovie", checkExistingModel( "movieId", "Movie", "movie" ), moviesController.getMovie );

/**
*    @apiGroup Movie
*    @api {get} /movies/getAll/:rating Get all movies.
*    @apiDescription returns all movies if rating param is missing, otherwise all movies based on the param value
*/
    //router.get( "/movies/getAll/:rating", moviesController.getAllMovies );

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
router.post( "/admins/registration", checkExistingModel( "username", "Admin", "admin" ), usersController.register );

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
router.post( "/admins/login", checkExistingModel( "username", "Admin", "admin" ), usersController.login );

/**
*    @apiGroup Admin
*    @api {put} /admins/:adminId/edit Edit the profile and filtering options.
*    @apiDescription Useful to change profile information
*    @apiParam {String} id  Admin ID required.
*    @apiParam {String} password  Mandatory password.
*/
router.put( "/admins/:adminId/edit", checkExistingModel( "adminId", "Admin", "admin" ), validateToken, usersController.edit );

/**
*    @apiGroup Admin
*    @api {delete} /admins/:adminId/adminProfile Delete an admin.
*    @apiParam {String} id Admin ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/admins/:adminId/delete", checkExistingModel( "adminId", "Admin", "admin" ), validateToken, usersController.delete );

router.get( "/test", function( req, res ) {
    res.json( { success: true } );
} );

router.use( errorsController.notFound );

module.exports = function( app ) {
    app.use( "/", router );
    app.use( errorsController.errorLogger );
    app.use( errorsController.errorHandler );
};
