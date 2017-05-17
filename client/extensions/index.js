/**
 * External dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );

console.log( 'before extensions ' );
const extensions = fs.readdirSync( __dirname )
	.filter( node => fs.statSync( path.join( __dirname, node ) ).isDirectory() );
console.log( 'extensions : ', extensions );
module.exports = extensions;
