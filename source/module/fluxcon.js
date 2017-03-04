var AjaxController 		= require("../controller/ajax");
var HistoryController 	= require("../controller/history");

var ConsoleView			= require("../view/console");
var EditorView			= require("../view/editor");
					
function Fluxcon()
{
	this.ajax 		= new AjaxController();
	this.history 	= new HistoryController();
	
	self = this;
	EditorView.on("input",function(inputstring)	
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
	
	EditorView.clear();
	
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
