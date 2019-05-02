const express = require('express');
const router = express.Router();
const pg = require('pg');

const config = {
  database: 'prime', // name of your database
  host: 'localhost', // where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time?
  idleTimeoutMillis: 30000 // 30 second time out
};

const pool = new pg.Pool(config);

pool.on("connect", () => {
  console.log("connected to postgres");

});

pool.on("error", (err) => {
  console.log("error connecting to postgres", err);
});
// Using a router drops the part of the url used to get here
// http://localhost:5000/books/ would '/'
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books";';
  // errorMakingQuery is a bool, result is an object
  pool.query(queryText).then(result => {

    // console.log(result);
    // Send back the results
    res.send({ books: result.rows });
  }).catch(error => {
    console.log('error in GET', error);
    res.sendStatus(500);
  });
});


router.post('/',  (req, res) => {
  let book = req.body;
  console.log(book);
  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;

  pool.query(queryText, [book.author, book.title]).then(result => {

    // console.log(result);
    // Send back the results
    res.send({ books: result.rows });
  }).catch(error => {
    console.log('error in POST', error);
    res.sendStatus(500);
  });
});

// PUT http://localhost:5000/books/5
// ^ Update book with id of 5, body is not visible
// PUT is similar to POST + DELETE when using PG
router.put('/:id',  (req, res) => {
  let book = req.body; // Book with updated content
  let id = req.params.id; // id of the thing to update

  console.log('Put route called with book of ', book);
  console.log('Put route called with id of', id);


  // YOUR CODE HERE
  const queryString = `UPDATE "prime" SET "visited"=true WHERE id=$1;`;

  pool.query(queryString, [id])
        .then((response) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('Error updating :', err);
            res.sendStatus(500);
        });


});

// DELETE http://localhost:5000/books/5
// ^ Delete book with the id of 5
// DELETE is similar to GET when using PG
router.delete('/:id',  (req, res) => {
  let id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);

  // YOUR CODE HERE

  const queryString = `DELETE FROM "restaurants-test" WHERE id=$1;`;

  pool.query(queryString, [id])
      .then((response) => {
          res.sendStatus(200);
      })
      .catch((err) => {
          console.log('Error deleting: ', err);
      });

});

module.exports = router;
