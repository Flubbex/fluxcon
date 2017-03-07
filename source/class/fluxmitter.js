// Extend an objects prototype with fluxmitter
// Returns an empty object with fluxmitter as prototype if root===null
var fluxmitter = function(root)
{
	if (!root)	//no root was given
		root = Object.create(fluxmitter)
	else if (!root.prototype)	//root was given but lacks a prototype
		root.prototype = Object.create(fluxmitter)
	else 	//root given but has a prototype
		for (var methodname in fluxmitter)
			if (!root.prototype[methodname])
				root.prototype[methodname] = fluxmitter[methodname];
		
	//don't clobber existing event tables		
	if (!root.events)
		root.events = {}
	
	return root;
}

//Emit an event to the fluxmitter 
// Arguments 
//		event (string, name of event chain to trigger)
//		[...] (objects as parameters for the event) 
fluxmitter.emit = function() //event,data,args[0],...
{
	var args 		= [].slice.call(arguments);
	var event		= args.shift();
	
	if (!this.events[event])
		throw new Error("fluxmitter: No such event "+event)
	
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
//	event		(string, name of event chain to add callback to)
//	callback	(function, method to add to event chain)
//	parent		(object, will be passed as 'this' to callback)
//	[...]		(objects as primary arguments	
fluxmitter.on = function() //event,callback,asThis,arg[0],...
{
	//convert arguments to array
	var args 		= [].slice.call(arguments);
	var event		= args.shift();	
	var callback	= args.shift(); 
	var parent		= args.shift();
	
	var neweventinfo = {callback:callback,
						parent:parent,
						args:args};
	
	if (!this.events[event])
		this.events[event] = [];
	
	return this.events[event].push(neweventinfo);
};

//Removes callback from event chain
fluxmitter.off = function()
{
	var args 		= [].slice.call(arguments);
	var event		= args.shift();	
	var callback	= args.shift(); 
	
	this.events[event].filter(function(e){
			return !e.callback===callback;
	})
};


module.exports = fluxmitter;

