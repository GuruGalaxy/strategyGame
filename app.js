/**
 * Module dependencies.
 */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const dotenv = require('dotenv');
const path = require("path");
//const cookieParser = require('cookie-parser');

const dbConnector = require('./dbConnector');

/**
 * Create Express server.
 */
const app = express();

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.dev' });

/**
 * Routers
 */
//const indexRouter = require('./routes/index');
const loginRouter = require('./routes/LoginRouter');

/**
 * Pipeline config
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser()); // CookieParser dopiero gdy będzie potrzebny

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'shared')));

//app.use('/', indexRouter);
app.use('/login', loginRouter);

// view engine setup

app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views/')); 

// error handler
app.use(function(err, req, res, next) {
console.log(err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.ENV === 'DEVELOPMENT' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error.html');
  });

app.listen(process.env.PORT, () => {
    console.log(' App is running at http://localhost:%d in %s mode', process.env.PORT, process.env.ENV);
    console.log('  Press CTRL-C to stop\n');
});
  
module.exports = app;