function module(domid)
{
	this.elm = document.getElementById(domid);
	if (this.elm === null)
		throw new Error("Hey numbnuts, that element doesn't exist. (#"+domid+")");
	
}

module.prototype.write = function()
{
	var args = [].slice.call(arguments);
	var newelm = document.createElement("div");
	for (var i in args)
	{
		var prop = args[i]
		var newspan = document.createElement("span");
		newspan.innerHTML = typeof(prop)==='object' ? JSON.stringify(prop) : prop
		newelm.appendChild(newspan);
	}
	this.elm.appendChild(newelm);
	return newelm;
};
module.prototype.read = function(attr)
{
	return this.elm[attr];
}
module.prototype.on	=	function(event,callback)
{
	return this.elm.addEventListener(event,callback);
}



var MIJNCODE = function(jsconsole,input,submit)
{
	function out()
	{
		var args = [].slice.call(arguments);
		
		var timestamp = function(d){
			return d.getHours()+":"+
				   d.getMinutes()+":"+
				   d.getSeconds();
		}(new Date());
		
		args.unshift(timestamp);
		jsconsole.write.apply(jsconsole,
							args).scrollIntoView();
	}
	
	out("JSConsole running");
	
	submit.on("click",function()
	{
		out(input.read("value"));
	});
		
}(new module("console"),new module("text"),new module("submit"));
