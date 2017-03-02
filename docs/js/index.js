(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EmitOnOff = module.exports = function(thing){
  if (!thing) thing = {};

  thing._subs = [];
  thing._paused = false;
  thing._pending = [];

  /**
   * Sub of pubsub
   * @param  {String}   name name of event
   * @param  {Function} cb   your callback
   */
  thing.on = function(name, cb){
    thing._subs[name] = thing._subs[name] || [];
    thing._subs[name].push(cb);
  };

  /**
   * remove sub of pubsub
   * @param  {String}   name name of event
   * @param  {Function} cb   your callback
   */
  thing.off = function(name, cb){
    if (!thing._subs[name]) return;
    for (var i in thing._subs[name]){
      if (thing._subs[name][i] === cb){
        thing._subs[name].splice(i);
        break;
      }
    }
  };

  /**
   * Pub of pubsub
   * @param  {String}   name name of event
   * @param  {Mixed}    data the data to publish
   */
  thing.emit = function(name){
    if (!thing._subs[name]) return;

    var args = Array.prototype.slice.call(arguments, 1);

    if (thing._paused) {
      thing._pending[name] = thing._pending[name] || [];
      thing._pending[name].push(args)
      return
    }

    for (var i in thing._subs[name]){
      thing._subs[name][i].apply(thing, args);
    }
  };

  thing.pause = function() {
    thing._paused = true;
  };

  thing.resume = function() {
    thing._paused = false;

    for (var name in thing._pending) {
      for (var i = 0; i < thing._pending[name].length; i++) {
        thing.emit(name, thing._pending[name][i])
      }
    }
  };

  return thing;
};
},{}],2:[function(require,module,exports){
var emitonoff 	= require("emitonoff");

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
	emitonoff(this);
}

View.domloaders = [];
View.domReady = function()
{
	for (var i=0;i<View.domloaders.length;i++)
		View.domloaders[i]();
}
module.exports = View;

},{"emitonoff":1}],3:[function(require,module,exports){
Config = {};
Config.version = '0.1.9f';


module.exports = Config;

},{}],4:[function(require,module,exports){
var Ajax = function()
{
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
 */
 /**
 * History Module
 * For storing console history information / playback
 * **/
var History	= function()
{
	this.content = [];
};

History.key	= 0;

History.toString = function(title)
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

History.push = function(dataset)
{
	return this.content.push(dataset);
};

History.get = function(index)
{
	return this.content[index];
};

History.clear = function()
{
	this.content = [];
};

History.save = function()
{
	var historyb64 	= btoa("History.load('"+btoa(JSON.stringify(this))+"')");
	var url 		= location.toString();
	
	if (!url.endsWith("#"))
		url += "#";
		
	return "<a href='"+url+historyb64+"'>"+historyb64+"</a>"
}

History.exec = function(parser)
{
	for (var i=0;i<this.content.length-1;i++)
	{
		console.log(i,this[i])
		parser(this.content[i].command)
	}
}

History.load = function(basestring)
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
Object.dump = require("./util/object").dump;

var Config 		= require("./config");
var Fluxcon 	= require("./module/fluxcon");
var ViewClass	=	require("./class/view");

window.addEventListener("load",
	function(){
		ViewClass.domReady();
		var flx = new Fluxcon();
		function printError(e){
			flx.log(e);
		};
		
		window.addEventListener('error',printError);

		function processHash() {
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
		flx.log("Fluxcon (",Config.version,") running");
		flx.focusEditor();
	}
);

},{"./class/view":2,"./config":3,"./module/fluxcon":7,"./util/object":8}],7:[function(require,module,exports){
var AjaxController 		= require("../controller/ajax");
var HistoryController 	= require("../controller/history");

var ConsoleView			= require("../view/console");
var InputView			= require("../view/input");
					
function Fluxcon()
{
	this.ajax 		= new AjaxController();
	this.history 	= new HistoryController();
	
	self = this;
	InputView.on("input",function(inputstring)	
						{	self.parseInput(inputstring) });
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
	
	InputView.clear();
	
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
		return "0"+d.getHours()	.toString().slice(0,2)+":"+
			"0"+d.getMinutes()	.toString().slice(0,2)+":"+
			"0"+d.getSeconds()	.toString().slice(0,2);
	}(new Date());
}

Fluxcon.prototype.focusEditor = function()
{
	InputView.el.focus();
}

Fluxcon.prototype.log = function out()
{
	var args = [].slice.call(arguments);
		args.unshift(this.timestamp());
	
	var el = ConsoleView.log.apply(ConsoleView,args);
		el.scrollIntoView();
		
	return el;
};

module.exports = Fluxcon;

},{"../controller/ajax":4,"../controller/history":5,"../view/console":9,"../view/input":10}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
var View = require("../class/view");

var ConsoleView = new View({
		el:"console",
		initialize:function()
		{
		},
		log:function()
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
			this.el.appendChild(newelm);
			return newelm;
		}
})

module.exports = ConsoleView;

},{"../class/view":2}],10:[function(require,module,exports){
var View = require("../class/view");

var InputView = new View({
		el:"text",
		initialize:function()
		{
			var self = this;
			this.el.addEventListener("keydown",function(e){
				if (e.keyCode===13)
				{
					self.emit("input",self.el.value);
				}
			});	
		},
		clear:function()
		{
			this.el.value = "";
		}
})

module.exports = InputView;

},{"../class/view":2}]},{},[6])