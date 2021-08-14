console.log('Hello from server.js');

const express = require('express');
const path = require('path');
const app = express();

app.use( express.static('dist') );

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
	console.log('Server up:', app.get('port'));
});


app.get( '/', function( req, res ){
	console.log( 'Serving Home' );
	res.sendFile( path.resolve( 'index.html' ) );
});