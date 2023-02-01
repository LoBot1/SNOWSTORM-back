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

const bcrypt = require('bcryptjs');



function hashPassword(dataPassword) {
  const password = bcrypt.hash(dataPassword, 10)
  return password
}




const stripe = require('stripe')('sk_test_51MUBAvIG0wu5IZ8aFhWYMB94LJDMBXqIfMfI6lyaIitg1H6Mp2ERMSvtnyQIX5iI0Nx6xuw3z8HA2dUoidm2l2L800EuoasoOE');
app.use(express.static('public'));



app.post('/sell-number/update-insert', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("sellnumber").findOne({id_product:body.id_product}).then(function (result, err) {
    if (err) {
      console.log(err);
      res.send(err.message);
    }
    else if (!result) {
      dbConnect.collection("sellnumber").insertOne({id_product:body.id_product,sellnumber:1})
    } else {
      dbConnect.collection("sellnumber").updateOne({id_product:body.id_product}, {$set:{id_product:body.id_product,sellnumber:(result.sellnumber+body.quantity)}})
    }
  });
}); 




app.post('/like/update-insert', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("like").findOne({id_product:body.id_product}).then(function (result, err) {
    if (err) {
      console.log(err);
      res.send(err.message);
    }
    else if (!result) {
      dbConnect.collection("like").insertOne({id_product:body.id_product,like:1})
    } else {
      dbConnect.collection("like").updateOne({id_product:body.id_product}, {$set:{id_product:body.id_product,like:(result.like+1)}})
    }
  });
}); 


app.post('/calculnumber', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  if (body.choice == "vendu") {
    dbConnect.collection("sellnumber").find({}).sort({sellnumber : -1}).toArray(function (err,result) {
      console.log(result)
    })
  }
  if (body.choice == "like") {
    dbConnect.collection("like").find({}).sort({sellnumber : -1}).toArray(function (err,result) {
      console.log(result)
    })
  }
})


// GET ALL TICKET SUPPORT

app.get('/like/getAll', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  dbConnect.collection("like").find({}).toArray(function (err, result) {
    console.log(result)
    res.json(result);
  });
}); 







// CREER LE CHOIX DU PRODUIT A L'AVANCE ET LES PARAMETRES DU PAIEMENT

const YOUR_DOMAIN = 'http://localhost:4444';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: '{{price_1MUUUsIG0wu5IZ8awvqbSn5K}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: "http://localhost:3000/success", 
    cancel_url: "http://localhost:3000/cancel", 
  });
  res.redirect(303, session.url);
});


// CREER LE PREPAIEMENT VALIDE PAR LE SUCCESS


app.post("/create-payment-intent", async (req, res) => {

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1400,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



//SUPPORT-------------------------SUPPORT-------------SUPPORT-------------SUPPORT-----------------------------------------------------

// ENVOIE DU FORMULAIRE DE SUPPORT 

app.post('/support/post', jsonParser, (req, res) => {
  const body = req.body;
  const dbConnect = dbo.getDb();
  if (!(body.object || body.email || body.img || body.text)) {
    res.send("Tout doit être complété");
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
  if (!(body.name || body.price || body.description || body.img || body.stock)) {
    res.send("Tout doit être complété");
  }
  dbConnect.collection("produit").insertOne({name:body.name,price:body.price,description:body.description,img:body.img,stock:body.stock}).then(function (result, err){
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
  if (!(body._id || body.name || body.img || body.price)) {
    res.send("Tout doit être complété");
  }
  dbConnect.collection('produit').updateOne({_id:ObjectId(body._id)}, {$set:{name:body.name,img:body.img,price:body.price}}, function(err, result) {
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
  if (!(body._id)) {
    res.send("Tout doit être complété");
  }
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

function hashPassword(dataPassword) {
  var salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(dataPassword, salt);    
  return password
}

app.post('/user/post', jsonParser, (req, res) => {
  const body = req.body;
  if (!(body.email || body.password || body.firstname || body.name || body.adress)) {
    res.status(400).send("Tout doit être complété");
  }
  const dbConnect = dbo.getDb();
  const password = hashPassword(body.password)
  dbConnect.collection("user").insertOne({firstname:body.firstname,name:body.name,email:body.email,adress:body.adress,password:password});
}); 

// VERIFIER AU LOGIN SI LE USER EST VALIDE PAR RAPPORT AU INFOS SEND ET SET SON TOKEN

function comparePassword(plaintextPassword, hash) {
  console.log(plaintextPassword, hash,"ON COMPARE SA ")
  bcrypt.compare(plaintextPassword, hash, function(err, result) {
    console.log(result)
    return result
  });
}

app.get('/user/loger', jsonParser, (req, res) => {
  const dbConnect = dbo.getDb();
  if (!(req.query.email || req.query.password)) {
    res.send("Tout doit être complété");
  }
  dbConnect.collection("user").findOne({email:req.query.email}).then(function (result,err) {
    console.log(result)
    let error = false
    if (!result) { 
      error = true
      res.json(error)
    }
    else{
      if (comparePassword(req.query.password, result.password)){
        user = [result._id,result.firstname,result.name,result.email]
        res.json(user)
      }
      error = true
      res.json(error)
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


app.post('/user/update',jsonParser,(req, res) => {
  const dbConnect = dbo.getDb();
  const body = req.body;
  if (!(body._id || body.firstname || body.name || body.adress || body.email)) {
    res.send("Tout doit être complété");
  }
  dbConnect.collection('user').updateOne({_id: ObjectId(body._id)}, {$set:{fisrtname:body.firstname,name:body.name,adress:body.adress,email:body.email}}, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      console.log(result);
      res.json(result);
    }
  }) 
});

app.post('/password/update',jsonParser,(req, res) => {
  const dbConnect = dbo.getDb();
  const body = req.query;
  if (!(body.lastpassword || body.password || body._id || body.repeatpassword)) {
    res.send("Tout doit être complété");
  }
  if ((body.password == body.repeatpassword)) {
    res.send("Les 2 nouveau mot de passe doivent être identiques");
  }
  dbConnect.collection("user").findOne({email:body.email}).then(function (result, err) {
    if (err) {
      res.send("Le mot de passe n'est pas le bon");
    }
    else {
      if (comparePassword(body.password, result.password)) {
        const password = hashPassword(body.password)
        dbConnect.collection('user').updateOne({_id: ObjectId(result._id)}, {$set:{password:password}}, function(err, result) {
          if (err) {
            console.log(err);
            res.send(err.message);
          } else {
            console.log(result);
            res.json(result);
          }
        }) 
      }
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



app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
