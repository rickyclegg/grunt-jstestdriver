# grunt-jstestdriver

CURRENTLY UNDER CONSTRUCTION

Uniting testing using JS Test Driver.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-jstestdriver`

This will download to your project folder. The terminal window may go a bit strange as it copies the jstestdriver.jar to a lib folder on your computer.

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-jstestdriver');
```
The gruntfile config options have three mandatory properties.

```javascript
jstestdriver: {
    browser: "/Applications/Firefox.app/Contents/MacOS/firefox",
    port: "9876",
    tests: "all"
}
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Documentation
You can use pretty much all of the properties in the JSTD configuration.
https://code.google.com/p/js-test-driver/wiki/CommandLineFlags

Example grunt.js

```javascript
jstestdriver: {
    browser: "/Applications/Safari.app/Contents/MacOS/firefox",
    port: "9876",
    preloadFiles: "true",
    tests: "all",
    verbose: "true",
    basePath: "../../"
}
```

If you need to reset the server, point to your jstestdriver.jar and call with the --reset option.
Or you can close down your terminal window.

```javascript
java -jar lib/jstestdriver.jar --reset
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Ricky Clegg  
Licensed under the MIT license.
