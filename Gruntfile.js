"use strict";

module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      build: { src: ["assets", "*.zip"] }
    },
    copy: {
      install: {
        files: [
          {
            expand: true, flatten: true,
            src: [
              'bower_components/fos-fx-sync/**/fx-sync.js',
            ],
            dest: "assets/js/"
          },
          {
            expand: true, flatten: true,
            cwd: 'bower_components/building-blocks/',
            src: ['js/*.js'],
            dest: "assets/js/building-blocks/"
          },
          {
            expand: true, flatten: false,
            cwd: 'bower_components/building-blocks/',
            src: ['cross_browser.css', 'transitions.css', 'util.css', 'icons/**/*.{css,png,svg}', 'style/**/*.{css,png,svg}'],
            dest: "assets/css/building-blocks/"
          },
        ]
      }
    },
    replace: {
      remove_eval_on_crypt: {
        src: "assets/js/fx-sync.js",
        dest: "assets/js/fx-sync.js",
        replacements: [
          {
            from: "return eval(this.code); // maybe...",
            to: "throw new Error('eval call');//return eval(this.code); // maybe...",
          }
        ]
      },
      remove_broken_set_timeout: {
        src: "assets/js/building-blocks/action_menu.js",
        dest: "assets/js/building-blocks/action_menu.js",
        replacements: [
          {
            from: "window.setTimeout(this.hide.bind(this));",
            to: "window.setTimeout(function(v){v.hide();}, 4, this);//window.setTimeout(this.hide.bind(this));",
          }
        ]
      }
    },
    zip: {
      "package": {
        dest: "fx-sync-4-fos.zip",
        src: [
          "assets/**/*",
          "data/**/*",
          "img/**/*",
          "js/**/*",
          "index.*",
          "LICENSE",
          "manifest.webapp"
        ]
      }
    },
    jshint: {
      files: [
        "Gruntfile.js",
        "package.json",
        "*.js"
      ],
      options: {
        jshintrc: ".jshintrc"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask("build", [
    "clean:build",
    "copy:install",
    "replace:remove_eval_on_crypt",
    "replace:remove_broken_set_timeout"
  ]);
  grunt.registerTask("test", [
    "build",
    "jshint"
  ]);
  grunt.registerTask("dist", [
    "build",
    "zip:package"
  ]);
  grunt.registerTask("default", ["dist"]);
};
