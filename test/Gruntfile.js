module.exports = function (grunt) {

  grunt.initConfig({
      umbracoPackage: {
        example1: {
          src: 'fixtures/example',
          dest: 'artifacts',
          options: {
            name: 'TestPackage',
            version: '0.0.1',
            url: 'http://www.google.com',
            license: 'MIT',
            licenseUrl: 'http://#',
            author: 'John',
            authorUrl: 'http://john.com',
            readme: 'Hello'
          }
        },
        example2: {
          src: 'fixtures/example',
          dest: 'artifacts',
          options: {
            name: 'TestPackage2',
            version: '0.0.2',
            url: 'http://www.google.com',
            license: 'MIT',
            licenseUrl: 'http://#',
            author: 'John',
            authorUrl: 'http://john.com',
            manifest: 'fixtures/custom-package-xml/package.xml'
          }
        }
      },
      nodeunit: {
        all: ['test.js'],
        options: {
          reporter: 'grunt',
          reporterOptions: {
            output: 'outputdir'
          }
        }
      },
      clean: {
        test: ['artifacts/*.*']
      }
  });

  grunt.loadTasks('../tasks');
  grunt.loadTasks('../node_modules/grunt-contrib-nodeunit/tasks');
  grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

  grunt.registerTask('setup', ['umbracoPackage']);
  grunt.registerTask('teardown', ['clean']);

  grunt.registerTask('default', ['setup', 'nodeunit', 'teardown']);
}