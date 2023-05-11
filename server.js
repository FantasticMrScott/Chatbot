const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var events = require('events');
var emitter = new events.EventEmitter();
var ComfyJS = require("comfy.js");
require('dotenv').config();
const fun = require("./functions.js");
const fs = require('fs');
const quotes = require("./quotes.js");
require("./spotifyAuth.js");
const spot = require('./spotify.js');


//Work in progress
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
    hex = "#18160D"; //turns lights off if user color isn't specified
  } else {
    hex = extra.userColor;
  }
  var result = fun.hexToRgb(hex);
  console.log(result);
  port.write(result);
}



ComfyJS.Init( process.env.TWITCH_BOT_USERNAME, process.env.TWITCH_OAUTH_TOKEN, ["fantasticmrscott"]);

