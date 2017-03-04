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
