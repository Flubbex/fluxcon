function module(domid)
{
	this.elm = document.getElementById(domid);
}

module.prototype.write = function()
{
	var argstring = [].slice.call(arguments).toString();
	this.elm.innerHTML += argstring;
};
module.prototype.read = function()
{
	return this.elm.innerHTML;
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
							args);
	}
	
	out("JSConsole running");
		
}(new module("console"),new module("input"));
