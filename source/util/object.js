function object_dump(prop)
{
	var seen = [];
	return JSON.stringify(prop,function(key, val) 
			{
			   if (val != null && typeof val == "object") 
			   {
					if (seen.indexOf(val) >= 0) 
					{
						return;
					}
					seen.push(val);
				}
				return val;
			});								
};

module.exports = {
	dump:object_dump
};
