var express = require('express');
var app = express();
var path = require('path');
// var port = 3000;
var session = require('express-session');
var hbs = require('express-handlebars');
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));

/**
 * The below declaration is importing or routes.
 */
var routes = require('./routes/routes.js');

// Api Folder
app.use(express.static('public'));

/**
 * The following 3 functions are setting up the HTML template.
 */
app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Middleware shit below
 */
app.use(session({
    secret: 'ssshhhhh',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views'));
app.use('/', routes);


/**
 * Big brother is listening and watching.
 */
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
