module.exports = function (grunt) {
  grunt.registerMultiTask('umbracoPackage', 'Create Umbraco Package', function () {
    var done = this.async();
    var Guid = require('guid');
    var path = require('path');
    var rimraf = require('rimraf');
    var archiver = require('archiver');
    var fs = require('fs');
    var fse = require('fs-extra');
    var chalk = require('chalk');
    var xml = require('js2xmlparser');

    var options = this.options({
      minimumUmbracoVersion: '',
      files: [],
      cwd: '/',
      readme: ''
    });

    requireOptions(['name', 'version', 'license', 'licenseUrl', 'url', 'author', 'authorUrl'], options);
    validateDirectories(this.files, options);

    // Declare the name of the generated ZIP file
    var packageFileName = options.outputName ? options.outputName : options.name + '_' + options.version + '.zip';

    // Ensure output directory exists
    if (!fs.existsSync(options.outputDir)) {
      fs.mkdirSync(options.outputDir);
    }

    // Declare the path of the generated ZIP file
    var tmpOutput = path.join(options.outputDir, packageFileName);

    // Delete the ZIP file if it already exists (eg. already been generated for same version)
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);

    // Gather files
    var filesToPackage = [];
    this.files.forEach(function (file) {
      file.src.forEach(function (sourceDir) {
        var sourceDirFiles = getFilesRecursive(sourceDir);
        filesToPackage.push.apply(filesToPackage, sourceDirFiles.map(function (f) {
          return {
            guid: f.name,
            dir: f.dir.replace(sourceDir, ''),
            sourceDir: sourceDir,
            name: f.name,
            ext: f.name.split('.').pop()
          };
        }));
      });
    });

    // Avoid duplicate GUIDs
    var guids = {};
    filesToPackage.forEach(function(file) {
      if (guids[file.guid]) {
        file.guid = Guid.raw() + '_' + file.guid;
      }
      guids[file.guid] = true;
    });

    // Initialize the archive and it's output stream
    var output = fs.createWriteStream(tmpOutput);
    var archive = archiver('zip');

    // Listen for when the ZIP is closed
    output.on('close', function () {
      console.log('Package created at ' + chalk.cyan(tmpOutput) + " (" + chalk.cyan(archive.pointer()).toString() + " bytes)");
      done(true);
    });

    // Listen for ZIP errors
    archive.on('error', function (err) {
      throw err;
    });

    // Set the output stream of the ZIP
    archive.pipe(output);

    if (options.manifest) {

      // Load / transform XML Manifest
      options.files = filesToPackage;
      var manifest = grunt.file.read(options.manifest);
      manifest = grunt.template.process(manifest, { data: options });

      // Append the manifest to the ZIP file
      archive.append(manifest, { name:'package.xml' });

      // Append files from the source directory
      filesToPackage.forEach(function(file) {

        // Get the original path of the file
        var src = path.join(file.sourceDir, file.dir, file.name);

        // Append the file to the ZIP
        archive.append(fs.createReadStream(src), { name: file.guid });
      
      });
    
    } else {

      // Build the data for the package manifest
      var data = {
        info: {
          package: {
            name: options.name,
            version: options.version,
            license: {
              '@': {
                url: ''
              },
              '#': options.license
            },
            url: options.url,
            requirements: {
              major: 0,
              minor: 0,
              patch: 0
            }
          },
          author: {
            name: options.author
          },
          readme: options.readme
        },
        DocumentTypes: {},
        Templates: {},
        Stylesheets: {},
        Macros: {},
        DictionaryItems: {},
        Languages: {},
        DataTypes: {},
        control: {},
        Actions: {},
        files: {},
      };

      // Set optional URLs in the manifest
      if (options.licenseUrl) data.info.package.license['@'].url = options.licenseUrl;
      if (options.authorUrl) data.info.author['website'] = options.authorUrl;

      // Add files to the ZIP and manifest
      if (filesToPackage.length > 0) {
        data.files = [];

        filesToPackage.forEach(function(file) {

          // Get the original path of the file
          var src = path.join(file.sourceDir, file.dir, file.name);

          // Append the file to the ZIP
          archive.append(fs.createReadStream(src), { name: file.guid });

          // Append the file to the manifest
          data.files.push({
            guid: file.guid,
            orgPath: file.dir,
            orgName: file.name
          });

        });

      }

      // Append the manifest to the ZIP file
      archive.append(xml('umbPackage', data, {
        arrayMap: {
          files: 'file'
        },
        prettyPrinting: {
          enabled: true,
          returnString: "\r\n"
        }
      }), { name:'package.xml' });
    
    }

    archive.finalize();

    function getFilesRecursive(dir) {
      var ret = [];
      var files = fs.readdirSync(dir);
      for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;

        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
          ret.push.apply(ret, getFilesRecursive(name));
        } else {
          ret.push({ dir: dir, name: files[i] });
        }
      }
      return ret;
    }

    function requireOptions (opts, options) {
      opts.forEach(function (opt) {
        if (!options.hasOwnProperty(opt) || options[opt] == null || options[opt].toString().length == 0) {
          grunt.fail.warn('Error creating Umbraco Package - required property missing: ' + opt);
          return;
        }
      })
    };

    function validateDirectories (files, options) {
      if (files.length < 1) {
        grunt.fail.warn('Error creating Umbraco Package - no source specified');
        return;
      }
      var src = files[0].src[0];
      var dest = files[0].dest;
      if (src == null || src.length == 0) {
        grunt.fail.warn('Error creating Umbraco Package - no source specified');
        return;
      }
      if (dest == null || dest.length == 0) {
        grunt.fail.warn('Error creating Umbraco Package - no source specified');
        return;
      }
      options.sourceDir = src;
      options.outputDir = dest;
    }

  });
};