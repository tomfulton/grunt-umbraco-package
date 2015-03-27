module.exports = function(grunt) {
  grunt.registerTask('umbracoPackage', 'Create Umbraco Package', function() {
  	grunt.config.requires('umbracoPackage.options.name');
  	grunt.config.requires('umbracoPackage.options.version');
  	grunt.config.requires('umbracoPackage.options.license');
  	grunt.config.requires('umbracoPackage.options.licenseUrl');
  	grunt.config.requires('umbracoPackage.options.url');
  	grunt.config.requires('umbracoPackage.options.author');
  	grunt.config.requires('umbracoPackage.options.authorUrl');
  	grunt.config.requires('umbracoPackage.options.manifest');
  	grunt.config.requires('umbracoPackage.options.readme');
  	grunt.config.requires('umbracoPackage.options.outputDir');
  	grunt.config.requires('umbracoPackage.options.sourceDir');
    
    var done = this.async();
	var Guid = require('guid');
	var path = require('path');
	var rimraf = require('rimraf');
	var archiver = require('archiver');
	var fs = require('fs');
    var fse = require('fs-extra');

    var options = this.options({
    	minimumUmbracoVersion: '',
    	files: [],
    	cwd: '/'
    });

	var packageFileName = options.name + "_" + options.version + ".zip"

	// Gather files
	var filesToPackage = [];
	getFilesRecursive(options.sourceDir);
	filesToPackage = filesToPackage.map(function(f) {
		return { guid: Guid.create(), dir: f.dir.replace(options.sourceDir, ''), name: f.name, ext: f.name.split('.').pop() };	
	});

	// Create temp folder for package zip source
	var guidFolder = Guid.create().toString();
	var newDirName = path.join(options.sourceDir, guidFolder);
	fs.mkdirSync(newDirName);
    if (fs.existsSync(options.outputDir) == false) {
      fs.mkdirSync(options.outputDir);
    }
    

	// Copy flatten structure, with files renamed as <guid>.<ext>
	filesToPackage.forEach(function(f) {
		var newFileName = f.name == "package.xml" ? f.name : f.guid.toString() + '.' + f.ext;
		fse.copySync(path.join(options.sourceDir, f.dir, f.name), path.join(newDirName, newFileName));
	});

	// Load / transform XML Manifest
	options.files = filesToPackage;
	if (options.readme) {
		options.readmeContents = grunt.file.read(options.readme);
	}
	var manifest = grunt.file.read(options.manifest);
	manifest = grunt.template.process(manifest, {data: options});
	grunt.file.write(path.join(options.sourceDir, guidFolder, "package.xml"), manifest); // TODO: Probably shouldn't use sourceDir - what if under source control

	// Zip
    var tmpOutput = path.join(options.outputDir, packageFileName);
    var tmpSource = path.join(options.sourceDir, guidFolder);
    
    var output = fs.createWriteStream(tmpOutput);
    var archive = archiver('zip');

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      done(true);
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(output);

    archive.directory(tmpSource, false);
    archive.finalize();
    
    
	//zip.addLocalFolder(path.join(options.sourceDir, "../", guidFolder));
	//zip.writeZip(path.join(options.outputDir, packageFileName))
	
	function getFilesRecursive(dir) {
    	var files = fs.readdirSync(dir);
    	for (var i in files) {
	        if (!files.hasOwnProperty(i)) continue;

	        var name = dir+'/'+files[i];
        	if (fs.statSync(name).isDirectory()) {
	            getFilesRecursive(name);
        	} else {
        		filesToPackage.push({ dir: dir, name: files[i]});
        	}
    	}
	}

  });
};