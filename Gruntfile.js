module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {       	 
          src: ['node_modules/angular/*.js',
              'node_modules/angular-route/*.js',
              'node_modules/angular-resource/*.js',
              'node_modules/angular-animate/*.js',
              'node_modules/jquery/*.js',
              'node_modules/underscore/*.js',
              'node_modules/bootstrap/*.js',
              'node_modules/angular-bootstrap/*.js',
              'src/js/**/*.js',
            //  'config/*.js'
        ],	 
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
          bare_returns: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    less: {
        // production config is also available
        dev: {
            options: {
                // Specifies directories to scan for @import directives when parsing. 
                // Default value is the directory of the source, which is probably what you want.
                paths: ["public/css/"],
            },
            files: {
                // compilation.css  :  source.less
                "public/css/style.css": "public/css/styles.less"
            }
        },
    },
    //qunit: {
//      files: ['public/**/*.html']
  //  },
    jshint: {
      files: ['Gruntfile.js', 'src/js/**/*.js','config/*.js', 'app/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true  
        }
      }
    },
    //watch: {
    //  files: ['<%= jshint.files %>'],
      //  tasks: ['jshint']//, 'qunit']
    watch: {
        scripts: {
            files: [
                'src/js/*.js',
                'unitTests/**/*.spec.js'
            ],
            tasks: ['default']
        },
        /*less: {
            files: ['public/css/*.less'],
            tasks: ['less:dev']
        },*/
        templates: {
            files: [
                'src/views/**/*.html'
            ]
        }
    },
    karma: {
        unit: {
            options: {
                colors: true,
                frameworks: ['jasmine'],
                singleRun: true,
                browsers: ['PhantomJS'],
                files: [
                'node_modules/angular/angular.js',
                'node_modules/angular-mocks/angular-mocks.js',
                'node_modules/angular-route/angular-route.js',
                'node_modules/angular-resource/angular-resource.js',
                'node_modules/underscore/underscore.js',
                'public/js/**/*.js',
                'unitTests/**/*.js',
               // 'config/*.js' ,
                'node_modules/angular-bootstrap/ui-bootstrap.js'
                ],
                plugins: [
                'karma-phantomjs-launcher',
                'karma-jasmine',
                'karma-junit-reporter'
                ],
                reporters: ['dots', 'junit'],
                junitReporter: {
                    outputFile: '../test-results.xml'
                },
                logLevel: 'LOG_DISABLE'
            }
        }
    }
  });

  //if (grunt.option('debug')){
    // console.log(grunt.config('jshint.files'));
  //}

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');
  // grunt.loadNpmTasks('karma-jasmine');
  // grunt.registerTask('test', ['jshint']);//, 'qunit']);

  grunt.registerTask('default', ['jshint', 'karma', 'concat', 'less', 'less:dev', 'uglify']);
  grunt.registerTask('dev', ['default', 'watch']);

};