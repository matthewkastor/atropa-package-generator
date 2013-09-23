#!/usr/bin/env node
/*jslint
    white : true,
    vars : true,
    node : true,
    regexp: true,
    stupid: true
*/
var atropaPackageGenerator = require('../src/atropa-package-generator.js');
var os = require('os');
var fs = require('fs');

var argz = Array.prototype.slice.call(process.argv, 2);
// the first two arguments must be the package name and output directory
// in that order
var opts = {
        packageName : argz.shift(),
        outputDirectory : argz.shift()
    };
// the last argument must be the template directory
if(argz.length > 0) {
    if(fs.existsSync(argz[argz.length - 1])) {
        opts.templateDirectory = argz.pop();
    }
}
// the third to next to last argument are template properties of the form
// <property name>:<value> property names must not contain colons.
var tmp;
while(argz.length > 0) {
    tmp = argz.shift().match(/^([^:]+):(.*)$/);
    opts[tmp[1]] = tmp[2];
    tmp = '';
}
// defaults to generating the package, will be set to false if help option is
// given
var generate = true;

switch(opts.packageName) {
    // the following cases trigger the help message, fallthrough is intentional.
    case undefined :
    case '-h' :
    case '--help' :
    case '/?' :
        generate = false;
        console.log(
            'Usage:' + os.EOL +
            'atropa-package-generator <package name> <output directory>' + os.EOL +
            '[[additional property]...] [template directory]' + os.EOL + os.EOL +
            'Package name is the desired name for the generated package.' + os.EOL + os.EOL +
            'Output directory is the desired location for the generated package.' + os.EOL + os.EOL +
            'Template directory is the template to use for generating the package' +
            ' it is optional. If it is not specified then the default template' +
            ' will be used.' + os.EOL + os.EOL +
            'Additional properties for your template may be specified on the' +
            ' command line by separating the property and value with a colon' +
            ' like extra_property:awesome. You may specify as many additional' +
            ' properties as you want.'
        );
        break;
    // the default case is when no help option was given. It reports the
    // template properties and values being used for generation.
    default:
        console.log('generating package using options :');
        console.log(opts);
        console.log(
            "Don't forget to run npm install in the root of your" +
            "generated package"
        );
        break;
}
// generate the package if no help option was given.
if(generate === true) {
   atropaPackageGenerator.generate(opts);
}
