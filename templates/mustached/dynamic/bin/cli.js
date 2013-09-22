#!/usr/bin/env node
{{{codeLicenseBlock}}}
var {{{camelizedPackageName}}} = require('../src/{{{packageName}}}.js');
var argz = Array.prototype.slice.call(process.argv);
console.log({{{camelizedPackageName}}}.apply(argz));