
/**
  * class ListOptions
  * 
  */

ListOptions = function (options)
{
	this._init ();
	
	options = options || {};
	this._moveToBottom = options['move-to-bottom'] || this._moveToBottom;
	this._alphabeticalOrder = options['alphabetica-order'] || this._alphabeticalOrder;
}


/**
 * _init
 */
ListOptions.prototype._init = function () {
	this._moveToBottom = false;
	this._alphabeticalOrder = false;
}