#!/usr/bin/env node
/*jslint
    white : true,
    vars : true,
    node : true,
    regexp: true,
    stupid: true,
    nomen: true
*/
"use strict";
var os = require('os');
var fs = require('fs');
var path = require('path');
var atropaPackageGenerator = require('../src/atropa-package-generator.js');

function getArgz () {
    return Array.prototype.slice.call(process.argv, 2);
}
function lastArgFileExists (argz) {
    var out = false;
    if(argz.length > 0) {
        if(fs.existsSync(argz[argz.length - 1])) {
            out = true;
        }
    }
    return out;
}
function getOpts () {
    var argz = getArgz();

    // the first two arguments must be the package name and output directory
    // in that order
    var opts = {
        packageName : argz.shift(),
        outputDirectory : argz.shift()
    };
    if(lastArgFileExists(argz)) {
        opts.templateDirectory = argz.pop();
    }
    // the third through next to last argument are template properties of the form
    // <property name>:<value> property names must not contain colons.
    var tmp, curr, optsRegex = /^([^:]+):(.*)$/;
    while(argz.length > 0) {
        curr = argz.shift();
        // ignores arguments that don'e match the regex
        if(optsRegex.test(curr)) {
            tmp = curr.match(optsRegex);
            opts[tmp[1]] = tmp[2];
            tmp = '';
        }
        curr = '';
    }
    return opts;
}
function getMessage (fileLoc) {
    var message = fs.readFileSync(path.resolve(__dirname, fileLoc), 'utf8');
    return message.replace(/(\r\n|\r|\n)/g, os.EOL);
}
function helpRequestCheck () {
    var didRequest;
    switch(getArgz()[0]) {
        // the following cases trigger the help message, fallthrough is intentional.
        case undefined :
        case '-h' :
        case '--help' :
        case '/?' :
            didRequest = true;
            break;
        default:
            didRequest = false;
            break;
    }
    return didRequest;
}
function main () {
    var opts = getOpts();
    if(helpRequestCheck()) {
        var helpMessage = getMessage('./helpMessage.txt');
        console.log(helpMessage);
    } else {
        atropaPackageGenerator.generate(opts);
    }
}
main();
    