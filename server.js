const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var ComfyJS = require("comfy.js");
require('dotenv').config();
const fun = require("./functions.js");
const fs = require('fs');
const quotes = require("./quotes.js");



const port = new SerialPort("COM3", {baudRate: 9600});

const parser = new Readline();
port.pipe(parser);

parser.on("data", (line) => console.log(line));

function hasNumbers(test) {
  var regex = /\d/g;
  return regex.test(test);
}

ComfyJS.onCheer = ( user, message, bits, flags, extra ) => {
  //ComfyJS.Say(user + " just threw " + bits + " bits at Scott! Thanks!");
  ComfyJS.Say(user + " just threw " + bits + " bits at Scott! Thanks!");
}

ComfyJS.onSub = (user, message, subTierInfo, extra) => {
  //ComfyJS.Say(user + " just subscribed at tier " + subTierInfo);
  if(subTierInfo.plan === "1000") {
    var tier = "1";
  } else if(subTierInfo.plan === "2000") {
    var tier = "2";
  } else {
    var tier = "3";
  }
  ComfyJS.Say(user + " just subscribed at tier " + tier );
}

ComfyJS.onResub = (user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
  //ComfyJS.Say(user + " just subscribed! They have been subbed for " + streamMonths + "!");
  if(subTierInfo.plan === "1000") {
    var tier = "1";
  } else if(subTierInfo.plan === "2000") {
    var tier = "2";
  } else {
    var tier = "3";
  }
  ComfyJS.Say(user + " just subscribed at tier " + tier + "! They have been subbed for " + cumulativeMonths + " months!");
}

ComfyJS.onRaid = (user, viewers, extra) => {
  //ComfyJS.Say(user + " just raided with " + viewers + " viewers! Thank you so much for entrusting me with your viewers!");
  ComfyJS.Say(user + " just raided with " + viewers + " viewers! Thank you so much for entrusting me with your viewers!");
}

ComfyJS.onSubGift = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
  //ComfyJS.Say(gifterUser + "just gifted a sub to " + recipientUser + "! Be sure to say thanks!");
  if(subTierInfo.plan === "1000") {
    var tier = "1";
  } else if(subTierInfo.plan === "2000") {
    var tier = "2";
  } else {
    var tier = "3";
  }
  ComfyJS.Say(gifterUser + " just gifted a tier " + tier + " sub to " + recipientUser + "! Be sure to say thanks!");
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
  if(command === "addquote") {
    var date = extra.timestamp;
    quotes.addQuote(message, date);
  } else if (command == "quote" && hasNumbers(message)) {
    var quoteId = JSON.parse(message.match(/\d+/));
    quotes.getSpecificQuote(user, quoteId - 1);
  } else if (command === "quote") {
      quotes.getRandomQuote(user);
  } else if ((flags.broadcaster || flags.mod) && (command == "deletequote" && hasNumbers(message))) {
    var quoteId = JSON.parse(message.match(/\d+/));
    quotes.deleteQuote(quoteId);
  }
}

//scan every message and parse user color. write to arduino
ComfyJS.onChat = (user, message, flags, self, extra ) => {
  console.log(user, extra.userColor);
  if(!extra.userColor) {
    hex = "#18160D";
  } else if((user == process.env.TWITCH_BOT_USERNAME || user == "StreamElements") && (message.includes("gifted") || message.includes("subscribed") || message.includes("raided"))) {
    hex = "#FFFFFF";
  } else if((user == process.env.TWITCH_BOT_USERNAME || user == "StreamElements") && (message.includes("follow") || message.includes("bits"))) {
    hex = "#FFFFFE";
  } else {
    hex = extra.userColor;
  }
  var result = fun.hexToRgb(hex);
  console.log(result);
  port.write(result);
}




ComfyJS.Init( process.env.TWITCH_BOT_USERNAME, process.env.TWITCH_OAUTH_TOKEN, ["fantasticmrscott"]);