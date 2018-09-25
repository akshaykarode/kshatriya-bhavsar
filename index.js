var express = require("express"),
    app = express(),
    Q = require('q'),
    fs = require('fs'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override');

var hostname = process.env.HOSTNAME || 'localhost',
    publicDir = __dirname + '/public',
    _config = require('./configs/default.json');

var DB = require('./modules/db')
// var DB_CONSOLE = require('./modules/db/db-console.js')
// Global
_ = require('underscore')
config = _config[process.argv[2]] || _config['development'];
nse_env = process.argv[3] || "LIVE";
app.locals.env=config;
db = new DB(config.db)
// db_console = new DB_CONSOLE(config.db)
// Global Ends

/* -------- App Configs --------  */

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('port', (process.env.PORT || 5000))

app.use(function(req, res, next) { // CORS Enable
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'x-access-token,Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
})
app.use(methodOverride());
app.use(bodyParser.json({
    limit: '100mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '100mb'
}));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));
app.use(session({
  secret: '63047706-999e-4e55-91cd-a0c68ad2fa82',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 12*60*60000 }
}));
app.use(express.static(publicDir));

/* --------  App Configs Ends --------  */

// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

/* --------  Routes --------  */
require('./modules/routes.js')(app);
/* --------  Routes Ends --------  */

console.log("Server is listening at http://%s:%s", hostname, app.get('port') , " ENV: ",config.envName);
app.listen(app.get('port'), hostname);
