## 1.0.0 - 11/24/2015

#### Features:

* Optionally generate `package.xml` programatically
* Support for multiple build targets in grunt
* Use real file names instead of guids in archive when possible
* New option `outputName` to override the generated archive file name

#### Misc: 
* General process improvements & cleanups
* Introduce tests

#### :bomb: Breaking Changes:

This major release included a lot of breaking changes that will require you to restructure your Grunt configuration, and potentially your `package.xml` file.  Here are the areas of interest:

#### readme / readmeContents options merged
The `readme` option has been changed to accept a string containing your desired readme content, rather than a file path to an external file.  You should enter the desired content directly into this option, or use grunt templates to load the content from an external file to use the previous behavior:

#### multitask
The task has been converted to a multiTask to enable configuring builds for multiple packages in the same repository.  To support this, you need to wrap your existing configuration with a target name, such as:

```js
umbracoPackage: {
  main: {
    // normal task configuration
  }
}
```
#### src/dest parameters
To support glob patterns, the `sourceDir` and `outputDir` properties have been removed in favor of `src` and `dest`, which live at the root level of the task.  You should move and rename these options per the example in the README.

#### generated package.xml
In the new version, the `packageXml` option is no longer required, and the file can be generated automatically based on your configuration.  To enable this, just remove this option and delete the `package.xml` file from your repository.

If you wish to continue using your own `package.xml` file, you will need to make these changes:

* Change `<guid><%= file.guid %>.<%= file.ext %></guid>` to `<guid><%= file.guid %></guid>`
* Change `readmeContents` to `readme`

## 0.0.6 - 4/2/2015

Maintenance
* Replace `adm-zip` with `archiver` for better reliability

## 0.0.5 - 3/22/2014

Fixes
* Use Mac-friendly paths

## 0.0.4 - 2/28/2014

Features
* Make `readme` parameter optional to match Umbraco backoffice behavior

## 0.0.3 - 2/28/2014

Fixes
* Fix issue with build

## 0.0.2 - 2/17/2014

Maintenance
* Add license

## 0.0.1 - 2/17/2014

* Initial commit