var lookup = function (env, v) {
	if(!(env.hasOwnProperty('bindings')))
		//return null;
		throw new Error(v + 'not found');
	if(env.bindings.hasOwnProperty(v))
		return env.bindings[v];
	else
		return lookup(env.out, v);
};


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
        return lookup(env, expr);
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
       /* In javascript, obj is reference type, and the obj parameters is only a reference.
		* So modify the obj parameters to a new reference will not modify the orignal obj.
		* Also remember, in function the local variable will be destroy finally.
		*/
	   /*
		newEnv = {};
		newEnv.bindings = {};
		newEnv.bindings[expr[1]] = evalScheem(expr[2], env);
		newEnv.out = env;
		env = newEnv;
	   */
		var oldEnv = {};
		oldEnv.bindings = env.bindings;
		oldEnv.out = env.out;
		env.bindings = {};
		env.bindings[expr[1]] = evalScheem(expr[2], env);
		env.out = oldEnv;
		return 0;
    case 'begin':
        i = 1;
		ret = [];
        while(i < expr.length){
            ret = evalScheem(expr[i], env);
            i++;
        }
        return ret;
    case 'quote':
        return expr[1];
    case 'cons':
		ret = [];
		ret[ret.length] = evalScheem(expr[1], env);
		evalScheem(expr[2], env).forEach(function(item,index,array){
            ret[ret.length] = item;
		});
		return ret;
    case 'car':
		return evalScheem(expr[1], env)[0];
    case 'cdr':
		i = 1;
		ret = [];
		var list = evalScheem(expr[1], env); 
		while(i < list.length){
            ret[i-1] = list[i];
            i++;
		}
		return ret;
	case 'lambda-one':
		return function(x) { 
			var newEnv = {};
			newEnv.bindings = {};
			newEnv.bindings[expr[1][0]] = x;
			newEnv.out = env;
			return evalScheem(expr[2], newEnv);
		}; 
	case 'lambda':
		return function(x, y, z) { 
			var newEnv = {};
			newEnv.bindings = {};
			if(expr[1].length != arguments.length)
				throw new Error('function arguments not equal');
			for(i = 0; i < expr[1].length; i++)
			{
				newEnv.bindings[expr[1][i]] = arguments[i];
			}
			newEnv.out = env;
			//console.log(expr[2], newEnv);
			return evalScheem(expr[2], newEnv);
		}; 
	
	default:
		var func = evalScheem(expr[0], env);
		var agrs = [];
		for(i = 1; i < expr.length; i++)
		{
			agrs[i-1] = evalScheem(expr[i], env); 
		}
		return func.apply(null, agrs);
	}
};


// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
}
