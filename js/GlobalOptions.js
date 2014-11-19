
/**
  * class GlobalOptions
  * 
  */

GlobalOptions = function (options)
{
	this._init ();
	
	options = options || {};
	this._fontFamily = options['font-family'] || this._fontFamily;
	this._fontSize = options['font-size'] || this._fontSize;
	this._pageStyle = options['page-style'] || this._pageStyle;
}


/**
 * _init sets all Remi attributes to their default value. Make sure to call this
 * method within your class constructor
 */
GlobalOptions.prototype._init = function ()
{
	this._FontFamilies = {
		'sans-serif': 'Sans Serif',
		'serif': 'Serif',
		'monospace': 'Monospace'
	};
	
	this._PageStyles = {
		'default': {
			'name': 'Default'
		},
		'old-paper': {
			'name': 'Old Paper'
		},
		'math-class': {
			'name': 'Math Class'
		},
		'surfing-with-the-alien': {
			'name': 'Surfing with the alien'
		},
		'nature': {
			'name': 'Nature'
		},
		'rainbow': {
			'name': 'Rainbow'
		}
	};
	
	this._fontFamily = 'sans-serif';
	this._fontSize = '';
    this._pageStyle = 'default';
}