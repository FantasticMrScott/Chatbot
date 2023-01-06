const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var events = require('events');
var emitter = new events.EventEmitter();
var ComfyJS = require("comfy.js");
require('dotenv').config();
const fun = require("./functions.js");
const fs = require('fs');
const quotes = require("./quotes.js");
const sound = require("sound-play");
const en = require("./entranceFunctions.js");
require("./spotifyAuth.js");
const spot = require('./spotify.js');



 
const port = new SerialPort("COM3", {baudRate: 9600});

const parser = new Readline();
port.pipe(parser);

parser.on("data", (line) => console.log(line));

function hasNumbers(test) {
  var regex = /\d/g;
  return regex.test(test);
}

ComfyJS.onCheer = ( user, message, bits, flags, extra ) => {
  port.write(fun.hexToRgb("#FFFFFE"));
  ComfyJS.Say(user + " just threw " + bits + " bits at Scott! Thanks!");
}

ComfyJS.onSub = (user, message, subTierInfo, extra) => {
  if(subTierInfo.plan === "1000") {
    var tier = "1";
  } else if(subTierInfo.plan === "2000") {
    var tier = "2";
  } else if(subTierInfo.plan === "3000"){
    var tier = "3";
  } else {
    var tier = "prime";
  }
  port.write(fun.hexToRgb("#FFFFFF"));
  ComfyJS.Say(user + " just subscribed at tier " + tier );
}

ComfyJS.onResub = (user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
  if(subTierInfo.plan === "1000") {
    var tier = "1";
  } else if(subTierInfo.plan === "2000") {
    var tier = "2";
  } else if(subTierInfo.plan.toLowerCase() === "prime") {
    var tier = "Prime";
  } else {
    var tier = "3";
  }
  port.write(fun.hexToRgb("#FFFFFF"));
  ComfyJS.Say(user + " just subscribed at tier " + tier + "! They have been subbed for " + cumulativeMonths + " months!");
}

ComfyJS.onRaid = (user, viewers, extra) => {
  port.write(fun.hexToRgb("#FFFFFF"));
  ComfyJS.Say(user + " just raided with " + viewers + " viewers! Thank you so much for entrusting me with your viewers!");
}

ComfyJS.onSubGift = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
  if(subTierInfo.plan === "1000") {
    var tier = "1";
  } else if(subTierInfo.plan === "2000") {
    var tier = "2";
  } else {
    var tier = "3";
  }
  port.write(fun.hexToRgb("#FFFFFF"));
  ComfyJS.Say(gifterUser + " just gifted a tier " + tier + " sub to " + recipientUser + "! Be sure to say thanks!");
}


