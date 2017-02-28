function ObjDump(obj)
{
	return function walk(obj)
	{
		var result = "";
		
		for (var attr in obj)
		{
			var prop = obj[attr];
			if (typeof(prop)==="object")
				result[attr] = walk(prop);
			else
				result[attr] = prop
		}
		
		return result;
	}(obj);
}

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
		var prop = args[i]
		var newspan = document.createElement("span");
		newspan.innerHTML = typeof(prop)==='object' ? ObjDump(prop) : prop
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
