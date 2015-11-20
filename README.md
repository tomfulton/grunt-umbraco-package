grunt-umbraco-package
=====================

A grunt task to assist with creating Umbraco packages that can be installed in the Backoffice.

# Installation

    npm install grunt-umbraco-package --save-dev

# Usage 

Define the task in your Gruntfile and specify options for the package

    umbracoPackage: {
      src: 'dist',		// Path to a folder containing the files to be packaged
      dest: 'pkg',		// Path to a folder to create the package file
      options: { }		// Options for package manifest
    }

Load the task

    grunt.loadNpmTasks('grunt-umbraco-package');

Run

    grunt umbracoPackage


## Options
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