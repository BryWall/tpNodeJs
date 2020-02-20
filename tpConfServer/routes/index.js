var express = require('express');
var passport = require('passport');
var Conference = require('../models/conference');
var User = require('../models/user');
var router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const jwt = require('jsonwebtoken')


router.get('/', function (req, res) {
    res.redirect('conferences');
});


router.get('/conferences', function (req, res) {
  Conference.find({}, (err, items) => {
    res.render('conferences', {conferences : items})
  })
  
});

router.get('/conferences/create', function (req, res) {
  res.render('create', { title : 'Créer une conférence' });
});

router.post('/conferences/create', function (req, res) {
  const conf = new Conference( {
    name : req.body.name,
    date : req.body.date,
    debut : req.body.debut,
    fin : req.body.fin,
    port : req.body.port
  })

  conf.save().then(() => console.log('a conference was created'));
  res.redirect('/conferences')
  
});

router.get('/conference/:name', function (req, res) {
  Conference.findOne({name : req.params.name},(err, item) => {
    if(err)
      console.log(err)
    res.render('conference', {conference : item})
  } )
});

router.get('/chat/:port', function (req, res) {
  Conference.findOne({port : parseInt(req.params.port)},(err, item) => {
    if(err)
      console.log(err)
    res.render('chat', {conference : item})
  } )
});



router.get('/register', function (req, res) {
  res.render('register');
});

router.post('/register', function (req, res, next) {
  const user = new User({
    username : req.body.username,
    password : req.body.password
  })
  User.find({username : req.body.username}, (err, item) => {
    if(item.length == 0){
      user.save();
      res.redirect('/login');
    }
    else {
      res.send("username already used");
    }
  })
});

router.get('/login', function (req, res) {
  if(req.headers.authorization == null)
    res.render('login')
  else
    res.redirect('conferences');
});


router.post('/login', function (req, res) {
  const jwtKey = process.env.JWT_KEY || 'secret';
  User.find({username : req.body.username, password : req.body.password},(err, user) => {
    const token = jwt.sign({username: user.username, id : user._id}, jwtKey, {expiresIn : '1h'});
    //res.send(token);
    res.redirect('conferences')
  })
});

router.get('/logout', function (req, res) {
  req.headers.authorization = null;
  res.redirect('login');
});


module.exports = router;