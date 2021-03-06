// mocha -u tdd *.js
if (typeof module !== 'undefined') {
    // In Node.js load required modules
    var assert = require('chai').assert;
    var PEG = require('pegjs');
    var fs = require('fs');
    var evalScheem = require('../scheem_i').evalScheem;
    var parse = PEG.buildParser(fs.readFileSync(
        '../scheem.peg', 'utf-8')).parse;
} else {
    // In browser assume loaded by <script>
    var parse = SCHEEM.parse;
    var assert = chai.assert;
}

// Some unit tests
suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
	    evalScheem(parse("'(1 2 4)"), {}),
            [1, 2, 4]
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(parse("'(dog and cat)"), {}),
            ['dog','and', 'cat']
        );
    });
});

suite('if', function() {
    test('=', function() {
        assert.deepEqual(
            evalScheem(['=', 1, 1], {}),
            '#t'
        );
    });
    test('num equal', function() {
        assert.deepEqual(
            evalScheem(['if', ['=', 1, 1], 2, 3], {}),
            2
        );
    });
    test('num not equal', function() {
        assert.deepEqual(
            evalScheem(['if', ['=', 1, 3], 2, 3], {}),
            3
        );
    });
    test('string equal', function() {
        assert.deepEqual(
            evalScheem(parse("(if (= 'abc efg) 'abc 'notabc)"), {bindings:{efg:'abc'},out:{}}),
	        'abc'
        );
    });
});

suite('add', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5], {}),
            8
        );
    });
    test('a number and an expression', function() {
        assert.deepEqual(
            evalScheem(parse("(+ 3 (+ 2 3 5) 8 11)"), {}),
            32
        );
    });
    test('a dog and a cat', function() {
	//assert.throws(function (){
	assert.deepEqual(
            evalScheem(['+', 'dog', 'cat'], {bindings:{dog:4, cat:6},out:{}}),
		    10
	);
	//});
    });
});

suite('lambda-one', function() {
    test('add one', function() {
        assert.deepEqual(
            evalScheem([['lambda-one', ['x'], ['+', 'x', 1]], 8], {}),
            9
        );
    });
});

suite('anonymous function', function() {
    test('lambda test', function() {
        assert.deepEqual(
            evalScheem([['lambda', ['x', 'y', 'z'], ['+', 'x', 'y', 'z']], 8, 9, 10], {}),
            27
        );
    });
});

suite('function', function() {
    test('call define lambda', function() {
		var env = {bindings:{}, out:{}};
        evalScheem(['define', 'a', ['lambda', ['x', 'y', 'z'], ['+', 'x', 'y', 'z']]], env);
        assert.deepEqual(
            evalScheem(['a', 8, 9, 10], env),
            27
        );
    });
});

suite('function', function() {
    test('pass function as value', function() {
		var env = {bindings:{}, out:{}};
        evalScheem(['define', 'a', ['lambda', ['x', 'y', 'z'], ['+', 'x', 'y', 'z']]], env);
        evalScheem(['define', 'b', ['lambda', ['x', 'u', 'v', 'w'], ['x', 'u', 'v', 'w']]], env);
        assert.deepEqual(
            evalScheem(['b', 'a', 8, 9, 10], env),
            27
        );
    });
});
