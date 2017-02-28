config = {};
config.version = '0.1.5';

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
		var prop = args[i];
		var newspan = document.createElement("span");
		var string;
			switch (typeof(prop))
			{
				case "object":
					if (Error.prototype.isPrototypeOf(prop))
						newspan.style.color = "red";
					if (prop._jsc && prop._jsc.style)
						for (var attr in prop._jsc.style)
							newspan.style[attr] = prop._jsc.style;
				case "function":
					string = prop.toString();
					break;
				case "number":
					newspan.style.color = "darkorange";
					newspan.style.fontFamily = "Courier New";
				case "string":
					string = prop;
					break;
				case "undefined":
					string = "'undefined'";
					newspan.style.color = "brown";
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
	this.console 		= jsconsole;
	this.input 			= input;
	this.submit 		= submit;
	this.history		= [];
	this.history.key	= 0;
	
	this.ajax = {};
	this.ajax.get = function(address)
	{
		var req = new XMLHttpRequest();
		req.open("GET", address);
		//oReq.overrideMimeType("text/plain");
		req.send();
		
		return{
			then:function(callback,parent){
					req.addEventListener("load", function(){
						callback.apply(parent||this,arguments);
					});
			}
		}
	}
	
	this.history.toString = function(title)
	{
		console.log(this.length)
		if (this.length===0)
			return "No history";
			
		result = "<ul>"+(title||"History");
		for (var i=0;i<this.length;i++)
		{
			result +=	"<li style='margin-left: 5%;'>"+
							"<span>"+this[i].time		+"</span>"+
							"<span>"+this[i].command	+"</span>"+
						"</li>";
		}
		result += "</ul>";
		return result;
	}
	
	this.history.clear = function()
	{
		console.log("Clearing history")
		for (var i in this)
			this.pop(i)
	}
	
	//http://tinyurl.com/create.php?source=indexpage&url=http://www.google.com&submit=Make+TinyURL!&alias=
	
	this.history.save = function()
	{
		var historyb64 	= btoa("this.history.load('"+btoa(JSON.stringify(this))+"')");
		var url 		= location.toString();
		
		if (!url.endsWith("#"))
			url += "#";
			
		return "<a href='"+url+historyb64+"'>"+historyb64+"</a>"
	}
	
	this.history.load = function(basestring)
	{
		if (!basestring)
			return "No command entered.";
			
		var data = JSON.parse(atob(basestring));
		this.clear();
		for (var attr in data)
			this[attr] = data[attr]
		return this.toString("Loaded history");
	}
}
JSConsole.prototype.parse = function(string)
{
	try
		{
			return eval(string);
		}
	catch (e)
		{
			return e
		}
	return null
}
JSConsole.prototype.parseInput = function parseInput(override)
{
	var userinput = override || this.input.read("value");
	var result = this.parse ( userinput );
	
	this.log ( userinput ).style.color = "blue";
	
	this.log( result );
	
	this.input.clear();
	
	this.history.push({time:this.timestamp(),command:userinput});
	
	return result;
}
JSConsole.prototype.up = function()
{
	if (this.history.length===0)
		return false
	this.history.key = this.history.key+1>this.history.length?1:this.history.key+1;
	var lastcommand = this.history[this.history.length-this.history.key];
	this.input.elm.value = lastcommand.command;
};
JSConsole.prototype.timestamp = function()
{
	return function(d){
		return d.getHours()+":"+
			   d.getMinutes()+":"+
			   d.getSeconds();
	}(new Date());
}
JSConsole.prototype.log = function out()
{
	
	var args = [].slice.call(arguments);
	args.unshift(this.timestamp());
	
	var elm = this.console.write.apply(this.console,args);
	elm.scrollIntoView();
	return elm;
};
(function initialise(){
	
	var jsc = new JSConsole(new Module("console"),
								new Module("text"),
								new Module("submit"));
			
	jsc.submit.on("click",function(){
		jsc.parseInput();
	});
	
	jsc.input.on("keydown",function(e){
		if (e.keyCode==13)
			jsc.parseInput();
		if (e.keyCode==38)
			jsc.up();
		//else 
		//	console.log(e.keyCode)
	});	

	function printError(e){
		jsc.log(e);
	};
	window.addEventListener('error',printError);
	window.error = printError;
	document.body.error = printError;
	document.error = printError;

	jsc.log("JSConsole (",config.version,") running");
	function processHash() {
	  const hash = location.hash.slice(1);
	  if (hash)
		{
			try //to load as base64
			{
				jsc.parseInput ( atob( hash ) );
			}
			catch (e)
			{
				jsc.parseInput(hash)
			}
			
			location.hash = "";
		}
	}

	window.addEventListener('hashchange', processHash);
	processHash();
	jsc.input.elm.focus();
})();
