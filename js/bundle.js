config = {};
config.version = '0.1.0';

Object.dump = function(prop)
{
	var seen = [];
	return JSON.stringify(prop,function(key, val) 
			{
			   if (val != null && typeof val == "object") 
			   {
					if (seen.indexOf(val) >= 0) 
					{
						return;
					}
					seen.push(val);
				}
				return val;
			});								
};
	
function Module(domid)
{
	this.elm = document.getElementById(domid);
	if (!this.elm || this.elm === null)
		throw new Error("Hey numbnuts, that element doesn't exist. (#"+domid+")");
	
};
Module.prototype.write = function()
{
	var args = [].slice.call(arguments);
	var newelm = document.createElement("div");
	for (var i in args)
	{
		var prop = args[i]
		var newspan = document.createElement("span");
		var string;
			switch (typeof(prop))
			{
				case "undefined":
					string = "'undefined'";
					newspan.style.color = "blue";
					break;
				case "object":
					if (prop._iserror) //its an error
						{
							string = prop.toString();
							newspan.style.color = 'red';
						}
					else
						string = Object.dump(prop)
					break;
				case "string":
				case "number":
					string = prop;
					break;
				default:
					this.write("Warning: Unhandled type cast to string: ",typeof(prop))
					string = prop.toString();
					break;
			}
		newspan.innerHTML = string;
		newelm.appendChild(newspan);
	}
	this.elm.appendChild(newelm);
	return newelm;
};
Module.prototype.read = function(attr)
{
	return this.elm[attr];
}
Module.prototype.on	=	function(event,callback)
{
	return this.elm.addEventListener(event,callback);
}
Module.prototype.clear	= function()
{
	this.elm.value = "";
}
Module.prototype.css = function(attr,value)
{
	this.elm.style[attr] = value;
}

function JSConsole(jsconsole,input,submit)
{
	this.console 	= jsconsole;
	this.input 		= input;
	this.submit 	= submit;
}
JSConsole.prototype.parseInput = function parseInput()
{
	var result = null;
	try
		{
			result = eval(this.input.read("value"));
			this.input.clear();
			this.submit.css("color","green");
		}
	catch (e)
		{
			result = e;
			result._iserror = true;
			this.submit.css("color","red");
			
		}
	this.log( result );
}

JSConsole.prototype.log = function out()
{
	
	var args = [].slice.call(arguments);
	var timestamp = function(d){
		return d.getHours()+":"+
			   d.getMinutes()+":"+
			   d.getSeconds();
	}(new Date());
	
	args.unshift(timestamp);
	this.console.write.apply(this.console,
						args).scrollIntoView();
};

(function initialise(){
	
	var jsc = new JSConsole(new Module("console"),
								new Module("text"),
								new Module("submit"));
								
	jsc.submit.on("click",function(){
		jsc.parseInput
	}));
	jsc.input.on("keydown",function(e){
		if (e.keyCode===13)
			jsc.parseInput()
	});	

	window.addEventListener('error',function(e){
		jsc.log(e)
	});

	jsc.log("JSConsole (",config.version,") running");
})();
