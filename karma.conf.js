module.exports = function(config) {
  config.set({
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'test/**/*.js': ['webpack']
    },

    frameworks: ['jasmine'],
    files: [
        'test/**/*.js',
        { pattern: 'public/**/*.gif', watched: false, included: false, served: true, nocache: false },
        { pattern: 'public/**/*.png', watched: false, included: false, served: true, nocache: false },
        { pattern: 'public/**/*.json', watched: false, included: false, served: true, nocache: false }
    ],
    proxies: {
        '/img/': '/base/public/img/',
        '/levels/': '/base/public/levels/',
        '/sprites/': '/base/public/sprites/'
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