
/**
  * class ObjectList
  * 
  */

ObjectList = function (name, position, identifier, options)
{
	this._init ();
	
	this._name = name;
	this._position = position;
	this._identifier = identifier;
	this._listOptions = new ListOptions(options);
}


/**
 * _init
 */
ObjectList.prototype._init = function () {
	
	this._objects = [];
}
