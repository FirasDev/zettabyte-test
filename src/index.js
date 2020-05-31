const express = require('express')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('express-flash')
var path = require('path');
const passport = require('passport')
const MongoDBStore = require('connect-mongodb-session')(session);


const initializePassport = require('./passport-config')
initializePassport(passport)

require('./db/mongoose')

//routes
const userRouter = require('./routers/user')


// Models
const User = require('./models/user')
const Picture = require('./models/picture')


const app = express()
const port = process.env.PORT || 3000


var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/zettabyte',
    collection: 'mySessions'
});

// Catch errors
store.on('error', function (error) {
    console.log(error);
});

app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('/upload'));
app.use('/assets/', express.static('assets'));
app.use(fileUpload());
app.set('view-engine', 'ejs')
app.set('views', path.join(__dirname, 'views')); 


app.use(flash())
app.use(session({
    secret: 'zetta123',
    store: store,
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(async function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        res.locals.name
    }
    next();
})




app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port : ' + port)
})


const jwt = require('jsonwebtoken')