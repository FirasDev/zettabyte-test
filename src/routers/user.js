const express = require('express')
const auth = require('../middleware/auth')
const passport = require('passport')
var dateFormat = require('dateformat');
const fileUpload = require('express-fileupload');
const Picture = require('../models/picture')
const fs = require('fs');

const User = require('../models/user')

const router = new express.Router()



// views routes

router.get('/', async (req, res) => {
    res.redirect('/home')
})

// Login Page
router.get('/login/', isNotauthenticatedMiddleware(), async (req, res) => {
    res.render('login.ejs')
})

// register Page
router.get('/register/', isNotauthenticatedMiddleware(), async (req, res) => {
    res.render('register.ejs')
})
/////////

router.post('/login/', passport.authenticate('local',
    {
        successRedirect: '/home',
        failureRedirect: '/login/',
        failureFlash: true
    }))



// Login 
router.get('/home', authenticationMiddleware(), async (req, res) => {
    try {
        const pictures = await Picture.find()
        res.render('index.ejs', { user: req.user, pictures:pictures })

    } catch (e) {
        res.status(400).send()
    }
})

router.get('/gallery', authenticationMiddleware(), async (req, res) => {
    try {
        const pictures = await Picture.find({ 'user': req.user._id })
        res.render('gallery.ejs', { user: req.user, pictures:pictures })

    } catch (e) {
        res.status(400).send()
    }
})

//sign up user
router.post('/user/register', isNotauthenticatedMiddleware(), async (req, res) => {

    console.log(req.files)
    console.log(req.files["input-file-preview"])
    let sampleFile = req.files["input-file-preview"];
    var filename = dateFormat(Date.now(), "yyyy-mm-dd-hh.MM.ss") +'.jpg';

    fs.writeFileSync("./assets/images/" + filename, sampleFile.data, 'base64')

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        lastName: req.body.lastName,
        avatar: filename
    })

    try {
        user.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                req.login(user, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    return res.redirect('/');
                });
            }
        });
    } catch (error) {
        console.log('Error registration')
        res.redirect('/register')
    }
})



// LogOut 
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/logout/', async (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/')
})

/// Get User By Token
router.get('/users', auth, async (req, res) => {
    const user = await User.findById(req.user._id)
    console.log("Get User By Token")
    console.log(user.id)
    switch (user.role) {
        case 'Patient':
            const patient = await Patient.findByUser(user.id)
            res.send({ user, patient })
            console.log({ user, patient })
            break;
        case 'Doctor':
            const doctor = await Doctor.findByUser(user.id)
            res.send({ user, doctor })
            break;
    }
    //res.status(200).send({ user, patient })
})


// Upload Avatar

router.post("/users/avatar", auth, async (req, res) => {

    
    if (!req.files.file || Object.keys(req.files.file).length === 0) {
        console.log(req.files.file)
        return res.status(400).send('No files were uploaded.');
    }

    const base64Data = new Buffer(JSON.stringify(req.files.file)).toString("base64");
    var fileName = req.user._id + "." + dateFormat(Date.now(), "yyyy-mm-dd-hh.MM.ss") + '.jpg';
    try {
        fs.writeFileSync("./uploads/" + fileName, base64Data, 'base64');
        req.user.avatar = fileName;
        await req.user.save();
        return res.status(200).send({ "status": "success", "ImageName": fileName });
    } catch (e) {
        next(e);
    }

    res.status(200).send("failed")
});

// Update User Account 
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const user = new User(req.body)
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//add picture to user gallery
router.post('/picture/add/', authenticationMiddleware(), async (req, res) => {

    let sampleFile = req.files.file;
    var filename = dateFormat(Date.now(), "yyyy-mm-dd-hh.MM.ss") +'.jpg';

    fs.writeFileSync("./uploads/" + filename, sampleFile.data, 'base64');
    
    const picture = new Picture({
        caption: req.body.caption,
        image: filename,
        user: req.user._id
    })
    try {
        await picture.save();
        res.redirect('/')
        } catch (e) {
        res.status(400).send(e)
    }
})

// Get Image
router.get("/pics/:img", (req, res, next) => {
    var img = './uploads/' + req.params.img;
    res.sendfile(img);
});

// Get avatar
router.get("/avatar/:img", (req, res, next) => {
    var img = './assets/images/' + req.params.img;
    res.sendfile(img);
});

//get user gallery
router.get("/user/pictures", auth, async (req, res, next) => {
    console.log(req.user)
    const user = await User.findById(req.user.id)
    const pictures = await Picture.find({ 'user': user._id })
    res.status(200).send(pictures)
});

//get all galleries
router.get("/users/pictures", auth, async (req, res, next) => {
    const pictures = await Picture.find()
    res.status(200).send(pictures)
});

router.get('/pictures/delete/:id', authenticationMiddleware(), async (req, res) => {
    console.log("step 1")
    try {
        console.log(req.params.id)
        console.log(req.user._id)
        const picture = await Picture.findOneAndDelete({ _id: req.params.id, 'user': req.user._id })
        if (!picture) {
            res.redirect('/home/')
        }
        res.redirect('/home/')
    } catch (e) {
        res.redirect('/error/')
    }
})

    //base functions 

    passport.serializeUser(function (user, done) {
        done(null, user.id);
        console.log('passport serializeUser')
    });
    
    passport.deserializeUser(function (id, done) {
        done(null, user);
    });

    function authenticationMiddleware() {
        console.log('MiddleWare Passport ')
        return (req, res, next) => {
            console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    
            if (req.isAuthenticated()) return next();
            res.redirect('/login/')
        }
    }
    
    function isNotauthenticatedMiddleware() {
        console.log('is Not Authenticated Middleware')
        return (req, res, next) => {
            if (req.isAuthenticated()) {
                return res.redirect('/')
            }
            return next()
        }
    }


module.exports = router