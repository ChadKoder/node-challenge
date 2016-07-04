var fs = require('fs');

module.exports = function(grunt) {

 // build a list of all module names based off of the directories.
    var modules = (function () {
        var dir = 'src/js',
            files = fs.readdirSync(dir),
            stat, file, i,
            result = [];
        for (i = 0; i < files.length; i++) {
            file = files[i];
            stat = fs.statSync(dir + '/' + file);
            if (stat.isDirectory()) {
                result.push(file);
            }
        }
        return result;
    })();
	
	var pkg = grunt.file.readJSON('package.json'),
		build = grunt.template.today('yyyymmdd_HHMMss_1');
	
	var requiredJsFiles = [
		'node_modules/angular/angular.js',
		'node_modules/angular-cookies/angular-cookies.js',
        'node_modules/angular-resource/angular-resource.js',
		'node_modules/angular-route/angular-route.js',
		'node_modules/angular-animate/angular-animate.js',
		'node_modules/angular-messages/angular-messages.js'
	],
	concatConfig = {
		requirements: {
			options: {
				sourceMap: false,
				banner: '/*\n' + 
				  ' * Requirements v <%=pkg.version%> (build <%=build%>)\n' +
				  ' */\n\n'
			},
			dest: 'web/js/requirements.js',
			src: requiredJsFiles,
			nonull: true
		}
	},
	jshintFiles = ['src/js/**/*.js'],
	 
	uglifyConfig = {
		requirements: {
			options: {
				banner: '/*\n' +
					' * Requirements v <%=pkg.version%> (build <%=build%>)\n' +
					' */\n\n'
			},
			files: {
				'web/js/requirements.min.js': 'web/js/requirements.js'
			}
		}
	};
		
		
		
	function createBannerTemplate(name) {
        return '/*\n' +
            ' * ' + name + ' v <%=pkg.version%> (build <%=build%>)\n' +
            ' * Copyright (c) <%=grunt.template.today("yyyy")%>\n' +
            ' * <%=pkg.author %> - All Rights Reserved\n' +
            ' * Unauthorized use of this file is strictly prohibited.\n' +
            ' * See EULA for details: <%=pkg.eulaUrl%>\n' +
            ' */\n\n';
    };
	
	 //builds the config options.
    (function () {
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i],
                scriptsdir = 'web/js/',
                concatenatedFile = scriptsdir + module + '.js',
                minified = scriptsdir + module + '.min.js',
                moduledir = 'src/js/' + module + '/',
                bannerTemplate = createBannerTemplate(module);

            // Push pre-concat version to jshint first so we get accurate file names / line numbers.
            jshintFiles.push(moduledir + '/**/*.js');

            concatConfig[module] = {
                options: {
                    banner: bannerTemplate,
                    sourceMap: false
                },
                dest: concatenatedFile,
                src: [
                   // 'src/intro.js',
                        moduledir + module + '.js',
                        moduledir + '/**/*.js'//,
                   // 'src/outro.js'
                ]
            };
            uglifyConfig[module] = {
                options: {
                    banner: bannerTemplate
                },
                files: {}
            };

            uglifyConfig[module].files[minified] = [concatenatedFile];

            //push first party post-concat modules to ensure nothing went wrong with concat.
            jshintFiles.push(concatenatedFile);

           // karmaConfig.debug.options.files.push(concatenatedFile);
            //karmaConfig.continuousDev.options.files.push(concatenatedFile);
            //karmaConfig.continuousDev.options.preprocessors[concatenatedFile] = ['coverage'];
            //karmaConfig.continuousBuild.options.files.push(concatenatedFile);
            //karmaConfig.continuousBuild.options.preprocessors[concatenatedFile] = ['coverage'];
        }

        //Push remaining web/js files that may not have been caught.
        jshintFiles.push('!web/js/angular-ui.js');
    })();	
	 
	grunt.initConfig({
		clean:{
			options: {
				'no-write': false,
				'force': true
			},
			all: ['../output/_PublishedWebsites/PhotoSaver/', './www', 'web/js']
		},
		//connect: {
			//server: {
				//port: 8888,
				//base: '../output/_PublishedWebsites/PhotoSaver',
				//keepalive: false,
				//open: {
//					target: 'http://localhost:8888/#'
				//}
//			}
		//},
		pkg: pkg,
		build: build,
		concat: concatConfig,
		jshint: {
			files: {
				src: jshintFiles
			},
			 options: {
                    trailing: true,
                    quotmark: 'single',
                    bitwise: true,
                    forin: true,
                    browser: true,
                    "bitwise": true,
                    "camelcase": true,
                    "curly": true,
                    "eqeqeq": true,
                    "esversion": 6,
                    "forin": true,
                    "freeze": true,
                    "immed": true,
                    "indent": 4,
                    "latedef": "nofunc",
                    "newcap": true,
                    "noarg": true,
                    "noempty": true,
                    "nonbsp": true,
                    "nonew": true,
                    "plusplus": false,
                    "undef": true,
                    "unused": false,
                    "strict": false,
                    "maxparams": 10,
                    "maxdepth": 5,
                    "maxstatements": 40,
                    "maxcomplexity": 8,
                    "maxlen": 320,
                    "asi": false,
                    "boss": false,
                    "debug": false,
                    "eqnull": true,
                    "esnext": false,
                    "evil": false,
                    "expr": false,
                    "funcscope": false,
                    "globalstrict": false,
                    "iterator": false,
                    "lastsemic": false,
                    "laxbreak": false,
                    "laxcomma": false,
                    "loopfunc": true,
                    "maxerr": 50,
                    "moz": false,
                    "multistr": false,
                    "notypeof": false,
                    "proto": false,
                    "scripturl": false,
                    "shadow": false,
                    "sub": true,
                    "supernew": false,
                    "validthis": false,
                    "noyield": false,
                    "node": true,

                    globals: {
                        angular: false,
                        controller: false,
                        cordova: false,
                        //testing
                        jasmine: false,
                        module: false,
                        describe: false,
                        it: false,
                        xit: false,
                        expect: false,
                        beforeEach: false,
                        afterEach: false,
                        runs: false,
                        waits: false,
                        //mocks
                        inject: false,
                        spyOn: false
                    }
                }
		},
		uglify: uglifyConfig,
		sync: {
                main: {
                    files: [
                        {
                            expand: true,
                            cwd: 'node_modules/angular-material',
                            src: ['angular-material.css', 'angular-material.min.css'],
                            dest: './web/css/'
                        },
                        {
                            expand: true,
                            cwd: 'node_modules/angular-material',
                            src: ['angular-material.css', 'angular-material.min.css'],
                            dest: './www/css/'
                        },
						{
							expand: true,
							cwd: 'src/views',
							src: ['index.html'],
							dest: './web/views'
						}
						,
						{
							expand: true,
							cwd: 'src/js',
							src: ['*.js'],
							dest: './web/js'
						}
                    ]
                }
            }
	});

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('default', ['clean', 'concat', 'uglify', 'sync']);
};