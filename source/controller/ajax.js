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
