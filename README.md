grunt-umbraco-package
=====================

> A grunt task to automate the creation of installable Umbraco packages from your files.

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-umbraco-package --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-umbraco-package');
```


## Usage Example

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  umbracoPackage: {
    dist: {
      src: 'dist',		  // Path to a folder containing the files to be packaged
      dest: 'pkg',		  // Path to a folder to create the package file
      options: {		  // Options for the package.xml manifest
        name: 'My Awesome Package',
        version: '0.0.1',
        url: 'http://our.umbraco.org/projects/developer-tools/my-awesome-package',
        license: 'MIT',
        licenseUrl: 'https://opensource.org/licenses/MIT',
        author: 'Benetton Concubine',
        authorUrl: 'http://our.umbraco.org/member/1234',
        readme: 'Please read this!'
      }
    }
  }
});
```

## Options
### Files
#### src
**type:** string | **required**
The path to the folder containing the files to be packaged.  Files should be in the desired structure to install on the target Umbraco site.

#### dest
**type:** string | **required**
The directory path to create the generated package file.

### Manifest Options
#### name
**type:** string | **required**
The name of your package.  Used in the package manifest and to generate the package file name.

#### version
**type:** string | **required**
The version number of your package.  Used in the package manifest and to generate the package file name.

#### url
**type:** string | **required**
The URL of your package, for the package manifest.

#### license
**type:** string | **required**
The name of your license (ex: "MIT"), for the package manifest

#### licenseUrl
**type:** string | **required**
The URL to your license details, for the package manifest.

#### author
**type:** string | **required**
The name of the package author, for the package manifest.

#### authorUrl
**type:** string | **required**
The URL of the package author, for the package manifest

#### manifest
**type:** string | **optional**
Leave empty to generate a `package.xml` manifest for your package automatically, based on the configuration above.  Optionally specify a path to an existing `package.xml` to use instead.

#### readme
**type:** string | **optional**
Contents to use for the `readme` field of the `package.xml` manifest.

#### outputName
**type:** string | **optional**
Leave empty to have the package file name generated as `{name}_{version}.zip`.  Optionally specify a custom name to use here.