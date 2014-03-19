# Backbone.js Starter Project

A generic boilerplate for [backbone.js](http://backbonejs.org/) projects.

## How to Use

1. Clone the repo locally
    1. `cd path/to/your-project-directory`
    2. `git clone git@github.com:farleyta/backbone-starter.git .`
2. Run `npm install` or `sudo npm install` to install all dependencies
3. Download any additional vendor libraries your project requires (for example, [the Backbone localStorage adaptor](https://github.com/jeromegn/Backbone.localStorage)) and place them in the `js/vendor/` directory.
4. Run `grunt setup` to initialize the project.  This step does the following:
    1. Concatenates all .js files from the `js/vendor` directory (jQuery, Backbone, Underscore, etc)
    2. Minifies them into `js/vendor.min.js`
    3. Creates the proper directory structure (empty) for your app inside the `js/app/` directory
    4. Creates an empty `img` directory for your images
5. Run `grunt watch` (or just `grunt`) to start watching your project for changes (utilizes [LiveReload](http://livereload.com/))
6. Do your thang...