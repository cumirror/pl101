var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem_express.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
console.log( parse("'  (a b c  ( e f\r\n g ) ) ") );
console.log( parse("'\t a") );
console.log( parse("'(a b c) ") );
//assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );


