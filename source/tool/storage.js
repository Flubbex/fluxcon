var Storage = function()
{
	this.session 	= window.sessionStorage;
	this.local		= window.localStorage;
}

module.exports = Storage;
