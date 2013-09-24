/*jslint
    white : true,
    vars : true,
    node : true,
    stupid : true,
    regexp : true,
    nomen : true
*/
/**
 * @fileOverview A node.js module for generating templated files and directory
 *  structures without gettting heavy with configs and strange language.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 */
'use strict';
/**
 * A node.js module for generating templated files and directory
 *  structures without gettting heavy with configs and strange language.
 * @namespace A node.js module for generating templated files and directory
 *  structures without gettting heavy with configs and strange language.
 * @name atropaPackageGenerator
 */
/**
 * Renders a template using custom transformation functions. This is
 *  exposed to make it possible to use something other than mustache if you want
 *  to.
 * @name baseGenerator
 * @methodOf atropaPackageGenerator.
 * @param {String} templateDir The path to the template directory. The template
 *  directory will contain two folders: <code>dynamic</code>, and
 *  <code>static</code>. The files and subfolders contained within the dynamic
 *  subdirectory will be subject to processing by the transform functions. The
 *  files and subfolders contained in the dynamic subdirectory will be copied to
 *  the output folder without being processed. The static files are copied
 *  first and will be overwritten by any dynamic files if they share the same
 *  name an location in the output.
 * @param {String} outputDir The directory where you want the files to be
 *  written. This directory doesn't have to exist, if it does you will get an
 *  error when trying to generate your output unless you set the <code>Overwrite
 * </code> parameter to true.
 * @param {Object} [transformFns] The transformation functions to apply
 *  to directories and files in the <code>dynamic</code> subdirectory.
 * @param {Function} [transformFns.onFile = stream-copy-file] A function
 *  that receives two arguments: the path to the input file and the path to 
 *  output file. It is the responsibility of this function to read the input
 *  file, perform the desired transformation, and write that file to the 
 *  specified output location. The output directory will exist, so you don't
 *  have to check for that. 
 * @param {Function} [transformFns.onDir = returns input] A function
 *  that takes the path to the next output directory which will be written and
 *  performs a translation on it.
 * @param {Boolean} [overwrite = false] When set to true: suppresses the error
 *  thrown when trying to output to an existing directory.
 * @param {Boolean} [followSymlinks = false] When set to true symlinks will be
 *  followed.
 * @example 
 *  // Default transform functions.
 * 
 *  // This is the default set of transformFns. By specifying a transform function
 *  // you will override the defaults. This means that if you do not specify any
 *  // transform functions then the input directory will be copied to the output
 *  // directory if recurse is set true, otherwise it will simply copy the files
 *  // from the input directory to the output directory.
 *  var defaultTransformFns = {
 *              onFile: function defaultTransformFns_onFile(infile, outfile) {
 *                  var streamCopyFile = require('stream-copy-file');
 *                  streamCopyFile(infile, outfile, function (err) {
 *                      if (err) {
 *                          console.log(err);
 *                      }
 *                  });
 *              },
 *              onDir: function defaultTransformFns_onDir(dir) {
 *                  return dir;
 *              }
 *          };
 */
