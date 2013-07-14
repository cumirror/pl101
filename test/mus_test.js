var MAX = function (a, b) {
    return a>b?a:b;
};

var change = function (a) {
    switch(a)
    {
    case 'a':
    case 'A':
	return 10;
	break;
    case 'b':
    case 'B':
	return 11;
	break;
    case 'c':
    case 'C':
	return 0;
	break;
    case 'd':
    case 'D':
	return 2;
	break;
    case 'e':
    case 'E':
	return 4;
	break;
    case 'f':
    case 'F':
	return 5;
	break;
    case 'g':
    case 'G':
	return 7;
	break;
    default:
	return 0;
    }
};

var convertPitch = function (a) {
    return 12 + 12*Number(a[1]) + change(a[0]);
};

var endTime = function (time, expr) {
    if('seq' === expr.tag)
    {
        return endTime(endTime(time, expr.left), expr.right);
    }else if('par' === expr.tag){
        return MAX(endTime(time,expr.left), endTime(time,expr.right));
    }else if('repeat' == expr.tag){
        return time+endTime(0, expr.section)*expr.count;
    }else if('rest' == expr.tag){
        return time + expr.duration;
    }else
        return time + expr.dur;
};

var compile = function (musexpr) {
    var compile_ = function (start, musexpr){
        var ret = [];
            
        if('seq' === musexpr.tag){    
            compile_(start, musexpr.left).forEach(function(item, index, array){
                ret[ret.length] = item;
            });
            compile_(endTime(start, musexpr.left), musexpr.right).forEach(function(item, index, array){
                ret[ret.length] = item;
            });
        }else if('par' === musexpr.tag){
            compile_(start, musexpr.left).forEach(function(item, index, array){
                ret[ret.length] = item;
            });
            compile_(start, musexpr.right).forEach(function(item, index, array){
                ret[ret.length] = item;
            });
        }else if('repeat' === musexpr.tag){
	    var count = 0;
	    while(count < musexpr.count){
/*		var tmp = {
		    tag   : 'note',
		    pitch : '',
		    start : 0,
		    dur   : 0
		};
		tmp.pitch = convertPitch(musexpr.section.pitch);
		tmp.start = start;
		tmp.dur = musexpr.section.dur;
		tmp.start += count*musexpr.section.dur;
		ret[ret.length] = tmp;
*/		
		ret[ret.length] = compile_(start, musexpr.section);
		start = endTime(start, musexpr.section);
		count++;
	    }
        }else if('rest' === musexpr.tag){
            var tmp = {
		tag   : 'note',
		pitch : '',
		start : 0,
		dur   : 0
            };
	    tmp.dur = musexpr.duration;
            tmp.start = start;
            ret[ret.length] = tmp;
        }else{
            var tmp = {
		tag   : 'note',
		pitch : '',
		start : 0,
		dur   : 0
            };
            //tmp.pitch = musexpr.pitch;
            tmp.pitch = convertPitch(musexpr.pitch);
	    tmp.dur = musexpr.dur;
            tmp.start = start;
            ret[ret.length] = tmp;
        }
        return ret;
    };
        
    return compile_(0, musexpr);
};

var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('../mus.peg', 'utf-8');
// Create my parser
var parse = PEG.buildParser(data).parse;
var melody_mus = parse("((g7[400] (repeat (a2[122] (par a4[10] a5[300])) 5)) (rest 10))");
console.log(melody_mus);
console.log(compile(melody_mus));
