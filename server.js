/**
 * Created by dandreini16 on 1/2/17.
 */
//setup express server
var express= require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

app.use(express.static("static"));

//setup uber ==========================================================================
var Uber = require('node-uber');

var uber = new Uber({
    client_id: 'CLIENTID',
    client_secret: 'SECRET',
    server_token: 'SERVER TOKEN',
    redirect_uri: 'URI',
    name: 'oneClick',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true // optional, defaults to false
});




require('./config/passport')(passport); // pass passport for configuration

// set up our express application ===========================================================
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport ====================================================================
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



var locals = {};
var profile = {};// variables to pass into uber GET requests
app.set('view engine', 'pug'); // set up pug for templating

// set routes for Uber requests=============================================================

app.get('/api/login', function(request, response) {
    var url = uber.getAuthorizeUrl(['profile', 'places', 'history', 'history_lite', 'ride_widgets', 'all_trips', 'request', 'request_receipt']);
    response.redirect(url);
});
app.get('/api/callback', function(request, response) {
    uber.authorization({
        authorization_code: request.query.code
    }, function(err, access_token, refresh_token) {
        if (err) {
            console.error(err);
        } else {
            // store the user id and associated access token
            // redirect the user back to your actual app
            // console.log(access_token);
            response.redirect('/home')


        }
    });
});

app.get('/home', function(req, res, next){
    uber.user.getProfile(function(request, response, err) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(response)
            profile = response;
            next()
        }
    })
}, function (req, res) {
    res.render('yes', profile)
})

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);