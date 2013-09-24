# {{{packageName}}}

{{{packageDescription}}}

## Installation

```
npm install {{{packageName}}}
```

https://npmjs.org/package/{{{packageName}}}

Source code available at: https://github.com/{{{githubUserName}}}/{{{packageName}}}/

## Usage

In node:

```
var {{{camelizedPackageName}}} = require('{{{packageName}}}');
console.log({{{camelizedPackageName}}}(''));
```

In the browser, include `./browser/{{{packageName}}}_web.js` in your page. `{{{camelizedPackageName}}}` will
 be available in your page.

For full documentation see the docs folder. For examples see the example folder.

## Tests

Tests can be run from the root of this package with

```
npm test
```

## Hacking

There are several other scripts listed in package.json for development and
 hacking on this module. They can be run with `npm run-script` followed by the
 scripts property corresponding to the script you want to run. For example,
 given a script called `buildDocs`, it could be run from the package root by:

```
npm run-script buildDocs
```

## Author

{{{authorName}}}
{{{organization}}}

{{{authorEmail}}}
{{{authorUrl}}}

## License

{{{licenseType}}}
{{{licenseUrl}}}