module.exports = function(grunt) {

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    mkdir: {
      setup: {
        options: {
          create: [
            'img',
            'js/app/collections', 
            'js/app/models', 
            'js/app/routers', 
            'js/app/views'
          ]
        }
      }
    },

    concat: {
      app: {
        src: ['js/app/models/*.js', 'js/app/collections/*.js', 'js/app/views/*.js', 'js/app/routers/*.js', 'js/app/app-init.js'],
        dest: 'js/app/app.js'
      },
      vendor: {
        src: ['js/vendor/jquery*.js', 'js/vendor/underscore*.js', 'js/vendor/backbone*.js', 'js/vendor/*.js', '!js/vendor/all.js'],
        dest: 'js/vendor/all.js'
      },
    },

    uglify: {
      options: {
        mangle: false
      },
      app: {
        files: {
          'js/app.min.js': ['js/app/app.js']
        }
      },
      vendor: {
        files: {
          'js/vendor.min.js': ['js/vendor/all.js']
        }
      }
    },

    jshint: {
      // no need to lint app.js – just a concat of app subdir js files
      all: ['Gruntfile.js', 'js/{,**/}*.js', '!js/*.min.js', '!js/vendor/*', '!js/app/app.js']
    },

    compass: {
      dist: {
        options: {
          cssDir: 'css',
          sassDir: 'sass',
          imagesDir: 'img',
          javascriptsDir: 'js',
          fontsDir: 'css/fonts',
          assetCacheBuster: 'none',
          outputStyle: 'compressed',
          require: 'compass-normalize'
        }
      }
    },

    watch: {
      compass: {
        files: ['sass/{,**/}*.scss'],
        tasks: ['compass']
      },
      js: {
        files: ['<%= jshint.all %>'], // exclude the vendor files from linting,
        tasks: ['jshint', 'concat:app', 'uglify:app']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '*.html',
          'css/style.css',
          'js/*.js',
          'images/{,**/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('setup', ['concat:vendor', 'uglify:vendor', 'mkdir:setup']);

};