var cors = require('cors')
const express = require("express");
const dbo = require("./db/db");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { ObjectId, ObjectID } = require("mongodb");
const app = express();
app.use(cors())
app.use(cors())
const port = 4444;
dbo.connectToServer();




// const stripe = require('stripe')('sk_test_51MUBAvIG0wu5IZ8aFhWYMB94LJDMBXqIfMfI6lyaIitg1H6Mp2ERMSvtnyQIX5iI0Nx6xuw3z8HA2dUoidm2l2L800EuoasoOE');
// app.use(express.static('public'));

// const YOUR_DOMAIN = 'http://localhost:4444';

// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price: '{{price_1MUUUsIG0wu5IZ8awvqbSn5K}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: "http://localhost:3000/success", 
//     cancel_url: "http://localhost:3000/cancel", 
//   });

//   res.redirect(303, session.url);
// });




//SUPPORT-------------------------SUPPORT-------------SUPPORT-------------SUPPORT-----------------------------------------------------

// ENVOIE DU FORMULAIRE DE SUPPORT 

app.post('/support/post', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  if (!(body.object && body.email && body.img && body.name && body.text)) {
    res.status(400).send("Tout doit être complété");
  }
  dbConnect.collection("support").insertOne({email:body.email,object:body.object,text:body.text,img:body.img});
}); 

// GET ALL TICKET SUPPORT

app.get('/support/getAll', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("support").find({}).toArray(function (err, result) {
    console.log(result)
    res.json(result);
  });
}); 







// CRUD PRODUCT

app.get('/product/getAll', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("produit").find({}).toArray(function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      console.log(result)
      res.json(result);
    }
  });
}); 


app.post('/product/insert', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("produit").insertOne({name:body.name,price:body.price,description:body.description,img:body.img}).then(function (result, err){
    if (err) {
        console.log(err);
        res.send(err.message);
    } else {
        console.log(result);
        res.json(result);
    }
  });
});

// UPDATE PRODUIT

app.post('/product/update',jsonParser,(req, res) => {
  const dbConnect = dbo.getDb();
  const body = req.body;
  dbConnect.collection('produit').updateOne({_id: ObjectId(body._id)}, {$set:{name: req.body.name,type1:req.body.type1,type2:req.body.type2,desc:req.body.desc,num:req.body.num}}, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      console.log(result);
      res.json(result);
    }
  }) 
});

// DELETE PRODUIT

app.delete('/product/delete', jsonParser, (req, res) => {
  const dbConnect = dbo.getDb();
  const body = req.body;
  dbConnect.collection("produit").deleteOne({_id: ObjectId(body._id)}).then(function (result, err){
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      console.log(result);
      res.json(result);
    }
  });
});


// CRUD USER

// ENVOI DU FORMULAIRE D'INSCRIPTION

app.post('/user/post', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  if (!(body.email && body.password && body.firstname && body.name && body.adress)) {
    res.status(400).send("Tout doit être complété");
  }
  dbConnect.collection("user").insertOne({firstname:body.firstname,name:body.name,email:body.email,adress:body.adress,password:body.password});
}); 

// VERIFIER AU LOGIN SI LE USER EST VALIDE PAR RAPPORT AU INFOS SEND ET SET SON TOKEN

app.get('/user/loger', jsonParser, (req, res) => {
  console.log(pass,mail,req.query.non)
  const dbConnect = dbo.getDb();
  dbConnect.collection("user").findOne({email:req.query.email,password:req.query.password}).then(function (result,err) {
    let error = false
    if (!result) { 
      error = true
      res.json(error)
    }
    else{
      user = [result._id,result.firstname,result.name,result.email]
      res.json(user)
    }
      
  });
});

// GET ALL USERS

app.get('/user/getAll', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("user").find({}).toArray(function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      console.log(result);
      res.json(result);
    }
  });
}); 


// UPDATE USER


app.post('/product/update',jsonParser,(req, res) => {
  const dbConnect = dbo.getDb();
  const body = req.body;
  dbConnect.collection('user').updateOne({_id: ObjectId(req.body._id)}, {$set:{fisrtname:body.firstname,name:body.name,adress:body.adress,email:body.email}}, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      console.log(result);
      res.json(result);
    }
  }) 
});

// DELETE USER

app.delete('/user/delete', jsonParser, (req, res) => {
  const dbConnect = dbo.getDb();
  const body = req.body;
  dbConnect.collection("user").deleteOne({}).then(function (result, err){
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      console.log(result);
      res.json(result);
    }
  });
});




// ACHAT ------------------------------------ ACHAT PAR PRODUIT


app.post('/user/post', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("user").insertOne(body);
}); 












app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
