
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 mastro-elfo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

var $ = {};

// TODO: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
// TODO: https://developer.mozilla.org/en-US/docs/WebAPI/Using_geolocation
// TODO: https://developer.mozilla.org/en-US/docs/Web/API/Document.querySelectorAll
/**
 * Module: Ajax
 * Requires: Each
 * Short: Manages Ajax queries
 * Description:
 * Type: object
 */

$['Ajax'] = {
	'post': function(url, data, callbacks){
		return $.Ajax._send(url, 'post', data, callbacks);
	},
	'get': function(url, data, callbacks){
		return $.Ajax._send(url, 'get', data, callbacks);
	},
	'_send': function(url, method, data, callbacks) {
		if (!url){
			url = document.location.pathname;
		}
		
		method = method.toLowerCase();
		
		data = $.Ajax._toQueryString(data);
		
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		}
		else {
			return;
		}
		
		if (data && method == 'get'){
			url += (url.contains('?') ? '&' : '?') + data;
			data = null;
		}
		
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				if ('onSuccess' in callbacks) {
					callbacks.onSuccess(xmlhttp.responseText, xmlhttp.responseXML);
				}
			}
		}
		
		xmlhttp.open(method.toUpperCase(), url, true);
		xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xmlhttp.send(data);
	},
	'_toQueryString': function(data, base) {
		var queryString = [];
		
		$.Each(data, function(value, key){
			if (base) key = base + '[' + key + ']';
			var result;
			switch($.Typeof(value)) {
				case 'object':
					result = $.Ajax._toQueryString(value, key);
					break;
				case 'array':
					var qs = {};
					$.Each(value, function(val, i){
						qs[i] = val;
					});
					result = $.Ajax._toQueryString(qs, key);
					break;
				default:
					result = key + '=' + encodeURIComponent(value);
					break;
			}
			if (value != null) {
				queryString.push(result);
			}
		});
		return queryString.join('&');
	}
};

/**
 * Module: Async
 * Requires: Each, Timeout
 * Short: Manages asyncronous processes
 * Description:
 * Type: object
 */

$.Async = {
	'_ids': {},
	'_loop': function(id){
		var stop = false;
		if ($.Async._ids[id].runtime.run) {
			stop = $.Async._ids[id].callback($.Async._ids[id].data, $.Async._ids[id].runtime, $.Async._ids[id].options) === false;
			$.Async._ids[id].runtime.step++;
			$.Async._ids[id].runtime.elapsed = Date.now() - $.Async._ids[id].runtime.start;
			
		}
		
		if (!stop && $.Async._ids[id].options.recall($.Async._ids[id].data, $.Async._ids[id].runtime, $.Async._ids[id].options)) {
			$.Timeout.set(id, function(){$.Async._loop(id);}, $.Async._ids[id].options.delay);
		}
		else {
			$.Async._ids[id].runtime.run = false;
		}
	},
	'start': function(id, callback, data, options) {
		var _options = {
			'delay': 0,
			'onStop': function(){},
			'recall': function(){return true;}
		};
		$.Each(options, function(value, id){
			_options[id] = value;
		});
		
		if (!$.Async._ids[id]) {
			$.Async._ids[id] = {
				'callback': callback,
				'data': data,
				'options': _options,
				'runtime': {
					'run': true,
					'start': Date.now(),
					'step': 0,
				}
			};
			$.Timeout.set(id, function(){$.Async._loop(id);}, options.delay);
		}
		else if (!$.Async._ids[id].runtime.run) {
			$.Async._ids[id].runtime.run = true;
			$.Timeout.set(id, function(){$.Async._loop(id);}, options.delay);
		}
	},
	'stop': function(id) {
		$.Timeout.clear(id);
		$.Async._ids[id].runtime.run = false;
	},
	'delete': function(id) {
		$.Timeout.clear(id);
		delete($.Async._ids[id]);
	}
};

/**
 * Module: Base64
 * Requires: Utf8
 * Short: Encodes/decodes strings to/from Base64
 * Description:
 * Type: object
 */