module.exports.baseGenerator = function baseGenerator(templateDir, outputDir, transformFns, overwrite, followSymlinks) {
    overwrite = overwrite ? true : false;
    followSymlinks = followSymlinks ? true : false;
    var fs = require('fs');
    var path = require('path');
    var directoryTransform = require('directory-transform');
    if (fs.existsSync(path.resolve(outputDir)) === true && overwrite !== true) {
        throw new Error('The output path already exists.');
    }
    directoryTransform(templateDir + '/static/', outputDir, null, true, followSymlinks);
    directoryTransform(templateDir + '/dynamic/', outputDir, transformFns, true, followSymlinks);
};
/**
 * Generates package skeletons using the supplied template. See the template in
 *  <code>templates/mustached</code> as an example if you want to make your own.
 *  Mustache transforms file contents, file names and directory names
 *  in the <code>dynamic</code> subdirectory of the template.
 * @name generate
 * @methodOf atropaPackageGenerator.
 * @param {Object} options There are only three options needed to generate a
 *  package, two of which have default values. The options object will be passed
 *  to mustache as the view object so any properties of the options object are
 *  available in the template by wrapping the property name in curly
 *  braces. For example: <code>{{{yourProperty}}}</code> anywhere in the 
 *  template will be expanded to the value of <code>options.yourProperty</code>.
 * @see <a href="https://github.com/janl/mustache.js/">
 * https://github.com/janl/mustache.js/</a>
 * @param {String} options.outputDirectory Where to put the generated package.
 * @param {String} [options.packageName = 'default-package'] The package name to
 *  use in the generated package.
 * @param {String} [options.templateDirectory = templates/mustached in this package]
 *  The template to use.
 * @example
 *  var atropaPackageGenerator = require('atropa-package-generator');
 *  atropaPackageGenerator.generate({
 *          packageName : 'your-package',
 *          outputDirectory : './node_modules'
 *  });
 *  // generates your-package in the node_modules folder. Go edit it.
 * @example
 *  var atropaPackageGenerator = require('atropa-package-generator');
 *  atropaPackageGenerator.generate({
 *          packageName : 'your-package',
 *          outputDirectory : './node_modules',
 *          TemplateDirectory : './aTemplate'
 *  });
 *  // generates your-package in the node_modules folder, using aTemplate.
 */
module.exports.generate = function generate(options) {
    function camelize(str) {
        return str.replace(/[^a-zA-Z0-9_]+./g, function (match) {
            return match[1].toUpperCase();
        });
    }
    var os = require('os');
    var path = require('path');
    var objectMerge = require('object-merge');
    options = options || {};
    if (!options.outputDirectory) {
        throw new Error('output directory must be specified');
    }
    // set default options
    var opts = module.exports.getDefaultOptions(options.templateDirectory);
    options = objectMerge(opts, options);
    console.log('generating package using options :');
    console.log(options);
    console.log(os.EOL + 'Don\'t forget to run npm install in the root of your' + ' generated package');
    options.camelizedPackageName = camelize(options.packageName);
    options.packageDirectory = path.resolve(options.outputDirectory, options.packageName);
    var mustache = require('mustache');
    var transformFns = {
            onFile: function transformFns_onFile(infile, outfile) {
                var fs = require('fs');
                var content;
                try {
                    content = fs.readFileSync(infile, 'utf8');
                    content = mustache.render(content, options);
                    outfile = mustache.render(outfile, options);
                    fs.writeFileSync(outfile, content, {
                        flag: 'w',
                        mode: fs.statSync(infile).mode
                    });
                } catch (err) {
                    throw err;
                }
            },
            onDir: function transformFns_onDir(dir) {
                return mustache.render(dir, options);
            }
        };
    module.exports.baseGenerator(options.templateDirectory, options.packageDirectory, transformFns, false, true);
};
/**
 * Gets the default settings for the template if present. Template defaults may
 *  be defined in <code>defaultOptions.json</code> in the template's root
 *  directory.
 * @name getDefaultOptions
 * @methodOf atropaPackageGenerator.
 * @param {String} [templateDirectory =  templates/mustached in this package]
 *  The root directory of your template.
 */
module.exports.getDefaultOptions = function getDefaultOptions(templateDirectory) {
    var path = require('path');
    var fs = require('fs');
    templateDirectory = templateDirectory || path.resolve(__dirname, '../templates/mustached');
    var defaultOptions = {};
    if (templateDirectory) {
        var defaultsFileLoc = path.resolve(templateDirectory, 'defaultOptions.json');
        if (fs.existsSync(defaultsFileLoc)) {
            defaultOptions = require(defaultsFileLoc);
        }
        defaultOptions.templateDirectory = templateDirectory;
    }
    return defaultOptions;
};