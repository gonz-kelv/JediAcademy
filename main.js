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
var motor;
var motor_2;
var motor_3;

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


var motor = new five.Motor(12);
// var motor_2 = new five.Motor(10);
// var motor_3 = new five.Motor(9);
  // Reverse the motor at maximum speed
  motor.reverse(255);
  // motor_2.reverse(255);
  // motor_3.reverse(255);

        // Inject the `motor` hardware into
        // the Repl instance's context;
        // allows direct command line access
        // board.repl.inject({
        //     motor: motor
        // });

        // board.repl.inject({
        //     motor: motor_2
        // });

      // Motor Event API

      // // "start" events fire when the motor is started.
      // motor.on("start", function() {
      //   console.log("start", Date.now());


      // });

      // // "stop" events fire when the motor is stopped.
      // motor.on("stop", function() {
      //   console.log("stop", Date.now());
      // });

      // Motor API

      // start([speed)
      // Start the motor. `isOn` property set to |true|
      // Takes an optional parameter `speed` [0-255]
      // to define the motor speed if a PWM Pin is
      // used to connect the motor.
      //motor.start();
        // Scale the sensor's value to the LED's brightness range
        force_sensor.scale([0, 255]).on("data", function() {
            // Debug
            // console.log("Force: " + this.scaled);
        });
    }
});
