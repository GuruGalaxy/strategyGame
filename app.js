// Module dependencies.
const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const moment = require('moment');
const dbConnector = require('./dbConnector');

const session = require('express-session')({
	secret: 'zyrafywchodzadoszafy',
	resave: true,
	saveUninitialized: true,
});
const sharedsession = require("express-socket.io-session")(session, {
  autoSave:true
});

// Create Express server.
const app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

// Session configuration
app.use(session);
io.use(sharedsession);

// Startup websocket services
const roomSocketController = require('./controllers/RoomSocketController')(io, sharedsession);
const matchSocketController = require('./controllers/MatchSocketController')(io, sharedsession);

// Load environment variables from .env file, where API keys and passwords are configured.
dotenv.config({ path: '.env.dev' });

// Routers
const loginRouter = require('./routes/LoginRouter');
const roomRouter = require('./routes/RoomRouter');
const matchRouter = require('./routes/MatchRouter');

// Startup services
const roomService = require('./services/RoomService');
const matchService = require('./services/MatchService');

// Pipeline config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser()); // CookieParser dopiero gdy będzie potrzebny

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'shared')));

app.use('/login', loginRouter);
app.use('/rooms', roomRouter);
app.use('/match', matchRouter);

// View engine setup
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views/')); 

// Error handler
app.use(function(err, req, res, next) {
console.log(err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.ENV === 'DEVELOPMENT' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error.html');
  });

/*app.listen(process.env.PORT, () => {
    console.log(' App is running at http://localhost:%d in %s mode', process.env.PORT, process.env.ENV);
    console.log('  Press CTRL-C to stop\n');
});*/
server.listen(3000);

module.exports = app;

