/*
 * grunticon
 * https://github.com/filamentgroup/grunticon
 *
 * Copyright (c) 2012 Scott Jehl
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
		nodeunit: {
			files: ['test/**/*.js']
		},
		umbracoPackage: {
	      options: {
	        name:        'Archetype',
	        version:     '1.0.0',
	        url:         'https://github.com/imulus/Archetype',
	        license:     'MIT',
	        licenseUrl:  'MIT',
	        author:      'Imulus',
	        authorUrl:   'http://imulus.com/',
	        manifest:    'test/files/package.xml',
	        readme:      'test/files/readme.txt',
	        sourceDir:   'test/files/package',
	        outputDir:   'test/output',
	      }
		},

		clean: {
			tests: ['tmp']
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Default task.
	// TODO: 'clean'
	grunt.registerTask('test', ['umbracoPackage', 'nodeunit']);
	grunt.registerTask('default', ['umbracoPackage']);

};
