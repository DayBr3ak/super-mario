module.exports = function(config) {
  config.set({
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'test/**/*.js': ['webpack']
    },

    frameworks: ['jasmine'],
    files: [
        'test/**/*.js',
        { pattern: 'public/assets/**/*.json', watched: true, included: false, served: true, nocache: false },
        { pattern: 'public/assets/**/*', watched: false, included: false, served: true, nocache: false },
    ],
    proxies: {
        '/assets/': '/base/public/assets/'
    },
    reporters: ['progress'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless', 'ChromeHeadless2'],
    customLaunchers: {
        "ChromeHeadless2": {
            base: 'Chrome',
            flags: ['--headless', '--remote-debugging-port=9222', '--no-sandbox']
        }
    },
    // autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity
  })
}