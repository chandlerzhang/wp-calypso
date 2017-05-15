/**
 * Used for running mocha directly – allows integration with tooling such as Webstorm
 * $ NODE_ENV=test NODE_PATH=client:test node_modules/.bin/mocha test/run-mocha.js
 */

require( 'babel-register' );
const boot = require( './boot-test' );
before( boot.before );
after( boot.after );
require( './load-suite.js' );
// const path = require( 'path' );
// const p = path.join( 'test', 'test', 'helpers', 'use-nock', 'test', 'index.js' );
// console.log( p );
// const setup = require( './setup' );
// setup.addFile( 'client' );
