(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Extend an objects prototype with fluxmitter
// Returns an empty object with fluxmitter as prototype if root===null
var fluxmitter = function(root)
{
    root = root ?
            Object.create(fluxmitter,root)
            : Object.create(fluxmitter,{});

    //don't clobber existing event tables
    if (!root.events)
        root.events = {}

    return root;
}

//Emit an event to the fluxmitter
// Arguments
//      event (string, name of event chain to trigger)
//      [...] (objects as parameters for the event)
fluxmitter.emit = function() //event,data,args[0],...
{
    var args        = [].slice.call(arguments);
    var event       = args.shift();

    if (!this.events[event])
        if (fluxmitter.strict)
            throw new Error("fluxmitter violation: No such event "+event);
        else
            return null

    var events = this.events[event];

    return events.map(function(eventinfo)
    {
        var argsextended = eventinfo.args.concat(args);
        return {eventinfo:eventinfo,
                result:eventinfo.callback.apply(eventinfo.parent,argsextended)
            };
    });

}

// Add function to event chain
// Arguments
//  event       (string, name of event chain to add callback to)
//  callback    (function, method to add to event chain)
//  parent      (object, will be passed as 'this' to callback)
//  [...]       (objects as primary arguments
fluxmitter.on = function() //event,callback,asThis,arg[0],...
{
    //convert arguments to array
    var args        = [].slice.call(arguments);
    var event       = args.shift();
    var callback    = args.shift();
    var parent      = args.shift();

    //Return null if missing arguments
    if (!callback || !event)
      return null;

    var neweventinfo = {callback:   callback,
                        parent:     parent,
                        args:       args};

    if (!this.events[event])
        this.events[event] = [];

    return this.events[event].push(neweventinfo);
};

//Removes callback from event chain
fluxmitter.off = function()
{
    var args        = [].slice.call(arguments);
    var event       = args.shift();
    var callback    = args.shift();

    //Return null if missing arguments
    if (!callback || !event)
      return null;

    this.events[event] = this.events[event].filter(function(e){
            return !e.callback===callback;
    });

    return this.events[event];
};

//Throws during an emit if no callbacks are found.
//if strict === false then stay quiet.
fluxmitter.strict = false;

module.exports = fluxmitter;


},{}],2:[function(require,module,exports){
var Fluxmitter = require("./fluxmitter");

function Fluxview(attributes)
{
    var view = Object.create(Fluxmitter());

    view.hook = function()
    {
        var arguments   = [].slice.call(arguments);
        var domelement  = arguments.shift();
        var event       = arguments.shift();
        var callback    = arguments.shift();
        var parent      = arguments.shift();

        var self        = this;
        if (!domelement)
            throw new Error("Fluxview: No DOM element specified (DOM ready?)");
        if (!event)
            throw new Error("Fluxview: Invalid argument to view.hook (event)");
        if (!callback)
            throw new Error("Fluxview: Invalid argument to view.hook (callback)");

        domelement.addEventListener(event,function(){
            callback.apply(parent||self||this,arguments);
        });
    };

    view.properties = {};

    for (var attr in attributes)
    {
        switch(typeof(attributes[attr]))
        {
            case "function":
                view[attr] = attributes[attr];
                view.on("call_"+attr,view[attr],view);
                break
            default:
                view.properties[attr] = attributes[attr];
                break;
        };
    };

    //Runs when DOM is ready
    Fluxview.domloaders.push(function(window)
    {
        view.el = window
                    .document
                    .getElementById(view.properties.el);

        if (view.el === null)
            throw new Error("Fluxview: No element with id '"
                +view.properties.el
                +"' found");

        //Run initialize as method or emit as an event
        if (view.initialize)
            switch (typeof(view.initialize))
            {
                case "function":
                    view.initialize.apply(view,arguments);
                    break;
                case "string":
                    view.emit(view.initialize,arguments)
                    break;
                default:
                    break;
            }
    });

    return view;
}

Fluxview.domloaders = [];

Fluxview.ready = function(window)
{
    Fluxview.domloaders.map(function(loader)
    {
        loader(window);
    });

}

module.exports = Fluxview;

},{"./fluxmitter":1}],3:[function(require,module,exports){
//IDEA: Loaded controllers in config

Config = {};
Config.version = "0.2.7";
Config.vername = "Rainbow Lipstick";
Config.console = {};
Config.console.init = "J0ZsdXhjb24gJytmbHV4Y29uc29sZS5jb25maWcudmVyc2lvbisnICgnK2ZsdXhjb25zb2xlLmNvbmZpZy52ZXJuYW1lKycpIHJ1bm5pbmcuJw==";
module.exports = Config;

},{}],4:[function(require,module,exports){
var AjaxTool    = require("../tool/ajax");
var HistoryTool = require("../tool/history");
var StorageTool = require("../tool/storage");

var ConsoleView         = require("../view/console");
var EditorView          = require("../view/editor");

function FluxController(config)
{
    this.config     = config || {};
    this.ajax       = new AjaxTool();
    this.history    = new HistoryTool();
    this.storage    = new StorageTool();

    if (window)
        window.fluxconsole = this;

    EditorView.on("input",this.parseInput,this);
    EditorView.on("clear",this.clear,this);


    //Load initial 'payload' (prints a pretty message about the console running)
    //TODO: Check if init payload exists in storage, load that instead
    var payload = this.parse("atob('"+config.console.init+"')");

    var newdiv = this.parseLog(payload,true);

    //Make it prettier (all bubbles to green to indicate success)
    Array.prototype.slice.call(newdiv.el.children)
        .map(function(child)
        {
            child.style.backgroundColor = 'rgba(128,200,64,128)';
        });

}

FluxController.prototype.timestamp = function()
{
    return function(d){
        return "0"+d.getHours() .toString().slice(0,1)+":"+
            "0"+d.getMinutes()  .toString().slice(0,1)+":"+
            "0"+d.getSeconds()  .toString().slice(0,1);
    }(new Date());
};

FluxController.prototype.log = function out()
{
    var args        = [].slice.call(arguments);
    var timestamp   = this.timestamp();

    var el = ConsoleView.log(timestamp,args.length>1
                                ?args.join(" ")
                                :args[0]);
    el.scrollIntoView();

    return el;
};

FluxController.prototype.parse = function(string)
{
    var result = null

    try                 {   result = eval(string);  }
    catch (anyException){   result = anyException   };

    return result;
};

FluxController.prototype.parseLog = function(string,nohistory)
{
    var result  = this.parse( string );
    var newelm  = this.log  ( result );

    if (!nohistory)
        this.history.push({ time:       this.timestamp(),
                            command:    string})

    return {el:newelm,result:result};
};

FluxController.prototype.parseInput = function(string)
{
    this.log( string ).style.color = "blue";
    var result = this.parseLog(string).result;
    return result;
};

FluxController.prototype.up = function()
{
    if (this.history.length===0)
        return false

    this.history.key        = this.history.key+1>this.history.length?
                                                    1:this.history.key+1;
    var lastcommand         = this.history[this.history.key];
    this.input.elm.value    = lastcommand.command;
};

FluxController.prototype.down = function()
{
    if (this.history.length===0)
        return false

    this.history.key        = this.history.key-1<0?0:this.history.key-1;
    var lastcommand         = this.history[this.history.key];
    this.input.elm.value    = lastcommand.command;
};

FluxController.prototype.focusEditor = function()
{
    EditorView.el.focus();
};

FluxController.prototype.processHash = function()
{
    var hash = location.hash.slice(1);
    if (hash)
    {
        //try and load as base64
        try {   fluxconsole.parseInput ( atob( hash ) ); }
        catch (e){  fluxconsole.parseInput(hash);       };

        //clear hash
        location.hash = "";
    };
}

FluxController.prototype.clear = function(placeholder)
{
    return ConsoleView.clear(placeholder);
};

module.exports = FluxController;

},{"../tool/ajax":6,"../tool/history":7,"../tool/storage":8,"../view/console":10,"../view/editor":11}],5:[function(require,module,exports){
Object.dump = require("./util/object").dump;

/*IDEA: Hotkey controller [view -> controller/hotkey]
 **/

var Config          = require("./config");
var FluxController  = require("./controller/flux");
var fluxview        = require("./class/fluxview");

var Fluxcon = (function()
{
    function ready(window)
    {
        fluxview.ready(window);

        if (!window.fluxconsole)
            window.fluxconsole = new FluxController(Config);

        window.addEventListener('error',
                                window.fluxconsole.log);

        window.addEventListener('hashchange',
                                window.fluxconsole.processHash);

        window.fluxconsole.processHash();
        window.fluxconsole.focusEditor();

        return window.fluxconsole;
    };

    return function(window)
    {
        if (window && window.addEventListener)
            window.addEventListener("load",function(){
                ready(window);
            });
        else
        {
            throw new Error("Invalid window object. Running from Node?");
            return false; //Never happens?
        }
        return true;
    }

}());

if (typeof(window)==='object' && Fluxcon(window))
    console.log("Fluxcon loaded succesfully");

},{"./class/fluxview":2,"./config":3,"./controller/flux":4,"./util/object":9}],6:[function(require,module,exports){
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
    };
};

