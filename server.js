const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var ComfyJS = require("comfy.js");
require('dotenv').config();



const port = new SerialPort("COM3", {baudRate: 9600});

const parser = new Readline();
port.pipe(parser);

parser.on("data", (line) => console.log(line));

// write exceptions for NULL colors and alerts
function hexToRgb(hex) {
    var hex = hex.replace(/[^0-9A-F]/gi, ''); //remove # from hexcode
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint) >> 8 & 255;
    var b = bigint & 255;
    var result =  r.toString().padStart(3, '0') + g.toString().padStart(3, '0') + b.toString().padStart(3,'0'); //make sure RGB is in xxx,xxx,xxx format
    var result = result + encodeURI('@'); // @ symbold alerts the arduino that the string is complete
    return result;
}



//scan every message and parse user color. write to arduino
ComfyJS.onChat = (user, message, flags, self, extra ) => {
  console.log(user, extra.userColor);
  if(!extra.userColor) {
    hex = "#5A5A5A";
  } else if((user = "fantasticmrscott" || user == process.env.TWITCH_BOT_USERNAME ) && (message.includes("subscribed") || message.includes("raid"))) {
    hex = "#FFFFFF";
  } else if((user = "fantasticmrscott" || user == process.env.TWITCH_BOT_USERNAME) && (message.includes("follow") || message.includes("cheered"))) {
    hex = "#FFFFFE";
  } else if(user !== "fantasticdrbot") {
    var hex = extra.userColor;
  } else {
  }
  var result = hexToRgb(hex);
  console.log(result);
  port.write(result);
}


//just a test command.
// ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
//   if( flags.broadcaster && command === "test" ) {
//     ComfyJS.Say( "!test was typed in chat" );
//   }
// }



ComfyJS.Init( process.env.TWITCH_BOT_USERNAME, process.env.TWITCH_OAUTH_TOKEN, ["FantasticMrScott", "Lekristyyy", "invert180"]);