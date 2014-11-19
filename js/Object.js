
/**
  * class Object
  * 
  */

Object = function (name, position, checked)
{
	this._init ();
	
	this._name = name;
	this._position = position;
	this._checked = checked || this._checked;
}


/**
 * _init
 */
Object.prototype._init = function () {
	this._checked = false;
}