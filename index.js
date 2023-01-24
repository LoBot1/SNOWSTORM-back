var cors = require('cors')
const express = require("express");
const dbo = require("./db/db");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { ObjectId, ObjectID } = require("mongodb");
const app = express();
app.use(cors())
const port = 4444;


dbo.connectToServer();

app.post('/user/post', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb();
    if (!(body.email && body.password && body.firstname && body.name && body.adress)) {
      res.status(400).send("Tout doit être complété");
    }
    dbConnect.collection("user").insertOne({firstname:body.firstname,name:body.name,email:body.email,adress:body.adress,password:body.password});
}); 

app.post('/support/post', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  if (!(body.object && body.email && body.img && body.name && body.text)) {
    res.status(400).send("Tout doit être complété");
  }
  dbConnect.collection("support").insertOne({email:body.email,object:body.object,text:body.text,img:body.img});
  
}); 

app.get('/user/getAll', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("user").find({}).toArray(function (err, result) {
    res.json(result);
  });
}); 

app.get('/support/getAll', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("support").find({}).toArray(function (err, result) {
    console.log(result)
    res.json(result);
  });
}); 

app.get('/user/loger', jsonParser, (req, res) => {
  mail = req.query.email
  pass = req.query.password
  console.log(pass,mail,req.query.non)
  const dbConnect = dbo.getDb();
  dbConnect.collection("user").findOne({email:mail,password:pass}).then(function (result,err) {
    console.log(result)
    const token = jwt.sign(
      { user_id: result._id},
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    res.json(result);
  });
});

//user-------------------------user-------------user-------------user-----------------------------------------------------
app.get("/user/list", function (req, res) {
  //on se connecte à la DB MongoDB
  const dbConnect = dbo.getDb();
  //premier test permettant de récupérer mes pokemons !
  dbConnect
    .collection("user")
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

//user-------------------------user-------------user-------------user-----------------------------------------------------

//PRODUIT-------------------------PRODUIT-------------PRODUIT-------------PRODUIT-----------------------------------------------------

//RECUPERER-TOUT-LES-PRODUIT

app.get("/Produit/list", function (req, res) {
  //on se connecte à la DB MongoDB
  const dbConnect = dbo.getDb();
  //premier test permettant de récupérer mes pokemons !
  dbConnect
    .collection("Produit")
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
//INSERER-UN-NOUVEAU-PRODUIT

app.post('/Produit/insert', jsonParser, (req, res) => {
  const body = req.body;
  console.log('Got body:', body);
  const dbConnect = dbo.getDb();
  dbConnect
    .collection("Produit")
    .insertOne({...body})
    .then(function (result, error){
      if(error) {
        res.json({error : error.message})
      }
      res.json({result})
    });
});

app.post('/Produit/update',jsonParser,(req, res) => {
  const dbConnect = dbo.getDb(); 
  dbConnect.collection('Produit').updateMany(
    { _id: ObjectId(req.body._id) }, 
    { $set: {name: req.body.name,type1:req.body.type1,type2:req.body.type2,desc:req.body.desc,num:req.body.num}
  }, function(err, result) {
       if (err) {
        console.log(err);
        res.send(err.message);
      } else {
        console.log("Post Updated successfully");
        res.json(result);
    } 
 });
});

//PRODUIT-------------------------PRODUIT-------------PRODUIT-------------PRODUIT-----------------------------------------------------
app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
