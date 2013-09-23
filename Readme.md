# atropa-package-generator

A node.js module for generating templated files and directory structures without
 gettting heavy with configs and strange language.

## Installation

```
npm install atropa-package-generator
```

## Usage

 1. Generate a package
 2. Run `npm install` in the generated package's root.
 3. Edit package & publish.

### Command Line

The command line interface takes four arguments, the package name, the output
 directory, template options, and the template to use. Additional properties and
 the template directory are optional. If no template directory is specified the
 default template will be used.

```
atropa-package-generator <package name> <output directory> [[additional property(ies)]...] [template directory]
```

The following commands should be run from the root of the package where
 atropa-package-generator is installed.

```
node_modules/.bin/atropa-package-generator --help
```

To generate the default package skeleton from the command line do:

```
node_modules/.bin/atropa-package-generator my-package ./node_modules
```

To generate a package skeleton from your own template do:

```
node_modules/.bin/atropa-package-generator my-package ./node_modules ./my-template
```

Additional properties for the template may be specified on the command line
 by separating the property and value with a colon `extra_property:awesome`. You
 may specify as many additional properties as you want. The template properties
 are to be specified before the template directory. For the default template
 you could specify the author name and it would appear in both the `package.json`
 file and the `Readme.md` file generated. The command would look like this:

```
node_modules/.bin/atropa-package-generator my-package ./node_modules authorName:bill
```

To do the same in your own template the command would be:

```
node_modules/.bin/atropa-package-generator my-package ./node_modules authorName:bill ./my-template
```

Additional properties available in the default template are: `packageVersion`, 
 `packageDescription`, `githubUserName`, `organization`, `authorName`, 
 `authorEmail`, `authorUrl`, `licenseType`, `licenseUrl`, `codeLicenseBlock`,
 `htmlLicenseBlock`

### Script

To generate the default package skeleton from scripts do:

```
var atropaPackageGenerator = require('atropa-package-generator');
atropaPackageGenerator.generate({
        packageName : 'your-package',
        outputDirectory : './node_modules',
        packageVersion : "2013.09.22-1535",
        packageDescription : "Awesome package does awesome things.",
        githubUserName : "My Username on Github",
        organization : "Awesomesauce Labs",
        authorName : "My Name",
        authorEmail : "me@mailinator.com",
        authorUrl : "http://npmjs.org/~your_name_here",
        licenseType : "gpl-3.0",
        licenseUrl : "http://www.gnu.org/licenses/gpl-3.0-standalone.html",
        codeLicenseBlock : "Code Licence Block",
        htmlLicenseBlock : "HTML License Block"
});
// generates your-package in the node_modules folder. Go edit it.
```

## Custom Templates

Templates are just regular directories and files. For a template called bob, the
 directory structure would look like this:

```
bob/
  |_static/
  |_dynamic/
```

The contents of the `static` and `dynamic` subdirectories are merged into the
 generated package. Contents of the `dynamic` directory are run through
 [mustache.js](https://github.com/janl/mustache.js/). Any options given to
 `atropaPackageGenerator.generate` are passed to mustache's `view` and are
 available for expansion anywhere. File contents, file names, and folder names
 may contain mustache tags. Take a look at the templates in the `templates`
 directory. It's easy to make your own.

```
var atropaPackageGenerator = require('atropa-package-generator');
atropaPackageGenerator.generate({
        packageName : 'your-custom-package',
        outputDirectory : './node_modules',
        TemplateDirectory : './bob',
        hello : 'hello template'
});
// generates your-custom-package in the node_modules folder, using the bob template.
```

For full documentation see the `docs` folder. There's advanced stuff in there,
 like how to use something other than mustache if you'd like.

## Hacking

To install the developer scripts, navigate to this module's root and run
 `npm install`.

There are several scripts listed in `package.json` for development and
 hacking on this module. They can be run with `npm run-script` followed by the
 `scripts` property corresponding to the script you want to run. For example,
 given a script called `buildDocs`, it could be run from the package root by:

```
npm run-script buildDocs
```
