var emitonoff 	= require("emitonoff");

var Model = function(attributes)
{
	for (var attr in attributes)
		this[attr] = attributes[attr];
	
	emitonoff(this);
}

return Model;
