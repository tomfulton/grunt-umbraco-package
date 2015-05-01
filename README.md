grunt-umbraco-package
=====================

A grunt task to assist with creating Umbraco packages that can be installed in The Backoffice™.

# Installation

    npm install grunt-umbraco-package --save-dev

# Usage 

Define the task in your Gruntfile and specify options for the package


    umbracoPackage: {
      options: {
        name: "Your Package Name",				// You can also use templates if you manage this data elsewhere in your project
        version: '<%= pkg.version %>',			// like so
        url: 'http://www.google.com',
        license: 'MIT',
        licenseUrl: 'http://opensource.org/licenses/MIT',
        author: '',
        authorUrl: '',	
        manifest: 'pkg/umbraco/package.xml',	// File containing your package manifest template
        readme: 'pkg/umbraco/readme.txt',		// Optional text file to insert into the package manifest's <readme> field
        sourceDir: 'pkg/tmp/umbraco',			// Directory that contains the files to be packaged, in the desired folder structure (ie, including "App_Plugins/YourName/".  You can generate this with a copy task if needed.
        outputDir: 'pkg',						// Directory to place the generated package file
      }
    }

Load the task

    grunt.loadNpmTasks('grunt-umbraco-package');

Run

    grunt umbracoPackage
