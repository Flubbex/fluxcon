var AjaxTool 	= require("../tool/ajax");
var HistoryTool = require("../tool/history");
var StorageTool	= require("../tool/storage");

var ConsoleView			= require("../view/console");
var EditorView			= require("../view/editor");
					
function FluxController(config)
{
	this.config		= config || {};
	this.ajax 		= new AjaxTool();
	this.history 	= new HistoryTool();
	this.storage	= new StorageTool();
	
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
		})
	
};

FluxController.prototype.timestamp = function()
{
	return function(d){
		return "0"+d.getHours()	.toString().slice(0,1)+":"+
			"0"+d.getMinutes()	.toString().slice(0,1)+":"+
			"0"+d.getSeconds()	.toString().slice(0,1);
	}(new Date());
}

FluxController.prototype.log = function out()
{
	var args 		= [].slice.call(arguments);
	var timestamp 	= this.timestamp();
	
	var el = ConsoleView.log(timestamp,args.length>1
								?args.join(" ")
								:args[0]);
	el.scrollIntoView();
		
	return el;
};

FluxController.prototype.parse = function(string)
{
	var result = null
	
	try 				{	result = eval(string);	}
	catch (anyException){	result = anyException	};
	
	return result;
};

FluxController.prototype.parseLog = function(string,nohistory)
{
	var result	= this.parse( string );
	var newelm	= this.log	( result );
	
	if (!nohistory)
		this.history.push({	time:		this.timestamp(),
							command:	string})
		
	return {el:newelm,result:result};
}

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
		
	this.history.key 		= this.history.key+1>this.history.length?
													1:this.history.key+1;
	var lastcommand 		= this.history[this.history.key];
	this.input.elm.value 	= lastcommand.command;
};
FluxController.prototype.down = function()
{
	if (this.history.length===0)
		return false
		
	this.history.key 		= this.history.key-1<0?0:this.history.key-1;
	var lastcommand 		= this.history[this.history.key];
	this.input.elm.value 	= lastcommand.command;
};

FluxController.prototype.focusEditor = function()
{
	EditorView.el.focus();
}

FluxController.prototype.processHash = function() 
{
	const hash = location.hash.slice(1);
	if (hash)
	{
		//try and load as base64
		try {	fluxconsole.parseInput ( atob( hash ) );}
		catch (e){	fluxconsole.parseInput(hash);		};
		
		//clear hash
		location.hash = "";
	}
}

FluxController.prototype.clear = function(placeholder)
{
	return ConsoleView.clear(placeholder);
};

module.exports = FluxController;
