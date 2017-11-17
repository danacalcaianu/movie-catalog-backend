const mongoose = require( "mongoose" );
const uid = require( "uid" );

const Schema = mongoose.Schema;

const reviewSchema = new Schema( {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    markedAsSpam: { type: Boolean, default: false },
} );

const movieSchema = new Schema( {
    id: { type: String, required: true },
    title: { type: String, required: true },
    director: String,
    cast: [ String ],
    categories: {
        type: String,
        enum: [ "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi" ],
        required: true,
    },
    releaseDate: Date,
    description: { type: String, required: true },
    ratings: [ { rating: { type: Number, min: 0, max: 5 }, owner: String } ],
    averageRating: Number,
    picture: String,
    addedBy: String, // userId / adminId
    deletedBy: String, // adminId
    deleted: { type: Boolean, default: false },
    reviews: { type: [ reviewSchema ], default: [ ] },
} );

/* eslint func-names : off */
movieSchema.methods.createMovie = function( data ) {
    this.title = data.title;
    this.description = data.description;
    this.categories = data.categories;
    return this;
};

movieSchema.methods.addReview = function( body, author ) {
    const { title, description, rating } = body;
    const review = {
        title,
        description,
        rating,
        author,
        id: uid( 10 ),
    };
    return this.reviews.push( review );
};

movieSchema.methods.getReviewIndex = function( reviewId ) {
    const index = this.reviews.map( review => review.id ).indexOf( reviewId );
    return index;
};

movieSchema.methods.getReviewForIndex = function( reviewIndex ) {
    const review = this.reviews[ reviewIndex ];
    return review;
};

movieSchema.methods.removeReview = function( reviewIndex ) {
    this.reviews.splice( reviewIndex, 1 );
};

movieSchema.methods.addOwner = function( userId ) {
    this.addedBy = userId;
};

movieSchema.methods.addId = function( ) {
    this.id = uid( 10 );
};

movieSchema.methods.addRating = function( rating, author ) {
    const newRating = {
        rating,
        owner: author,
    };
    this.ratings.push( newRating );
};

movieSchema.methods.updateRating = function ( newRating, index ) {
    const currentRating = this.ratings[ index ];
    currentRating.rating = newRating;
};

movieSchema.methods.getRatingIndex = function( owner ) {
    const index = this.ratings.map( rating => rating.owner ).indexOf( owner );
    return index;
};

movieSchema.methods.deleteRating = function ( ratingIndex ) {
    this.ratings.splice( ratingIndex, 1 );
};

movieSchema.methods.updateRatingAverage = function() {
    let average = 0;
    if ( this.ratings.length === 0 ) {
        this.averageRating = 0;
        return;
    }
    const total = this.ratings
        .map( ( object ) => object.rating )
        .reduce( ( acc, current ) => acc + current, 0 );

    average = total / this.ratings.length;
    this.averageRating = average.toFixed( 2 );
};

movieSchema.methods.editMovie = function( body ) {
    const { title, director, picture, releaseDate, description, categories, cast } = body;
    this.title = title || this.title;
    this.director = director;
    this.releaseDate = releaseDate;
    this.description = description || this.description;
    this.picture = picture;
    this.categories = categories || this.categories;
    this.cast = cast;
};

movieSchema.methods.spamReview = function( reviewIndex ) {
    const review = this.reviews[ reviewIndex ];
    review.markedAsSpam = true;
};

movieSchema.methods.editReview = function( body, index ) {
    const { title, description, rating } = body;
    const review = this.reviews[ index ];
    review.title = title || review.title;
    review.description = description || review.description;
    review.rating = rating;
};

module.exports = mongoose.model( "Movie", movieSchema );
