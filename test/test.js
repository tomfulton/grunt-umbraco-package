var fs = require('fs');
var JsDiff = require('diff');
var unzip = require('unzip');
var path = require('path');

module.exports = {
  packageCreatedWithCorrectName: function (test) {
  	try {	
      var file1 = fs.lstatSync(path.join('artifacts', 'TestPackage_0.0.1.zip'));
      var file2 = fs.lstatSync(path.join('artifacts', 'TestPackage2_0.0.2.zip'));

    	test.ok(file1.isFile());
    	test.ok(file2.isFile());
    } catch (e) {
      test.ok(false);
    }
    test.done();
  },
  packageContainsCorrectFiles: function (test) {
    var actual = [];
    var expected = ['package.manifest', 'package.js', 'script.js', 'package.xml'];

    var parse = unzip.Parse();
    fs.createReadStream(path.join('artifacts', 'TestPackage_0.0.1.zip')).pipe(parse);
    parse.on('entry', function(entry) {
      actual.push(entry.path);
    });
    parse.on('close', function() {
      actual.sort();
      expected.sort();
      test.deepEqual(actual, expected, 'package zip file should unzip and contain all of the expected files');
      test.done();
    });
  },
  packageXmlManifestGenerated: function (test) {
    var parse = unzip.Parse();
    fs.createReadStream(path.join('artifacts', 'TestPackage_0.0.1.zip')).pipe(parse);
    parse.on('entry', function(entry) {
      if (entry.path == 'package.xml') {
        entry
          .pipe(fs.createWriteStream(path.join('artifacts', 'extracted-package-xml.xml')))
          .on('close', function() {
            var file1Contents = fs.readFileSync(path.join('expected', 'package.xml')).toString();
            var file2Contents = fs.readFileSync(path.join('artifacts', 'extracted-package-xml.xml')).toString();
            var diff = JsDiff.diffLines(file1Contents, file2Contents, { ignoreWhitespace: true, newlineIsToken: true });

            var anyChanges = false;
            diff.forEach(function(part) {
              if (part.added || part.removed) {
                anyChanges = true;
              }
            });

            test.ok(!anyChanges);
            test.done();
        });
      }
    });
  }
};