// Dependencies
var five = require("johnny-five");
var fs = require('fs');
var path = require("path");
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// Get all the files 
app.use(express.static(__dirname + '/public'));  

// Get the html to render
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

// Start on local server
server.listen(8000, "0.0.0.0");  

var board = new five.Board(); // Connect to arduino board

// Sensors
var accelerometer;
var force_sensor;
// Outputs
var acc_output;

// Set up the board
board.on("ready", function() {
    accelerometer = new five.Accelerometer({
        controller: "ADXL345"
    });

    force_sensor = new five.Sensor({
        pin: "A1",
        freq: 25
    });
});

// Connect to server
io.sockets.on('connection', function (socket) {
    // When board is ready
    if(board.isReady) {
        // When accelerometer values change
        accelerometer.on("change", function() {

        // Accelerometer output
        acc_output = { x: this.x,
                       y: this.y,
                       z: this.z,
                       pitch: this.pitch,
                       roll: this.roll,
                       inclination: this.inclination,
                       orientation: this.orientation,
                       acceleration: this.acceleration
                     }

            // Debug
            // console.log(acc_output); 
            // console.log("Sending...");    
            socket.emit('jedy', acc_output); // Send information to client
        });

        // Scale the sensor's value to the LED's brightness range
        force_sensor.scale([0, 255]).on("data", function() {
            // Debug
            // console.log("Force: " + this.scaled);
        });
    }
});
