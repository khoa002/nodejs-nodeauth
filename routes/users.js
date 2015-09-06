var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({
    dest: '/uploads/'
});

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'Register'
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Log In'
    });
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
    // Get form values
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // form validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email field is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Password fields do not match').equals(req.body.password);

    // set a default image
    var profileImageName = 'noimage.png';
    // Check for image field
    if (req.file) {
        console.log('Uploading File...');
        // file info
        var profileImageOriginalName = req.file.originalname;
        var profileImageName = req.file.name;
        var profileImageMime = req.file.mimetype;
        var profileImageExt = req.file.extension;
        var profileImageSize = req.file.size;
    }

    // check for errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileImageName
        });

        // create user
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        // success message
        req.flash('success', 'You are not registered and may log in');
        res.location('/');
        res.redirect('/');
    }
});

module.exports = router;