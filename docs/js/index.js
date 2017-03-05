(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Emitter = function()
{
	this.events = {};
}

Emitter.prototype.emit = function()
{
	var args 		= [].slice.call(arguments);
	var event		= args.shift();
	var data		= args.shift();
	var parent		= args.shift();
	
	args.unshift(data);
	
	if (!this.events[event])
		throw new Error("Emitter: No such event "+event)
	
	var events = this.events[event];
	
	events.map(function(eventinfo)
	{
		var subargs = eventinfo.args.concat(args);
		eventinfo.callback.apply(parent,subargs);
	});
	
}

Emitter.prototype.on = function()
{
	//convert arguments to array
	var args 		= [].slice.call(arguments);
	var event		= args.shift();	//pop args[0]
	var callback	= args.shift(); //pop args[0]
	
	var newevent = {callback:callback,args:args};
	
	if (!this.events[event])
		this.events[event] = [];
	
	return this.events[event].push(newevent);
};

Emitter.prototype.off = function()
{
	var args 		= [].slice.call(arguments);
	var event		= args.shift();	
	var callback	= args.shift(); 
	
	this.events[event].filter(function(e){
			return !e.callback===callback;
	})
};


module.exports = Emitter;

},{}],2:[function(require,module,exports){
var Emitter = require("./emitter");

function View(attributes)
{
	this.properties = {};

	for (var attr in attributes)
		switch(typeof(attributes[attr]))
		{
			case "function":
				this[attr] = attributes[attr];
				break
			default:
				this.properties[attr] = attributes[attr];
				break;
		}
	
	var self = this;

	View.domloaders.push(function(){
		self.el = document.getElementById(self.properties.el);
		if (self.initialize)
			self.initialize();
	});
}

View.prototype = new Emitter();

View.domloaders = [];

View.domReady = function()
{
	for (var i=0;i<View.domloaders.length;i++)
		View.domloaders[i]();
}

module.exports = View;

},{"./emitter":1}],3:[function(require,module,exports){
Config = {};
Config.version = "0.2.5";
Config.vername = "Happy Pizza";
Config.console = {};
Config.console.init = "J0ZsdXhjb24gJytmbHV4Y29uZmlnLnZlcnNpb24rJyAoJytmbHV4Y29uZmlnLnZlcm5hbWUrJykgcnVubmluZy4n";
module.exports = Config;

},{}],4:[function(require,module,exports){
var Ajax = function()
{
	var ajax = this;
};

Ajax.prototype.get = function(address)
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

module.exports = Ajax;

},{}],5:[function(require,module,exports){
/*
 * TODO: Add TinyURL Support 
 * //http://tinyurl.com/create.php?source=indexpage&url=http://www.google.com&submit=Make+TinyURL!&alias=
 * TODO: Interface with storage
 * 
 * /
 /**
 * History Module
 * For storing console history information / playback
 * **/
var History	= function()
{
	this.content = [];
};

History.key	= 0;

History.prototype.toString = function(title)
{
	console.log(this.content.length)
	if (this.content.length===0)
		return "No history";
		
	result = "<ul>"+(title||"History");
	for (var i=0;i<this.content.length;i++)
	{
		result +=	"<li style='margin-left: 5%;'>"+
						"<span>"+this.content[i].time		+"</span>"+
						"<span>"+this.content[i].command	+"</span>"+
					"</li>";
	}
	result += "</ul>";
	return result;
};

History.prototype.push = function(dataset)
{
	return this.content.push(dataset);
};

History.prototype.get = function(index)
{
	return this.content[index];
};

History.prototype.clear = function()
{
	this.content = [];
};

History.prototype.save = function()
{
	var historyb64 	= btoa("this.history.load('"+btoa(JSON.stringify(this))+"')");
	var url 		= location.toString();
	
	if (!url.endsWith("#"))
		url += "#";
		
	return "<a href='"+url+historyb64+"'>"+historyb64+"</a>"
}

History.prototype.exec = function(parser)
{
	for (var i=0;i<this.content.length-1;i++)
	{
		console.log(i,this[i])
		parser(this.content[i].command)
	}
}

History.prototype.load = function(basestring)
{
	if (!basestring)
		return "No command entered.";
		
	var data = JSON.parse(atob(basestring));
	this.clear();
	for (var attr in data)
		this.content[attr] = data[attr]
	
	this.exec();
	return this.toString("Loaded history");
}

module.exports = History;

},{}],6:[function(require,module,exports){
var Storage = function()
{
	this.session 	= window.sessionStorage;
	this.local		= window.localStorage;
}

module.exports = Storage;

},{}],7:[function(require,module,exports){
Object.dump = require("./util/object").dump;

var Config 		= require("./config");
var Fluxcon 	= require("./module/fluxcon");
var ViewClass	= require("./class/view");

function setup()
{
	ViewClass.domReady();

	var flx = new Fluxcon(Config);

	function printError(e){
		flx.log(e);
	};
	
	window.addEventListener('error',printError);

	function processHash() 
	{
	  const hash = location.hash.slice(1);
	  if (hash)
		{
			try //to load as base64
			{
				flx.parseInput ( atob( hash ) );
			}
			catch (e)
			{
				flx.parseInput(hash)
			}
			
			location.hash = "";
		}
	}

	window.addEventListener('hashchange', processHash);
	processHash();
	flx.focusEditor();
}

window.addEventListener("load",setup);

},{"./class/view":2,"./config":3,"./module/fluxcon":8,"./util/object":9}],8:[function(require,module,exports){
var AjaxController 		= require("../controller/ajax");
var HistoryController 	= require("../controller/history");
var StorageController	= require("../controller/storage");

var ConsoleView			= require("../view/console");
var EditorView			= require("../view/editor");
					
function Fluxcon(config)
{
	this.config		= config;
	this.ajax 		= new AjaxController();
	this.history 	= new HistoryController();
	this.storage	= new StorageController();
	
	window.fluxconfig	= config;
	window.ajax 		= this.ajax;
	window.past		 	= this.history;
	window.storage 		= this.storage;
	window.fluxcon		= this;
	
	self = this;
	EditorView.on("input",function(inputstring)	
						{	
							self.parseInput(inputstring) 
						});
	
	EditorView.on("clearConsole",Fluxcon.clear);
	
	this.parseLog(this.parse("atob('"+fluxconfig.console.init+"')"))
		.el.style.color = "gold";
};

Fluxcon.prototype.clear = function(placeholder)
{
	return ConsoleView.clear(placeholder);
};

Fluxcon.prototype.parse = function(string)
{
	try
	{
			return eval(string);
	}
	catch (anyException)
	{
			return anyException
	}
	
	return null
};
Fluxcon.prototype.parseLog = function(string,nohistory)
{
	var result	= this.parse( string );
	var newelm	= this.log	( result );
	
	if (!nohistory)
		this.history.push({	time:		this.timestamp(),
							command:	string})
		
	return {el:newelm,result:result};
}

Fluxcon.prototype.parseInput = function(string)
{
	this.log( string ).style.color = "blue";
	var result = this.parseLog(string).result;
	return result;
};

Fluxcon.prototype.up = function()
{
	if (this.history.length===0)
		return false
		
	this.history.key 		= this.history.key+1>this.history.length?
													1:this.history.key+1;
	var lastcommand 		= this.history[this.history.key];
	this.input.elm.value 	= lastcommand.command;
};
Fluxcon.prototype.down = function()
{
	if (this.history.length===0)
		return false
		
	this.history.key 		= this.history.key-1<0?0:this.history.key-1;
	var lastcommand 		= this.history[this.history.key];
	this.input.elm.value 	= lastcommand.command;
};

Fluxcon.prototype.timestamp = function()
{
	return function(d){
		return "0"+d.getHours()	.toString().slice(0,1)+":"+
			"0"+d.getMinutes()	.toString().slice(0,1)+":"+
			"0"+d.getSeconds()	.toString().slice(0,1);
	}(new Date());
}

Fluxcon.prototype.focusEditor = function()
{
	EditorView.el.focus();
}

Fluxcon.prototype.log = function out()
{
	var args 		= [].slice.call(arguments);
	var timestamp 	= this.timestamp();
	var el = ConsoleView.log(timestamp,args.length>1?args.join(" "):args[0]);
		el.scrollIntoView();
		
	return el;
};

module.exports = Fluxcon;

},{"../controller/ajax":4,"../controller/history":5,"../controller/storage":6,"../view/console":10,"../view/editor":11}],9:[function(require,module,exports){
function object_dump(prop)
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

module.exports = {
	dump:object_dump
};

},{}],10:[function(require,module,exports){
var View = require("../class/view");

var ConsoleView = new View({
		el:"console",
		initialize:function()
		{
		},
		clear:function(placeholder)
		{
			this.el.innerHTML = "";
			return placeholder || "console cleared.";
		},
		log:function(timestamp,data)
		{
			var newdiv 		= document.createElement("div");
			var dataspan 	= document.createElement("span");
			var timespan 	= document.createElement("span");
			timespan.innerHTML = timestamp;
	
			switch (typeof(data))
			{
				case "object":
					if (data.type==="error") //General error
					{
						dataspan.style.color = "red";
						var prettyfilename = data.filename.slice(data.filename.lastIndexOf("/")+1);
											
						data = data.message + 
							" ["+prettyfilename+":"+data.lineno+":"+data.colno+"]";
					}
					else if(data.stack)
					{
						dataspan.style.color = "red";
						data = data.message;
						break;
					}
				case "function":
					data = data.toString();
					break;
				case "number":
					dataspan.style.color = "darkorange";
					dataspan.style.fontFamily = "Courier New";
				case "string":
					break;
				case "undefined":
					data = "'undefined'";
					dataspan.style.color = "brown";
					break;
				default:
					this.log("Warning: Unhandled type cast to string: "+typeof(data))
					data = data.toString();
					break;
			};

			dataspan.innerHTML = data;
			newdiv.appendChild(timespan);
			newdiv.appendChild(dataspan);
			this.el.appendChild(newdiv);
			return newdiv;
		}
})

module.exports = ConsoleView;

},{"../class/view":2}],11:[function(require,module,exports){
var View = require("../class/view");

var EditorView = new View({
		el:"editor",
		initialize:function()
		{
			this.textbox = document.getElementById("text");
			this.toolbox = {
					tb_run:		document.getElementById("tb_run"),
					tb_load:	document.getElementById("tb_load"),
					tb_save:	document.getElementById("tb_save"),
					tb_panic:	document.getElementById("tb_pan"),
					tb_flux:	document.getElementById("tb_flux")
				};
			
			for (var toolname in this.toolbox)
			{
				this.toolbox[toolname]
				.addEventListener("click",this[toolname]);
			}
			document.addEventListener("keydown",function(key){
				if (key.keyCode===13)	//No empty runs 
				{
					if (EditorView.textbox.value.length===0)
					{
						window.setTimeout(function(){
						EditorView.textbox.value = "";
						},0);
						return
					}
					if (key.shiftKey)
						return
					
					EditorView.emit("input",EditorView.textbox.value);
					EditorView.clearText();
				}
			});	
		},
		clearText:function()
		{
			window.setTimeout(function(){
				EditorView.textbox.value = "";
			},0);
		},
		tb_run:function()
		{
			if (EditorView.textbox.value==="")
				return
				
			EditorView.emit("input",EditorView.textbox.value);
			EditorView.clearText();
		},
		tb_save:function()
		{
			EditorView.emit("input","this.history.save()");
		},
		tb_load:function()
		{
			var source = prompt("Paste your saucecode here.");
			EditorView.emit("clearConsole");
			EditorView.emit("input","this.history.load('"+source+"')");
		},
		tb_panic:function()
		{
			EditorView.emit("input","alert('AAAAAAH!')");
		},
		tb_flux:function()
		{
			EditorView.emit("toggleflux");
		}
})

module.exports = EditorView;

},{"../class/view":2}]},{},[7])