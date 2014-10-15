var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Library

var books = [];
var idCounter = 1;

function Book(title, author) {
	this.id = idCounter;
	this.title = title;
	this.author = author;
	books.push(this);
	idCounter++;
}

Book.destroy = function(id) {
	books.forEach(function(book) {
		if(Number(id) === book.id) {
			var index = books.indexOf(book);
			books.splice(index, 1);
		}
	});
};

Book.findById = function(id) {
	var foundBook;
	books.forEach(function(book){
		if(Number(id) === book.id){
			foundBook = book;
		}
	});
	return foundBook;
};

// Seeding database aka array
function seed() {
	new Book("Ishmael", "Daniel Quinn");
	new Book("The Code Book", "Someguy");
	new Book("Old Man's War", "John Scalzi");
}
seed();

//Home
app.get('/', function(req, res){
  res.send('home');
});

//Index
app.get('/books', function(req, res){
  res.render('library/index', {allBooks: books});
});

//New
app.get('/books/new', function(req, res){
	res.render("library/new");
});

//Create
app.post('/books', function(req, res) {
	var title = req.body.book.title;
	var author = req.body.book.author;
  new Book(title, author);
  res.redirect('/books'); 
});

//Show
app.get('/books/:id', function(req, res) {
  res.send("impliment show book. showing book " + req.params.id);
});

//Edit
app.get('/books/:id/edit', function(req, res) {
	//find our book
	var id = req.params.id;
	var foundBook = Book.findById(id);
  res.render('library/edit', {book: foundBook});
});

//Update
app.put('/books/:id', function(req, res) {
	var id = req.params.id;
  var foundBook = Book.findById(id);
  foundBook.title = req.body.book.title;
  foundBook.author = req.body.book.author;
  res.redirect('/books');
});

//Delete
app.delete('/books/:id', function(req, res) {
	var id = req.params.id;
	Book.destroy(id);
  res.redirect('/books');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});