$['Base64'] = {
	'_keys': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
	'encode': function(string){
		var output = '';
		var ch1, ch2, ch3, enc1, enc2, enc3, enc4;
		var i = 0;
		
		string = $.Utf8.encode(string);
		
		while (i < string.length) {
			
			ch1 = string.charCodeAt(i++);
			ch2 = string.charCodeAt(i++);
			ch3 = string.charCodeAt(i++);
			
			enc1 = ch1 >> 2;
			enc2 = ((ch1 & 3) << 4) | (ch2 >> 4);
			enc3 = ((ch2 & 15) << 2) | (ch3 >> 6);
			enc4 = ch3 & 63;
			
			if (isNaN(ch2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(ch3)) {
				enc4 = 64;
			}
			
			output = output + $.Base64._keys.charAt(enc1) + $.Base64._keys.charAt(enc2) + $.Base64._keys.charAt(enc3) + $.Base64._keys.charAt(enc4);
			
		}
		
		return output;
	},
	'decode': function(data){
		if (!data) {
			return '';
		}
		
		var output = '';
		var ch1, ch2, ch3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		
		data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		while (i < data.length) {
			enc1 = $.Base64._keys.indexOf(data.charAt(i++));
			enc2 = $.Base64._keys.indexOf(data.charAt(i++));
			enc3 = $.Base64._keys.indexOf(data.charAt(i++));
			enc4 = $.Base64._keys.indexOf(data.charAt(i++));
			
			ch1 = (enc1 << 2) | (enc2 >> 4);
			ch2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			ch3 = ((enc3 & 3) << 6) | enc4;
			
			output = output + String.fromCharCode(ch1);
			
			if (enc3 != 64) {
				output = output + String.fromCharCode(ch2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(ch3);
			}
		}
		output = $.Utf8.decode(output);
		return output;
	}
};

/**
 * Module: Class
 * Requires: Each
 * Short: Create an object extending another
 * Description:
 * Type: function
 */

$['Class'] = function(base, properties, defaults) {
	properties = typeof properties == 'undefined' ? {} : properties;
	defaults = typeof defaults == 'undefined' ? {} : defaults;
	
	var new_class = {};
	
	$.Each(base, function(value, key){
		new_class[key] = value;
	});
	
	$.Each(properties, function(value, key){
		new_class[key] = value;
	});
	
	var _foo = function(prop, key, value){
		if (!prop[key]) {
			prop[key] = value;
		}
		else {
			// prop[key] = {};
			$.Each(value, function(v, k){
				_foo(prop[key], k, v);
			});
		}
	}
	$.Each(defaults, function(v, k){
		_foo(new_class, k, v);
	});
	
	return new_class;
};

/**
 * Module: Dom
 * Requires: Each
 * Short: Manage Dom Nodes
 * Description: 
 * Type: object
 */

$['Dom'] = {
	'id': function(id) {
		return document.getElementById(id);
	},
	'children': function(element, tag, a_class) {
		a_class = typeof(a_class) != 'undefined' ? a_class : false;
		
		if (typeof element == 'string') {
			element = $.Dom.id(element);
		}
		
		var list = element.getElementsByTagName(tag);
		var elements = [];
		$.Each(list, function(item){
			if (!a_class || $.Dom.hasClass(item, a_class)) {
				elements.push(item);
			}
		});
		return elements;
	},
	'parents': function(element, tag, a_class){
		a_class = typeof(a_class) != 'undefined' ? a_class : false;
		tag = tag.toUpperCase();
		var parents = [];
		var parent = element.parentNode;
		while(parent && parent.tagName) {
			if (parent.tagName == tag && (!a_class || $.Dom.hasClass(parent, a_class))) {
				parents.push(parent);
			}
			parent = parent.parentNode;
		}
		return parents;
	},
	'select': function(selector) {
		return document.querySelectorAll(selector);
	},
	'hasClass': function(element, a_class) {
		if (typeof element == 'string') {
			element = $.Dom.id(element);
		}
		return element.className.split(' ').indexOf(a_class) != -1;
	},
	'addClass': function(element, a_class) {
		if (typeof element == 'string') {
			element = $.Dom.id(element);
		}
		if (!$.Dom.hasClass(element, a_class)) {
			element.className += ' '+a_class;
		}
	},
	'removeClass': function(element, a_class) {
		if (typeof element == 'string') {
			element = $.Dom.id(element);
		}
		var classes = element.className.split(' ');
		var idx = 0;
		while((idx = classes.indexOf(a_class)) != -1) {
			classes.splice(idx, 1);
		}
		element.className = '';
		$.Each(classes, function(item){
			element.className += ' '+item;
		});
	},
	'addEvent': function(element, event, fn){
		if (typeof element == 'string') {
			element = $.Dom.id(element);
		}
		element.addEventListener(event, fn);
	},
	'removeEvent': function(element, event, fn){
		if (typeof element == 'string') {
			element = $.Dom.id(element);
		}
		element.removeEventListener(event, fn);
	},
	'fireEvent': function(element, event_name, data) {
		if(typeof element == 'string') {
			element = $.Dom.id(element);
		}
		var event = new CustomEvent(event_name, data);
		element.dispatchEvent(event);
	},
	'element': function(tag, attributes, content, events) {
		typeof attributes == 'undefined' ? attributes = {} : 0;
		typeof content == 'undefined' ? content = '' : 0;
		typeof events == 'undefined' ? events = {} : 0;
		
		var element = document.createElement(tag);
		$.Each(attributes, function(value, key){
			element.setAttribute(key, value);
		});
		$.Each(events, function(value, key){
			$.Dom.addEvent(element, key, value);
		});
		element.innerHTML = content;
		
		return element;
	},
	'inject': function(element, container, where) {
		typeof where == 'undefined'? where = 'append' : 0;
		switch(where) {
			default:
				// Append element into container
				container.appendChild(element);
				break;
			case 'first':
				// Insert element into container in the first position
				if (container.childNodes[0]) {
					container.insertBefore(element, container.childNodes[0]);
				}
				else {
					container.appendChild(element);
				}
				break;
			case 'before':
				// Insert element before container
				container.parentNode.insertBefore(element, container);
				break;
			case 'after':
				// Insert element after container
				if (container.nextSibling) {
					container.parentNode.insertBefore(element, container.nextSibling);
				}
				else {
					container.parentNode.appendChild(element);
				}
				break;
		}
	},
	'destroy': function(element, container) {
		typeof container == 'undefined' ? container = element.parentNode : 0;
		container.removeChild(element);
	},
	'style': function(element, css_property, value){
		if (typeof element == 'string') {
			element = $.Dom.id(element);
		}
		
		var _foo = function(key, value){
			key = key.replace(/(\-)([a-z])/, function(a){return a[1].toUpperCase();});
			element.style[key] = value;
		}
		
		if (typeof css_property == 'object') {
			$.Each(css_property, function(key, value){
				_foo(key, value);
			});
		}
		else {
			_foo(css_property, value);
		}
	}
};

/**
 * Module: Each
 * Requires: Typeof
 * Short: Iterate over objects and apply a given function
 * Description: Correctly iterate objects, arrays, XPathResult and single values
 * Type: function
 */

$['Each'] = function(list, callback) {
	var flags = {
		'first': true,
		'last': false
	};
	
	var type = $.Typeof(list);
	if (type == 'array') {
		for(var i=0; i<list.length; i++) {
			flags = {
				'first': i==0,
				'last': i==list.length -1
			};
			if (callback(list[i], i, flags) === false) {
				break;
			}
		}
	}
	else if (typeof list.iterateNext != 'undefined') {
		var node = list.iterateNext();
		var i=0;
		flags.last = null;
		while(node) {
			if (callback(node, i, flags) === false) {
				break;
			}
			flags.first = false;
			node = list.iterateNext();
		}
	}
	else if (type == 'object') {
		var size = 0;
		for(var i in list) {
			size++;
		}
		
		var count = 0;
		for(var i in list) {
			flags = {
				'first': count==0,
				'last': count==size -1
			};
			if (callback(list[i], i, flags) === false) {
				break;
			}
			count++;
		}
	}
	else {
		callback(list, 0, {
			'first': true,
			'last': true
		});
	}
};
/**
 * Module: Interval
 * Requires:
 * Short: Manage intervals
 * Description: Easy way to manage intervals
 * Type: object
 */

$['Interval'] = {
	'_id': {},
	'set': function(id, fn, delay) {
		$.Interval.clear(id);
		$.Interval._id[id] = setInterval(function(){fn();}, delay);
	},
	'clear': function(id) {
		if ($.Interval._id[id]) {
			clearInterval($.Interval._id[id]);
		}
	},
};
/**
 * Module: Json
 * Requires:
 * Short: Encodes/decodes strings to/from JSON
 * Description:
 * Type: object
 */

$['Json'] = {
	'encode': function(data) {
		return JSON.stringify(data)
	},
	'decode': function(string) {
		try {
			return JSON.parse(string);
		}
		catch(e) {
			return null;
		}
	}
};

/**
 * Module: L10n
 * Requires: Each
 * Short: 
 * Description: 
 * Type: object
 */


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

/**
 * Module: Storage
 * Requires: Each, Json
 * Short: Manages browser local storage
 * Description: Uses browser localStorage object
 * Type: object
 */

// TODO: Suddividere Storage semplice da Storage con namespace
$['Storage'] = {
	'load': function(defaults) {
		if (typeof defaults == 'undefined') {
			return;
		}
		$.Each(defaults, function(value, key){
			if ($.Storage.get(key) === null) {
				$.Storage.set(key, value);
			}
		});
	},
	'set': function(key, value) {
		if (typeof Storage == 'undefined') { // TODO: eliminare
			return;
		}
		if (typeof key == 'object') {
			$.Each(key, function(value, key){
				localStorage[key] = $.Json.encode(value);
			});
		}
		else {
			localStorage[key] = $.Json.encode(value);
		}
	},
	'get': function(key) {
		if (typeof Storage == 'undefined') { // TODO: eliminare
			return null;
		}
		return $.Json.decode(localStorage[key]);
	},
	'setns': function (namespace, key, value) {
		if (typeof Storage == 'undefined') { // TODO: eliminare
			return;
		}
		
		var obj = $.Storage.get(namespace);
		if ($.Typeof(obj) != 'object') {
			obj = {};
		}
		
		if (typeof key == 'object') {
			$.Each(key, function(value, key){
				obj[key] = value;
			});
		}
		else {
			obj[key] = value;
		}
		
		$.Storage.set(namespace, obj);
	},
	'getns': function(namespace, key) {
		if (typeof Storage == 'undefined') { // TODO: eliminare
			return null;
		}
		var out = $.Storage.get(namespace);
		if (!out || typeof out[key] == 'undefined') {
			return null;
		}
		else {
			return out[key];
		}
	}
};

/**
 * Module: Timeout
 * Requires:
 * Short: Manage timeouts
 * Description: Easy way to manage timeouts
 * Type: object
 */

$['Timeout'] = {
	'_id': {},
	'set': function(id, fn, delay) {
		$.Timeout.clear(id);
		$.Timeout._id[id] = setTimeout(function(){fn();}, delay);
	},
	'clear': function(id) {
		if ($.Timeout._id[id]) {
			clearTimeout($.Timeout._id[id]);
		}
	},
};

/**
 * Module: Typeof
 * Requires:
 * Short: Extends javascript typeof function
 * Description:
 * Type: function
 */

$['Typeof'] = function(obj) {
	var type = typeof(obj);
	if (obj == null) {
		return 'undefined';
	}
	else if (type == 'object') {
		return !!obj.length || obj.length == 0 ? 'array' : 'object';
	}
	else {
		return type;
	}
};

/**
 * Module: Utf8
 * Requires:
 * Short: Encodes/decodes strings to/from UTF-8
 * Description:
 * Type: object
 */

$['Utf8'] = {
	'encode': function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = '';
		
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			
		}
		
		return utftext;
	},
	'decode': function (utftext) {
		var string = '';
		var i = 0;
		var c = c1 = c2 = 0;
		
		while ( i < utftext.length ) {
			
			c = utftext.charCodeAt(i);
			
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
			
		}
		
		return string;
	}
};

/**
 * Module: Xpath
 * Requires:
 * Short: Performs an xpath search on an xml document
 * Description: Uses `document.evaluate` to perform an xpath search. The result is an `XPathResult` object.
 * Type: function
 */

$['Xpath'] = function(xpath, xml, context) {
	typeof xml == 'undefined'? xml = document : 0;
	typeof context == 'undefined'? context = xml : 0;
	return xml.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE ,null);
};
