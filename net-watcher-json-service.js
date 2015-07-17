// Use Ctrl+C to stop the process and Command+K to clear all 

// Go to the folder again, ls, then do the following: 

// 1) in iTerm first window, type: node --harmony net-watcher-json-service.js target.txt

// You will see the following message: Listening for subsrcibers...
// Subscriber connected.

// 2) in iTerm second window, type: telnet localhost 5432

// You will see the following JASON objects: 

// Trying 127.0.0.1...
// Connected to localhost.
// Escape character is '^]'.
// {"type":"watching","file":"target.txt"}

// 3) in iTerm third window, type: touch target.txt

// That's it! 

"use strict";
const
    fs = require('fs'),
    net = require('net'),
    filename = process.argv[2],
    server = net.createServer(function(connection) {
        /*
        It reports that the connection has been established
        (both to the client with connection.write, and to the console).
        */
        console.log('Subscriber connected.');
        connection.write(JSON.stringify({
            type: 'watching', //this object should show up in iTerminal when you call it (see above)
            file: filename //this object should show up in iTerminal when you call it (see above)
        }) + '\n');

        // It begins listening for changes to the target file, saving the
        // returned watcher object. This callback sends change information
        // to the client using connection.write

        let watcher = fs.watch(filename, function() {
            connection.write("File '" + filename + "' changed: " + Date.now() + "\n");
        });
        /*
        It listens for the connection's close event so it can report that
        the subscriber has diconnected and stop watching the file, with
        watcher.close()
        */
        connection.on('close', function() {
            console.log('Subscriber disconnected.');
            watcher.close();
        });

        connection.on('error', function(err) {
            throw Error('There was an error\n', err);
        })
    });

if (!filename) {
    throw Error('No target filename was specified.');
}

server.listen(5432, function() {
    console.log('Listening for subsrcibers...');
});
