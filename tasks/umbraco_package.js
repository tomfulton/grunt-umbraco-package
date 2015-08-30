module.exports = function (grunt) {
  grunt.registerTask('umbracoPackage', 'Create Umbraco Package', function () {
    grunt.config.requires('umbracoPackage.options.name');
    grunt.config.requires('umbracoPackage.options.version');
    grunt.config.requires('umbracoPackage.options.license');
    grunt.config.requires('umbracoPackage.options.licenseUrl');
    grunt.config.requires('umbracoPackage.options.url');
    grunt.config.requires('umbracoPackage.options.author');
    grunt.config.requires('umbracoPackage.options.authorUrl');
    grunt.config.requires('umbracoPackage.options.outputDir');
    grunt.config.requires('umbracoPackage.options.sourceDir');

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
      cwd: '/'
    });

    // Declare the name of the generated ZIP file
    var packageFileName = options.outputName ? options.outputName : options.name + '_' + options.version + '.zip';

    // Declare the path of the generated ZIP file
    var tmpOutput = path.join(options.outputDir, packageFileName);

    // Delete the ZIP file if it already exists (eg. already been generated for same version)
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);

    // Gather files
    var filesToPackage = [];
    getFilesRecursive(options.sourceDir);
    filesToPackage = filesToPackage.map(function (f) {
      return {
        guid: f.name,
        dir: f.dir.replace(options.sourceDir, ''),
        name: f.name,
        ext: f.name.split('.').pop()
      };
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

      // Create temp folder for package zip source
      var guidFolder = Guid.create().toString();
      var newDirName = path.join(options.sourceDir, guidFolder);
      fs.mkdirSync(newDirName);
      if (fs.existsSync(options.outputDir) == false) {
        fs.mkdirSync(options.outputDir);
      }

      // Copy flatten structure, with files renamed as <guid>.<ext>
      filesToPackage.forEach(function (f) {
        var newFileName = f.name == "package.xml" ? f.name : f.guid.toString();
        fse.copySync(path.join(options.sourceDir, f.dir, f.name), path.join(newDirName, newFileName));
      });

      // Load / transform XML Manifest
      options.files = filesToPackage;
      if (options.readme) {
        options.readmeContents = grunt.file.read(options.readme);
      }
      var manifest = grunt.file.read(options.manifest);
      manifest = grunt.template.process(manifest, { data: options });
      grunt.file.write(path.join(options.sourceDir, guidFolder, "package.xml"), manifest); // TODO: Probably shouldn't use sourceDir - what if under source control

      // Zip
      var tmpSource = path.join(options.sourceDir, guidFolder);

      archive.directory(tmpSource, false);
    
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
          var src = path.join(options.sourceDir, file.dir, file.name);

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
        }
      }), { name:'package.xml' });
    
    }

    archive.finalize();

    function getFilesRecursive(dir) {
      var files = fs.readdirSync(dir);
      for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;

        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
          getFilesRecursive(name);
        } else {
          filesToPackage.push({ dir: dir, name: files[i] });
        }
      }
    }

  });
};