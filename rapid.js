/**
 * Created by dandreini16 on 1/3/17.
 */
var express= require('express');
var app      = express();
var port     = process.env.PORT || 3000;

app.use(express.static("static"));

//setup uber
var Uber = require('node-uber');

var uber = new Uber({
    client_id: 'pZDFCyhu_V4nmwm9L96zeFADJccWInX9',
    client_secret: 'OZS2Cbsn2ZzorkzSmb5TJk5m6ueQm_yHHxfYvyd8',
    server_token: 'Oq2sv8z4tYlP_ctE3ur7qP9BEAxwOVhIFmvmSVb9',
    redirect_uri: 'http://127.0.0.1:3000/api/callback',
    name: 'oneClick',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true // optional, defaults to false
});




app.set('view engine', 'pug'); // set up pug for templating

app.get('/', function(req, res) {
    res.render('index.pug'); // load the index.html file
});
app.get('/api/login', function(request, response) {
    var url = uber.getAuthorizeUrl(['profile', 'places', 'history', 'history_lite', 'ride_widgets']);
    response.redirect(url);
});

app.get('/api/callback', function(request, response) {
    const RapidAPI = require('rapidapi-connect');
    const rapid = new RapidAPI('oneClick', 'f422d867-de58-4110-ae90-353ba0429bb8');


    rapid.call('UberRide', 'getAccessToken', {
        'clientId': 'pZDFCyhu_V4nmwm9L96zeFADJccWInX9',
        'clientSecret': 'OZS2Cbsn2ZzorkzSmb5TJk5m6ueQm_yHHxfYvyd8',
        'code': request,
        'redirectUri': 'http://127.0.0.1:3000/api/callback'

    }).on('success', (payload)=>{
        console.log('hey');
    }).on('error', (payload)=>{
        console.log(payload);
    });


});

app.listen(port);
console.log('The magic happens on port ' + port);