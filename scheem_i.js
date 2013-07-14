/*
var op = function (op) {
    return; 
};
*/

// A half-baked implementation of evalScheem
var evalScheem = function (expr, env) {
    var ret = [];
    var i = 0;
	var retValue = 0;
 
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
    case '+':
		for(i = 1; i < expr.length; i++)
		{
			retValue += evalScheem(expr[i], env); 
		}
        return retValue;
    case '-':
        return evalScheem(expr[1], env) - evalScheem(expr[2], env);
    case '*':
        return evalScheem(expr[1], env) * evalScheem(expr[2], env);
    case '/':
        return evalScheem(expr[1], env) / evalScheem(expr[2], env);
    case '<':
        if(evalScheem(expr[1], env) < evalScheem(expr[2], env))
            return '#t';
        else
            return '#f';
    case '>':
	if(evalScheem(expr[1], env) > evalScheem(expr[2], env))
            return '#t';
	else
            return '#f';
    case '<':
	if(evalScheem(expr[1], env) < evalScheem(expr[2], env))
	    return '#t';
	else
	    return '#f';
    case '=':
        if(evalScheem(expr[1], env) === evalScheem(expr[2], env))
            return '#t';
        else
            return '#f';
    case 'if':
        if(evalScheem(expr[1], env) === '#t')
            return evalScheem(expr[2], env);            
        else 
			return evalScheem(expr[3], env);
    case 'set!':
    case 'define':
        env[evalScheem(expr[1], env)] = evalScheem(expr[2], env);
        return 0;
    case 'begin':
        i = 1;
        while(i < expr.length){
            ret = evalScheem(expr[i], env);
            i++;
        }
        return ret;
    case 'quote':
        return expr[1];
    case 'cons':
	ret[ret.length] = evalScheem(expr[1], env);
	evalScheem(expr[2], env).forEach(function(item,index,array){
            ret[ret.length] = item;
	});
	return ret;
    case 'car':
	return evalScheem(expr[1], env)[0];
    case 'cdr':
	i = 1;
	var list = evalScheem(expr[1], env); 
	while(i < list.length){
            ret[i-1] = list[i];
            i++;
	}
	return ret;
    }
};


// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
}
