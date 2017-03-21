Object.dump = require("./util/object").dump;

/*IDEA: Hotkey controller [view -> controller/hotkey]
 **/

var Config          = require("./config");
var FluxController  = require("./controller/flux");
var fluxview        = require("./class/fluxview");

var Fluxcon = (function()
{
    function ready(window)
    {
        fluxview.ready(window);

        if (!window.fluxconsole)
            window.fluxconsole = new FluxController(Config);

        window.addEventListener('error',
                                window.fluxconsole.log);

        window.addEventListener('hashchange',
                                window.fluxconsole.processHash);

        window.fluxconsole.processHash();
        window.fluxconsole.focusEditor();

        return window.fluxconsole;
    };

    return function(window)
    {
        if (window && window.addEventListener)
            window.addEventListener("load",function(){
                ready(window);
            });
        else
        {
            throw new Error("Invalid window object. Running from Node?");
            return false; //Never happens?
        }
        return true;
    }

}());

if (typeof(window)==='object' && Fluxcon(window))
    console.log("Fluxcon loaded succesfully");