module.exports = Ajax;

},{}],7:[function(require,module,exports){
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
var History = function()
{
    this.content = [];
};

History.key = 0;

History.prototype.toString = function(title)
{
    console.log(this.content.length);

    if (this.content.length===0)
        return "No history";

    result = "<span class='title'>"+(title||"History")+"</span><ul>";
    for (var i=0;i<this.content.length;i++)
    {
        result +=   "<li>"+
                        "<span>"+this.content[i].time       +"</span>"+
                        "<div>"+this.content[i].command +"</div>"+
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
    var historyb64  = btoa("this.history.load('"+btoa(JSON.stringify(this))+"')");
    var url         = location.toString();

    if (!url.endsWith("#"))
        url += "#";

    return "<a href='"+url+historyb64+"'>"+historyb64+"</a>";
}

History.prototype.exec = function(parser)
{
    for (var i=0;i<this.content.length-1;i++)
    {
        console.log(i,this[i]);

        parser(this.content[i].command);
    }
}

History.prototype.load = function(basestring)
{
    if (!basestring)
        return "No command entered.";

    var data = JSON.parse(atob(basestring));
    this.clear();
    for (var attr in data)
        this.content[attr] = data[attr];

    this.exec();
    return this.toString("Loaded history");
}

module.exports = History;

},{}],8:[function(require,module,exports){
var Storage = function()
{
    this.session    = window.sessionStorage;
    this.local      = window.localStorage;
};

module.exports = Storage;

},{}],9:[function(require,module,exports){
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
var View = require("../class/fluxview");

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
        log_error:function(timestamp,data)
        {
            var out = this.log(timestamp,data);
                out.className += "log_error";
            return out;
        },
        log:function(timestamp,data)
        {
            var newdiv      = document.createElement("div");
            var dataspan    = document.createElement("div");
            var timespan    = document.createElement("div");

            newdiv.className    = "row";
            dataspan.className  = "ten columns";
            timespan.className  = "two columns";

            timespan.innerHTML  = timestamp;
            dataspan.innerHTML  = data.toString();

            dataspan.className += " log_"+typeof(data);

            newdiv.appendChild(timespan);
            newdiv.appendChild(dataspan);
            this.el.appendChild(newdiv);

            return newdiv;
        }
})

module.exports = ConsoleView;

},{"../class/fluxview":2}],11:[function(require,module,exports){
var View = require("../class/fluxview");

var EditorView = new View({
        el:"editor",
        initialize:function()
        {
            this.textbox = document.getElementById("text");
            this.toolbox = {
                    tb_run:     document.getElementById("tb_run"),
                    tb_load:    document.getElementById("tb_load"),
                    tb_save:    document.getElementById("tb_save"),
                    tb_panic:   document.getElementById("tb_pan"),
                    tb_flux:    document.getElementById("tb_flux")
                };

            for (var toolname in this.toolbox)
            {
                this.toolbox[toolname]
                .addEventListener("click",this[toolname]);
            }
            document.addEventListener("keydown",function(key){
                if (key.keyCode===13)   //No empty runs
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
            EditorView.emit("clear");
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

},{"../class/fluxview":2}]},{},[5])