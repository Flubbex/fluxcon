/*
 * TODO: Add TinyURL Support
 * //http://tinyurl.com/create.php?source=indexpage&url=http://www.google.com&submit=Make+TinyURL!&alias=
 * TODO: Interface with storage
 *
 * /
 /**
 * History Module
 * For storing console history information / playback
 * **/
var History = function()
{
    this.content = [];
};

History.key = 0;

History.prototype.toString = function(title)
{
    console.log(this.content.length);

    if (this.content.length===0)
        return "No history";

    result = "<span class='title'>"+(title||"History")+"</span><ul>";
    for (var i=0;i<this.content.length;i++)
    {
        result +=   "<li>"+
                        "<span>"+this.content[i].time       +"</span>"+
                        "<div>"+this.content[i].command +"</div>"+
                    "</li>";
    }
    result += "</ul>";
    return result;
};

History.prototype.push = function(dataset)
{
    return this.content.push(dataset);
};

History.prototype.get = function(index)
{
    return this.content[index];
};

History.prototype.clear = function()
{
    this.content = [];
};

History.prototype.save = function()
{
    var historyb64  = btoa("this.history.load('"+btoa(JSON.stringify(this))+"')");
    var url         = location.toString();

    if (!url.endsWith("#"))
        url += "#";

    return "<a href='"+url+historyb64+"'>"+historyb64+"</a>";
}

History.prototype.exec = function(parser)
{
    for (var i=0;i<this.content.length-1;i++)
    {
        console.log(i,this[i]);

        parser(this.content[i].command);
    }
}

History.prototype.load = function(basestring)
{
    if (!basestring)
        return "No command entered.";

    var data = JSON.parse(atob(basestring));
    this.clear();
    for (var attr in data)
        this.content[attr] = data[attr];

    this.exec();
    return this.toString("Loaded history");
}

module.exports = History;
