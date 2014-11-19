// TODO: Move this module to $

$.L10n = {
	/**
	 * Actual language, set with setLanguage()
	 */
	_language: '',
	
	/**
	 * Translation strings
	 *
	 * 		_strings: {
	 * 			<language>: {
	 * 				<data-l10n>: <some string for innerHTML>,
	 * 				<data-l10n>: {
	 * 					'html': <some string for innerTML>,
	 * 					<attribute>: <some string for attribute>,
	 * 					...
	 * 				},
	 * 				...
	 * 			},
	 * 			...
	 * 		}
	 */
	_strings: {},
	
	/**
	 * Sniff browser language
	 */
	sniff: function(){
		return navigator.language || navigator.userLanguage; 
	},
	
	/**
	 * Set the actual language
	 */
	setLanguage: function(language) {
		this._language = language;
	},
	
	/**
	 * Translate a single string in the given language or the default one
	 * return null if translation is not found
	 */
	translate: function(string, language) {
		language = language ? language : this._language;
		return  this._strings[language] ? (this._strings[language][string] || null) : null;
	},
	
	/**
	 * Apply translation in the default language
	 */
	translateAll: function() {
		var self = this;
		
		// Get all elements in Dom with 'data-l10n' attribute
		$.Each(document.body.querySelectorAll('[data-l10n]'), function(item){
			// Get the translation in the default language for the identifier given by 'data-l10n' value
			var translation = self.translate(item.getAttribute('data-l10n'));
			if (translation) {
				if (typeof translation == 'string') {
					// Translation for html
					item.innerHTML = translation;
				}
				else {
					$.Each(translation, function(value, key){
						if (key == 'html') {
							// Translation for html
							item.innerHTML = value;
						}
						else {
							// Translation for attribute
							item.setAttribute(key, value);
						}
					});
				}
			}
		});
	}
};

// L10n English
$.L10n._strings.en = {
	'index-item-input': {
		'placeholder': 'Remember the milk'
	},
	'index-drawer-input': {
		'placeholder': 'Write a list name'
	},
	'settings-headertitle': 'Settings',
	'info-headertitle': 'Info',
	'info-version': 'Version',
	'info-authors': 'Authors'
};

// L10n French
$.L10n._strings.fr = {};

// L10n German
$.L10n._strings.de = {
	'index-item-input': {
		'placeholder': 'Erinnern Sie die Milch'
	},
	'index-drawer-input': {
		'placeholder': 'Schreiben Sie den Namen einer Liste'
	},
	'settings-headertitle': 'Einstellungen',
	'info-headertitle': 'Info',
	'info-version': 'Version',
	'info-authors': 'Autoren'
};

// L10n Italian
$.L10n._strings.it = {
	'index-item-input': {
		'placeholder': 'Ricordati il latte'
	},
	'index-drawer-input': {
		'placeholder': 'Scrivi il nome di una lista'
	},
	'settings-headertitle': 'Impostazioni',
	'info-headertitle': 'Info',
	'info-version': 'Versione',
	'info-authors': 'Autori'
};

// L10n Portugese
$.L10n._strings.pt = {};

// L10n Spanish
$.L10n._strings.es = {};
