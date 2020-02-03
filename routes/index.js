const express = require('express');
const router  = express.Router();
const Book = require('../models/book.model.js'); //requires the Book collection model
const Author = require('../models/author.model.js'); //requires the Author collection model

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// books route
router.get('/books', (req, res, next) => {
  Book.find()
  .then( allBooksFromDB => {
    //console.log('Retrieved books from DB: ', allBooksFromDB);
    res.render('books', {books: allBooksFromDB});
  })
  .catch( error => console.log('Error while getting the books from the DB: ', error))
})

// Create(GET) and Store(POST) a new book ---> books-add route
// It has to go first than books-details route because '/books/:bookId' will use anything that comes after /books/
router.get('/books/add', (req, res, next) => {
  Author.find()
  .then( availableAuthors => res.render('book-add', {availableAuthors}))
  .catch( err => console.log(`Err while displaying book input page: ${err}`) )  
})

router.post('/books/add', (req, res, next) => {
  Book.create(req.body)
  .then( savedBook => res.redirect('/books'))
  .catch( err => console.log( err ) )
})

// book-edit route
router.get('/books/edit/:bookId', (req, res, next) => {
  console.log( 'books to be edited: ', req.params.bookId )
  Book.findById(req.params.bookId)
  .then( book => res.render('book-edit', { book }) )
  .catch( err => console.log('Error while retrieving book details: ', err) )
})

router.post('/books/edit/:bookId', (req, res, next) => {
  console.log('This is the book being editted: ', req.params.bookId)
  Book.findByIdAndUpdate(req.params.bookId, req.body)
  .then( upBook => res.redirect('/books'))
  .catch( err => console.log(`Err while updating the specific book in the  DB: ${err}`) )
})

// books-details route
router.get('/books/:bookId', (req, res, next) => {
  //console.log('The ID from the URL is: ', req.params.bookId);
  Book.findById(req.params.bookId)
  .populate('author')
  .then( theBook => {
    //console.log( theBook.author)
    res.render('book-details', { book: theBook })
  })
  .catch( err => console.log('Error while retrieving book details: ', err) )  
});

// reviews/add/:bookId route to inclute users reviews
router.post('/reviews/add/:bookId', (req, res, next) => {
  console.log( 'this is the body', req.params.bookId)
  Book.update( {_id: req.params.bookId }, {$push: { reviews: req.body } } )
  .then( () => res.redirect(`/books/${req.params.bookId}`))
  .catch(err => console.log(`Err while updating the specific book in the  DB: ${err}`));
})


// author-add route
router.get('/authors/add', (req, res, next) => {
  res.render('user-add')
})

router.post('/author/add', (req, res, next) => {
  Author.create( req.body )
  .then( book => redirect('/books'))
  .catch( err => console.log( err ) )
})



module.exports = router;
