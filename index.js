var express = require('express');
var app = express();
var defaultAppPort = (process.env.PORT || 8080);
var defaultWwwPath = (process.env.WWW_FOLDER || 'platforms/browser/www')

app.set('port', defaultAppPort)
app.use(express.static(defaultWwwPath));
app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(app.get('port'), function () {
	console.log('Server is running at 0.0.0.0:' + app.get('port'));
});