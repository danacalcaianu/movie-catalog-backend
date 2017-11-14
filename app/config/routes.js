const errorsController = require( "../controllers/errorsController" );
const usersController = require( "../controllers/usersController" );
const moviesController = require( "../controllers/moviesController" );

const validateToken = require( "../middlewares/validateToken" );
const authorize = require( "../middlewares/authorize" );
const checkExistingMovie = require( "../middlewares/checkExistingMovie" );
// add other middlewares that are used

const express = require( "express" );

const router = express.Router( );

// Add routes below
// Example: router.post/get/put/ ..../delete ( path ), middlewares ( if any ), controllerFunction );

// use apiDoc to generate documentation for API routes
// Details on how to use on: http://apidocjs.com/

/**
*    @apiGroup User
*    @api {post} /users/registration Adding an user to the db.
*    @apiParam {String} id  User ID required.
*    @apiParam {String} name  Mandatory name.
*    @apiParam {Number} age  Mandatory age. Minimum 18.
*    @apiParam {String} sex  Mandatory sex.
*    @apiExample {response} Example response:
*       {
*         "user": {
*            "id": 123456789,
*            "username": "user123"
*            "password": "pass123"
*            "name": "Ana",
*            "sex": "female",
*            "age": 30
*           }
*      }
*/
router.post( "/users/registration", authorize, usersController.register );

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
router.post( "/users/login", authorize, usersController.login );

/**
*    @apiGroup User
*    @api {put} /users/:userId/edit Edit the profile and filtering options.
*    @apiDescription Useful to change profile information
*    @apiParam {String} id  User ID required.
*    @apiParam {String} name  Mandatory name.
*    @apiParam {Number} age  Mandatory age. Minimum 18.
*    @apiParam {String} sex  Mandatory sex.
*/
router.put( "/users/:userId/edit", authorize, validateToken, usersController.edit );

/**
*    @apiGroup User
*    @api {delete} /users/:userId/deleteProfile Delete an user.
*    @apiParam {String} id  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.delete( "/users/:userId/deleteProfile", authorize, validateToken, usersController.delete );

/**
*    @apiGroup Movie
*    @api {get} /movies/:movieId/getMovie Get a movie.
*    @apiParam {String} id  Movie ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.get( "/movies/:movieId/getMovie", checkExistingMovie, moviesController.getMovie );

router.get( "/movies//getAll", checkExistingMovie, moviesController.getMovie );

router.get( "/test", function( req, res ) {
    res.json( { success: true } );
} );

router.use( errorsController.notFound );

module.exports = function( app ) {
    app.use( "/", router );
    app.use( errorsController.errorLogger );
    app.use( errorsController.errorHandler );
};
