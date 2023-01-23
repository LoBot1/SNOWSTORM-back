var cors = require('cors')
const express = require("express");
const dbo = require("./db/db");
const bodyParser = require('body-parser');
const { ObjectId, ObjectID } = require("mongodb");
const app = express();
app.use(cors())
const port = 4444;


dbo.connectToServer();

app.get("/pokemonCatch/list", function (req, res) {
    //on se connecte à la DB MongoDB
    const dbConnect = dbo.getDb();
    //premier test permettant de récupérer mes pokemons !
    dbConnect
      .collection("pokemonCatch")
      .find({}) // permet de filtrer les résultats
      /*.limit(50) // pourrait permettre de limiter le nombre de résultats */
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching pokemons!");
        } else {
          res.json(result);
        }
      });
      /*
      Bref lisez la doc, 
      il y a plein de manières de faire ce qu'on veut :) 
      */
      
  });

  app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
  });