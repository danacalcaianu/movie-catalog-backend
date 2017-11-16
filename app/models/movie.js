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
        default: 0,
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
    rating: [ {
        type: Number,
        min: 0,
        max: 5,
        default: [],
    } ],
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

movieSchema.methods.removeReview = function( reviewIndex ) {
    this.reviews.splice( reviewIndex, 1 );
};

movieSchema.methods.addOwner = function( userId ) {
    this.addedBy = userId;
};

movieSchema.methods.addId = function( ) {
    this.id = uid( 10 );
};

movieSchema.methods.addRating = function( rating ) {
    this.rating.push( rating );
};

movieSchema.methods.updateRating = function() {
    let total = 0;
    let count = 0;
    this.rating.forEach( function( element ) {
        total += element;
        count += 1;
    } );
    total /= count;
    this.rating = total;
};

movieSchema.methods.editMovie = function( body ) {
    const { title, director, picture, releaseDate, description, categories, cast } = body;
    this.title = title;
    this.director = director;
    this.releaseDate = releaseDate;
    this.description = description;
    this.picture = picture;
    this.categories = categories;
    this.cast = cast;
};

movieSchema.methods.spamReview = function( reviewIndex ) {
    const review = this.reviews[ reviewIndex ];
    review.markedAsSpam = true;
};
module.exports = mongoose.model( "Movie", movieSchema );
