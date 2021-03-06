//Open up your folder with socket code inside, use "ls" to see it. 
//Afterwards do the following: 

// 1) in the first iTerminal window type this: 

// node --harmony net-watcher.js target.txt

// you will see that it will say Listening for subsrcibers...
// Subscriber connected.

// 2) in the second iTerminal window type this: 

// telnet localhost 5432

// you will see that it will say Trying 127.0.0.1...
// Connected to localhost.
// Escape character is '^]'.
// Now watching 'target.txt' for changes...

// 3) in the third iTerminal window type this: 

// touch target.txt

//That's it


"use strict";
const
    fs = require('fs'),
    net = require('net'),
    filename = process.argv[2],
    server = net.createServer(function(connection){
        /*
        It reports that the connection has been established
        (both to the client with connection.write, and to the console).
        */
        console.log('Subscriber connected.');
        connection.write("Now watching '" + filename + "' for changes...\n");
        /*
        It begins listening for changes to the target file, saving the
        returned watcher object. This callback sends change information
        to the client using connection.write
        */
        let watcher = fs.watch(filename, function(){
            connection.write("File '" + filename + "' changed: "  + Date.now() + "\n");
        });
        /*
        It listens for the connection's close event so it can report that
        the subscriber has diconnected and stop watching the file, with
        watcher.close()
        */
        connection.on('close', function(){
            console.log('Subscriber disconnected.');
            watcher.close();
        });

        connection.on('error', function(err){
            throw Error('There was an error\n', err);
        })
    });

    if(!filename){
        throw Error('No target filename was specified.');
    }

    server.listen(5432, function(){
        console.log('Listening for subsrcibers...');
    });
