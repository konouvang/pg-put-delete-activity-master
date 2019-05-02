const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const booksRouter = require('./routes/book.js');

app.use(bodyParser.urlencoded({extended: true}));

app.use('/books', booksRouter);

// Serve back static files by default
app.use(express.static('server/public'))

// Start listening for requests on a specific port
app.listen(PORT, () => {
  console.log('listening on port', PORT);
});
