// Go to the folder, ls to see it and then do the following: 

// 1) iTerminal first window, type this: node --harmony net-watcher-json-service.js target.txt

// It will say: Listening for subsrcibers...
// Subscriber connected.

// 2) iTerminal second window, type this: node --harmony net-watcher-json-client.js

// It will say: Now watching: target.txt

//That's it! 

// **************************************************************************************

// The message that is coming across the wire, we are parsing it to JSON first. 
// Any type of message that you want to send across, use the fully loaded if else template to create the service

"use strict";
const
    net = require('net'),
    client = net.connect({port: 5432});

client.on('data', function(data){
        let message = JSON.parse(data); //the message should be JSON object
        if(message.type === 'watching'){
            console.log('Now watching: '+message.file);
        } else if(message.type === 'changed'){
            let date = new Date(message.timestamp);
            console.log("File '" + message.file + "changed at " + date);
        } else {
            throw Error("Unrecognized message type: " + message.type);
        }
});