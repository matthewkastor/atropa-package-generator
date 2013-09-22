var {{{camelizedPackageName}}} = require('../src/{{{packageName}}}.js');
var fs = require('fs');
var path = require('path');
var specPath = path.resolve(__dirname, '../browser/tests/{{{packageName}}}.test.js');
var specCode = fs.readFileSync(specPath, "utf8");
eval(specCode);
