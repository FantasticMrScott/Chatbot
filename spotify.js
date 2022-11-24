const spot = require("./spotifyAuth.js");
var ComfyJS = require("comfy.js");

spot.spotifyApi.setAccessToken(spot.spotifyApi.getAccessToken());

function addTrack(id) {
    if(!spot.spotifyApi.getAccessToken()) {
        ComfyJS.Say("Music module not working at the moment.");
    } else {
        spot.spotifyApi.addTracksToPlaylist('3d9qNpEyP5YaFt4nNbF5JL', [`spotify:track:${id}`])
            .then(function(data) {
            ComfyJS.Say('Added track to playlist');
            }, function(err) {
        console.log('Something went wrong ', err);
        });
    }
}

function deleteTrack(id) {
    if(!spot.spotifyApi.getAccessToken()) {
        ComfyJS.Say("Music module not working at the moment.");
    } else {
        spot.spotifyApi.removeTracksFromPlaylist('3d9qNpEyP5YaFt4nNbF5JL', [{uri: `spotify:track:${id}`}])
            .then(function(data) {
                console.log('Track removed from playlist');
            }, function(err) {
                console.log('Something went wrong ', err);
            });
    }
}

function getTrack() {
    if(!spot.spotifyApi.getAccessToken()) {
        ComfyJS.Say("Music module not working at the moment.");
    } else {
        spot.spotifyApi.getMyCurrentPlayingTrack()
            .then(function(data) {
                if(!data.body.item) {
                    ComfyJS.Say("No song is currently playing, dummy");
                } else {
                var artistInfo = data.body.item.album.artists;
                artistInfo.filter(
                    function(data) {
                        artistName = data.name;
                    }
                );
                ComfyJS.Say('Now playing: "' + data.body.item.name + '" by ' + artistName);
                }
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    }
}


module.exports = { addTrack, deleteTrack, getTrack }
