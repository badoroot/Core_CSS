module.exports = function(grunt) {

    "use strict";

    require('load-grunt-tasks')(grunt);

    var autoprefixer = require('autoprefixer-core');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * Core CSS v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
        ' */\n',

        requirejs_banner: "\n(function( factory ) {\n"+
        "    if ( typeof define === 'function' && define.amd ) {\n" +
        "        define([ 'jquery' ], factory );\n"+
        "    } else {\n" +
        "        factory( jQuery );\n"+
        "    }\n"+
        "}(function( jQuery ) { \n'use strict';\n\nvar $ = jQuery;\n\n",

        clean: {
            build: ['build/js', 'build/css']
        },

        concat: {
            options: {
                banner: '<%= banner %>' + '<%= requirejs_banner%>',
                footer: "\n\n return CoreCss.init();\n\n}));",
                stripBanners: true,
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            core: {
                src: [
                    'js/*.js',
                    'js/utils/*.js',
                    'js/widgets/*.js'
                ],
                dest: 'build/js/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false,
                sourceMap: false,
                preserveComments: false
            },
            core: {
                src: '<%= concat.core.dest %>',
                dest: 'build/js/<%= pkg.name %>.min.js'
            }
        },

        less: {
            options: {
                paths: ['less'],
                strictMath: false,
                sourceMap: false
            },
            compileCore: {
                src: 'less/<%= pkg.name %>.less',
                dest: 'build/css/<%= pkg.name %>.css'
            },
            compileCoreColors: {
                src: 'less/<%= pkg.name %>-colors.less',
                dest: 'build/css/<%= pkg.name %>-colors.css'
            },
            compileCoreIcons: {
                src: 'less/<%= pkg.name %>-icons.less',
                dest: 'build/css/<%= pkg.name %>-icons.css'
            }
        },

        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: 'build/css/*.css'
            }
        },

        cssmin: {
            minCore: {
                src: 'build/css/<%= pkg.name %>.css',
                dest: 'build/css/<%= pkg.name %>.min.css'
            },
            minCoreColors: {
                src: 'build/css/<%= pkg.name %>-colors.css',
                dest: 'build/css/<%= pkg.name %>-colors.min.css'
            },
            minCoreIcons: {
                src: 'build/css/<%= pkg.name %>-icons.css',
                dest: 'build/css/<%= pkg.name %>-icons.min.css'
            }
        },

        copy: {
            docs_css_core: {
                src: 'build/css/<%= pkg.name %>.css',
                dest: 'docs/css/<%= pkg.name %>.css'
            },
            docs_css_core_colors: {
                src: 'build/css/<%= pkg.name %>-colors.css',
                dest: 'docs/css/<%= pkg.name %>-colors.css'
            },
            docs_css_core_icons: {
                src: 'build/css/<%= pkg.name %>-icons.css',
                dest: 'docs/css/<%= pkg.name %>-icons.css'
            },
            docs_css_core_fonts: {
                src: 'fonts/*',
                dest: 'build/'
            },
            docs_css_core_fonts_2: {
                src: 'fonts/*',
                dest: 'docs/'
            },
            docs_js: {
                src: 'build/js/<%= pkg.name %>.js',
                dest: 'docs/js/<%= pkg.name %>.js'
            }
        },

        watch: {
            scripts: {
                files: ['js/*.js', 'js/utils/*.js', 'js/widgets/*js', 'less/*.less', 'less/utils/*.less', 'less/core/*.less', 'less/include/*.less', 'less/schemes/*.less'],
                tasks: ['concat', 'uglify', 'less', 'postcss', 'copy']
            }
        }
    });

    grunt.registerTask('default', [
        'clean', 'concat', 'uglify', 'less', 'postcss', 'cssmin', 'copy', 'watch'
    ]);

};