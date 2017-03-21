var fluxmitter = require("./fluxmitter");

function Model(root)
{
    return Object.create(root,Model);
};

module.exports = Model;
