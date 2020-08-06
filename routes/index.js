'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
var advertiseModel = require('../models/advertise');
var bcrypt = require('bcryptjs');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { user: req.user });
});

/*POST for login*/
//Try to login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/cars',
    failureRedirect: '/invalid',
    failureMessage: 'Invalid Login'
}));

/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

/*POST for register*/
router.post('/register', function (req, res) {
    //Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        }
        //Check if user already exists
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (user.length) console.log('Username already exists please login.');
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('Inserting');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    })
});

/*GET for register*/
router.get('/register', function (req, res) {
    res.render('register');
});

/*GET for login*/
router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/invalid', function (req, res) {
    res.render('invalid');
});

router.get('/addcar', function(req, res){
    res.render('addCar',{user: req.user});
})

router.post('/addcar', function (req, res) {
    var form = new formidable.IncomingForm();
    //Specify our image file directory
    form.uploadDir = path.join(__dirname, '../public/images');
    form.parse(req, function (err, fields, files) {
        files.image.name = fields.name + '.' + files.image.name.split('.')[1];
        const advertise = new advertiseModel({ make: fields.make, model: fields.model, year: fields.year, description: fields.description, price: fields.price, image: files.image.name });
        //Insert advertise into DB
        advertise.save(function (err) {
            console.log(err);
        });
        //Upload file on our server
        fs.rename(files.image.path, path.join(form.uploadDir, files.image.name), function (err) {
            if (err) console.log(err);
        });
        console.log('Upload got from user to mongo');
    });
    form.on('error', function (err) {
        console.log(err);
    });
    form.on('end', function (err, fields, files) {
        console.log('File successfuly uploaded');
        res.redirect('/cars');
    });
});

router.get('/cars', function(req, res){
    try {
        advertiseModel.find({}, function (err, advertise) {
            console.log(err);
            console.log(advertise);
            res.render('cars', { adv: advertise, user: req.user });
        });
    } catch (err) {
        console.log(err);
    }
});

// POST delete page
router.post('/delete/:id', function (req, res) {
    // find car from id and delete it
    advertiseModel.findByIdAndDelete(req.params.id, function (err, model) {
        res.redirect('/cars');
    });
});

// get update page from server
router.get('/update/:id', function (req, res) {
    advertiseModel.findById(req.params.id, function (err, advertise) {
        if (err) console.log(err);
        // render udpate page and send adv object to show data on input fields
        res.render('edit', { adv: advertise, user: req.user })
    })
});

router.post('/update', function (req, res) {
    console.log(req.body);
    //Find and update by id
    

    advertiseModel.findByIdAndUpdate(req.body.id, { make: req.body.make, model: req.body.model, year: req.body.year, description: req.body.description, price: req.body.price }, function (err, model) {
        console.log(err);
        res.redirect('/cars');
    });
});


module.exports = router;