ComfyJS.onCommand = (user, command, message, flags, extra) => {
  if(command.toLowerCase() === "addquote") {
    var date = extra.timestamp;
    quotes.addQuote(message, date);
  } else if (command.toLowerCase() == "quote" && hasNumbers(message)) {
    var quoteId = JSON.parse(message.match(/\d+/));
    quotes.getSpecificQuote(user, quoteId - 1);
  } else if (command.toLowerCase() === "quote") {
      quotes.getRandomQuote(user);
  } else if ((flags.broadcaster || flags.mod) && (command.toLowerCase() == "deletequote" && hasNumbers(message))) {
    var quoteId = JSON.parse(message.match(/\d+/));
    quotes.deleteQuote(quoteId);
    // long list of sound alerts. must be a better way of handling them.
  } else if (command === "chickens") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\chickens.mp3", 1);
  } else if (command === "curb") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\curb.mp3", 1);
  } else if (command === "dawg") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\dawg.mp3", 0.5);
  } else if (command === "gameover") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\gameover.mp3", 1);
  } else if (command === "goodlord") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\goodlord.mp3", 1);
  } else if (command === "horn") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\horn.mp3", 1);
  } else if (command === "lavahot") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\lavahot.mp3", 1);
  } else if (command === "law") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\law.mp3", 1);
  } else if (command === "milk") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\milk.mp3", 0.5);
  } else if (command === "notime") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\notime.mp3", 0.5);
  } else if (command === "omg") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\omg.mp3", 1);
  } else if (command === "profanity") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\profanity.mp3", 0.5);
  } else if (command === "rough") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\rough.mp3", 1);
  } else if (command === "victory") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\SweetVictory.mp3", 0.5);
  } else if (command === "serious") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\serious.mp3", 1);
  } else if (command === "nurse") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\hellonurse.mp3", 1);
  } else if (command === "nuts") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\nuts.mp3", 1);
  } else if (command === "notright") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\notright.mp3", 1);
  } else if (command === "round") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\round.mp4", 1);
  } else if (command === "ohno") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\wrong.mp3", 1);
  } else if (command === "dumbledore") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\dumbledore.mp3", 1);
  } else if (command === "stinky") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\stinky.mp3", 1);
  } else if (command === "lever") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\lever.mp3", 0.5);
  } else if (command === "chance") {
    sound.play("C:\\Users\\fanta\\Desktop\\Chatbot\\soundFiles\\chance.mp3", 1);
  } else if (command.toLowerCase() === "addsong" || command.toLowerCase() === "sr") {
    var id = message.substr(31, 22);
    console.log(id);
    spot.addTrack(id);
  } else if (command.toLowerCase() === "deletesong" && (flags.broadcaster || flags.mod)) {
    var id = message.substr(31, 22);
    spot.deleteTrack(id);
  } else if (command.toLowerCase() === "song") {
    spot.getTrack();
  } else if (command.toLowerCase() === "subgoals") {
    ComfyJS.Say("Today's daily sub goals are: 3 subs = snorlax hat goes on. 5 subs = Scott streams that Barbie game.")
  }
}

//scan every message and parse user color. write to arduino
ComfyJS.onChat = (user, message, flags, self, extra ) => {
  if(!extra.userColor) {
    hex = "#18160D";
  } else {
    hex = extra.userColor;
  }
  if(user.toLowerCase() === "jpikachu08") {
    emitter.emit("pika");
  }
  if(user.toLowerCase() === "nelu_31") {
    emitter.emit("nelu");
  }
  if(user.toLowerCase() === "raphprime") {
    emitter.emit("raph");
  }
  if(user.toLowerCase() === "kurowashi92") {
    emitter.emit("kuro");
  }
  if(user.toLowerCase() === "chapstickqueen") {
    emitter.emit("chappy");
  }
  if(user.toLowerCase() === "oryzoides") {
    emitter.emit("ory");
  }
  if(user.toLowerCase() === "theopoliz") {
    emitter.emit("theo");
  }
  if(user.toLowerCase() === "edenshex") {
    emitter.emit("eden");
  }
  if(user.toLowerCase() === "erinness") {
    emitter.emit("erin");
  }
  if(user.toLowerCase() === "drryder") {
    emitter.emit("ryder");
  }
  if(user.toLowerCase() === "samusaranon") {
    emitter.emit("samus");
  }
  if(user.toLowerCase() === "dummythot") {
    emitter.emit("marisa");
  }
  if(user.toLowerCase() === "lelling") {
    emitter.emit("lelling");
  }
  var result = fun.hexToRgb(hex);
  console.log(result);
  port.write(result);
}

emitter.once("pika", () => {
  en.pika();
});

emitter.once("nelu", () => {
  en.nelu();
});

emitter.once("raph", () => {
  en.raph();
});

emitter.once("kuro", () => {
  en.kuro();
});

emitter.once("chappy", () => {
  en.chappy();
});

emitter.once("ory", () => {
  en.ory();
});

emitter.once("theo", () => {
  en.theo();
});

emitter.once("eden", () => {
  en.eden();
});

emitter.once("erin", () => {
  en.erin();
});

emitter.once("ryder", () => {
  en.ryder();
});

emitter.once("samus", () => {
  en.samus();
});

emitter.once("marisa", () => {
  en.marisa();
});

emitter.once("lelling", () => {
  en.lelling();
});


ComfyJS.Init( process.env.TWITCH_BOT_USERNAME, process.env.TWITCH_OAUTH_TOKEN, ["fantasticmrscott"]);

