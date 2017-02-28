function module(domid)
{
	this.elm = document.getElementById(domid);
}

module.prototype.write = function()
{
	var args = [].slice.call(arguments);
	var newelm = document.createElement("div");
	for (var i in args)
	{
		var newspan = document.createElement("span");
		newspan.innerHTML = args[i];
		newelm.appendChild(newspan);
	}
	this.elm.appendChild(newelm);
	return newelm;
};
module.prototype.read = function()
{
	return this.elm.innerHTML;
}
module.prototype.on	=	function(event,callback)
{
	return this.elm.addEventListener(event,callback);
}
var jsconsole = function(jsconsole,input)
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
	
	input.on("click",out);
		
}(new module("console"),new module("input"));
