module.exports = function (grunt) {

  const config = {
    bowerDir: 'bower_components',
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/**/*.js'],
        dest: `dist/js/<%= pkg.name %>.js`,
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.js': 'dist/js/<%= pkg.name %>.js',
        },
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
        },
      },
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          loadPath: [
            config.bowerDir + '/bootstrap-sass/assets/stylesheets/',
          ],
        },
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'src/scss/styles.scss',  // 'destination': 'source'
        },
      },
    },

    pug: {
      compile: {
        options: {
          data: {
            debug: false,
          },
        },
        files: {
          'dist/index.html': ['src/*.pug'],
        },
      },
    },

    jshint: {
      files: ['Gruntfile.js', 'src/js/**/*.js'],
      options: {
        // options here to override JSHint defaults
        esversion: 6,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          esnext: true,
        },
      },
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint'],
    },

  });

  grunt.loadNpmTasks('grunt-babel');

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-pug');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'pug', 'concat', 'babel', 'uglify', 'sass']);

};
