var ComfyJS = require("comfy.js");
const fs = require('fs');

function addQuote(message, timestamp) {
        var ts = new Date(timestamp - 600);
        var quote = readQuotes();
        for (let i = 0; i < quote.quotes.length; i++) {
            if (quote.quotes[i] === null) {
                var newQuote = i;
            }
            else newQuote = quote.quotes.length;
        }
        quote.quotes[newQuote] = {"id": newQuote, "quote": message, "date": ts.toDateString()};
        var location = newQuote;
        ComfyJS.Say('"' + message + '"' + " has been added as quote #" + location);
        fs.writeFileSync('quotes.json', JSON.stringify(quote, null, 2));
}


function getRandomQuote(user) {
    var user = user;
    var quote = readQuotes();
    var max = quote.quotes.length - 1;
    var selection = Math.floor(Math.random () * max);
    var selectedQuote = quote.quotes.find((x) => x.id === selection);
    if ( selectedQuote.date == null ) {
        ComfyJS.Say("@" + user + ", Quote #" + selectedQuote.id + ': "' + selectedQuote.quote + '"');
      } else {
        ComfyJS.Say("@" + user + ", Quote #" + selectedQuote.id + ': "' + selectedQuote.quote + '" Quote was added on: ' + selectedQuote.date);
      }
}


function getSpecificQuote(user, id) {
    var quote = readQuotes();
    var key = id + 1;
    var user = user;
    if( quote.quotes[key] == null) {
        return null;
    }
    var selectedQuote = quote.quotes[key];
    if (selectedQuote == null) {
        ComfyJS.Say("Quote not found");
      } else if (selectedQuote.date == null ) {
          ComfyJS.Say("@" + user + ", Quote #" + selectedQuote.id + ': "' + selectedQuote.quote);
      } else {
          ComfyJS.Say("@" + user + ", Quote #" + selectedQuote.id + ': "' + selectedQuote.quote + '" Quote was added on: ' + selectedQuote.date);
      };
    return JSON.stringify(selectedQuote);
}

function getQuote(id) {
    var quote = readQuotes();
    var key = id;
    var result = [];
    var searchField = "id";
    for(var i = 0; i < quote.quotes.length; i++) {
        if(quote.quotes[i][searchField] == key) {
            result.push(quote.quotes[i]);
        }
    }
    return JSON.stringify(result);
}

function deleteQuote(id) {
    var quote = readQuotes();
    var key = id;
    var specificQuote = getQuote(key);
    var index = quote.quotes.findIndex(function(e) {return e.id === key});
    if(specificQuote == null) {
      ComfyJS.Say("Sorry, quote not found");
    } else {
        quote.quotes.splice(index, 1);;
        ComfyJS.Say("Quote " + key + " has been deleted.");
        var newJsonString = JSON.stringify(quote, null, 2);
        fs.writeFileSync('quotes.json', newJsonString);
    };
}

function getLastQuote() {
    var quote = readQuotes();
    var output = quote.quotes[quote.quotes.length-1].id;
    return output;
}


function readQuotes() {
    try {
        const jsonString = fs.readFileSync('quotes.json', 'utf-8');
        const quote = JSON.parse(jsonString);
        return quote;
    } catch (err) {
        console.log(err);
    } 
}




module.exports = { addQuote, getRandomQuote, getSpecificQuote, deleteQuote, getLastQuote }