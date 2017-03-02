/*
 * TODO: Add TinyURL Support 
 * //http://tinyurl.com/create.php?source=indexpage&url=http://www.google.com&submit=Make+TinyURL!&alias=
 */
 /**
 * History Module
 * For storing console history information / playback
 * **/
var History	= function()
{
	this.content = [];
};

History.key	= 0;

History.toString = function(title)
{
	console.log(this.content.length)
	if (this.content.length===0)
		return "No history";
		
	result = "<ul>"+(title||"History");
	for (var i=0;i<this.content.length;i++)
	{
		result +=	"<li style='margin-left: 5%;'>"+
						"<span>"+this.content[i].time		+"</span>"+
						"<span>"+this.content[i].command	+"</span>"+
					"</li>";
	}
	result += "</ul>";
	return result;
};

History.push = function(dataset)
{
	return this.content.push(dataset);
};

History.get = function(index)
{
	return this.content[index];
};

History.clear = function()
{
	this.content = [];
};

History.save = function()
{
	var historyb64 	= btoa("History.load('"+btoa(JSON.stringify(this))+"')");
	var url 		= location.toString();
	
	if (!url.endsWith("#"))
		url += "#";
		
	return "<a href='"+url+historyb64+"'>"+historyb64+"</a>"
}

History.exec = function(parser)
{
	for (var i=0;i<this.content.length-1;i++)
	{
		console.log(i,this[i])
		parser(this.content[i].command)
	}
}

History.load = function(basestring)
{
	if (!basestring)
		return "No command entered.";
		
	var data = JSON.parse(atob(basestring));
	this.clear();
	for (var attr in data)
		this.content[attr] = data[attr]
	
	this.exec();
	
	return this.toString("Loaded history");
}

module.exports = History;
