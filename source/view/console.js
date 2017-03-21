var View = require("../class/fluxview");

var ConsoleView = new View({
        el:"console",
        initialize:function()
        {
        },
        clear:function(placeholder)
        {
            this.el.innerHTML = "";
            return placeholder || "console cleared.";
        },
        log_error:function(timestamp,data)
        {
            var out = this.log(timestamp,data);
                out.className += "log_error";
            return out;
        },
        log:function(timestamp,data)
        {
            var newdiv      = document.createElement("div");
            var dataspan    = document.createElement("div");
            var timespan    = document.createElement("div");

            newdiv.className    = "row";
            dataspan.className  = "ten columns";
            timespan.className  = "two columns";

            timespan.innerHTML  = timestamp;
            dataspan.innerHTML  = data.toString();

            dataspan.className += " log_"+typeof(data);

            newdiv.appendChild(timespan);
            newdiv.appendChild(dataspan);
            this.el.appendChild(newdiv);

            return newdiv;
        }
})

module.exports = ConsoleView;
