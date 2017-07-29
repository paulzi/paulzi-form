module.exports = function(grunt) {
    grunt.initConfig({
        meta: {
            banner: "/**\n" +
                " * PaulZi Form\n" +
                " * @see https://github.com/paulzi/<%= pkg.name %>\n" +
                " * @license MIT (https://github.com/paulzi/<%= pkg.name %>/blob/master/LICENSE)\n" +
                " * @version <%= pkg.version %>\n" +
                " */\n"
        },
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'src/use-strict.js',
                    'src/internal.js',
                    'src/no-empty.js',
                    'src/lock.js',
                    'src/scenarios.js',
                    'src/catch-download.js',
                    'src/ajax.js',
                    'src/ajax-response.js',
                    'src/loading-state.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            banner: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src:  'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.js'
            },
            all: {
                src: [
                    'node_modules/form-extra-events/dist/form-extra-events.js',
                    'node_modules/form-association-polyfill/dist/form-association-polyfill.js',
                    'node_modules/jquery-iframe-ajax/dist/jquery-iframe-ajax.js',
                    'dist/<%= pkg.name %>.js'
                ],
                dest: 'dist/<%= pkg.name %>.all.js'
            }
        },
        umd: {
            all: {
                options: {
                    src: 'dist/<%= pkg.name %>.js',
                    objectToExport: 'PaulZiForm',
                    deps: {
                        'default': [{'jquery': '$'}],
                        global: ['jQuery']
                    }
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            },
            all: {
                files: {
                    'dist/<%= pkg.name %>.all.min.js': ['<%= concat.all.dest %>']
                }
            }
        },
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', '!src/use-strict.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['src/**/*'],
            tasks: ['concat:dist', 'umd', 'concat:banner', 'concat:all']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'concat:dist', 'umd', 'concat:banner', 'concat:all', 'uglify:dist', 'uglify:all']);

};