// TODO: manage the list of lists names in the drawer (show, update, ecc...)
// TODO: test create/load list
// TODO: trim in list names


/**
  * class Remi
  * 
  */

Remi = function ()
{
	this._init ();
	
	//
	
}


/**
 * _init sets all Remi attributes to their default value. Make sure to call this
 * method within your class constructor
 */
Remi.prototype._init = function ()
{

	/**Aggregations: */

	/**Compositions: */
	
	this._globalOptions = new GlobalOptions($.Storage.get('global-options'));
	
	this._selectedList = $.Storage.getns('runtime-info', 'selected-list');
	
	//TODO: controllare e aggiungere se necessario le static-info
}

/**
 * Load the lists array from local storage
 * returns: lists object as arrays 
 */
Remi.prototype._loadLists = function () {
	// Read localStorage at key 'lists'
	//$.Storage.load('lists', []);
	return $.Storage.get('lists') || [];
}

/**
 * Reload the drawer content with list names
 */
Remi.prototype._reloadDrawer = function () {
	var self=this;
	var lists=this._loadLists();
	$.Dom.id('index-drawer-lists').innerHTML = '';
	$.Each(lists, function(list, i){
		if(!list) {
			return;
		}
		$.Dom.inject($.Dom.element('li', {}, list.name, {
			'click': function (event){
				self.loadList(i);
			}
		}), $.Dom.id('index-drawer-lists'));
	});
}

/**
 * Reload master elements list
 */
Remi.prototype._reloadMasterSettings=function(){
	var lists=this._loadLists();
	$.Dom.id('settings-master-elements').innerHTML = '';
	$.Each(lists, function(list, i){
		var li=$.Dom.element('li', {});
		var list_new_name=$.Dom.element('input', {
			'type':'text',
			'value':list.name,
			'data-index':i,
			'class': 'fit six'
		});
		var label = $.Dom.element('label', {
			'class': 'pack-checkbox danger fit'
		});
		var delete_list=$.Dom.element('input', {
			'type':'checkbox',
			'data-index':i
		});
		var span = $.Dom.element('span');
		$.Dom.inject(list_new_name, li);
		$.Dom.inject(label, li)
		$.Dom.inject(delete_list, label);
		$.Dom.inject(span, label);
		$.Dom.inject(li, $.Dom.id('settings-master-elements'));
		
	});
}

/* Use Cases */


/**
 * Create a new empty list with default options and stores it in localStorage
 * param new_list_name: new list name
 * return: null
 */
Remi.prototype.createList = function (new_list_name) {
	var lists=this._loadLists();
	//alert('start create list '+lists+' lists.lenght= '+lists.length);
	var found=null; // After the following Each is non-null if a list with the given name exists; null otherwise
	
	//alert(lists.length)
	if (lists && lists.length) { // TODO: eliminare questo if, lists non dovrebbe mai essere null
		$.Each(lists, function(list, i){
			if (!list) {
				return true;
			}
			if(list.name==new_list_name){ //TODO: uppercase/lowercase-trim-multiple blanks
				found=i;
				return false;
			}
			else{
				// Continue to the following step...
				return true;
			}
		});
		//alert('found='+found)
	}
	else {
		lists = [];
	}
	
	if (found !== null) {
		if (confirm('wanna selfdestruct?')) {//TODO: change confirm text
			// Sets to null the items of the list
			$.Storage.set('list-'+lists[found].identifier, []);
		}
	}
	else{
		// Load the unique identifier from localStorage
		var uid=$.Storage.getns('static-info', 'unique-id');
		$.Storage.setns('static-info', 'unique-id', uid+1);
		
		// Add a new list in localStorage, including the empty item list
		lists.push({
			'name': new_list_name,
			'position': lists.length,
			'identifier': uid, // Database-like primary key
			'options': {
				'move-to-bottom': true,
				'alphabetical-order': false
			}
		});
		//alert(lists);
		$.Storage.set('lists', lists);
		$.Storage.set('list-'+ uid, []);
		
	}
	//alert('here found:'+(found)+' length:'+(lists.length)+' l-1:'+(lists.length-1));
	this.showList(found || lists.length -1);
}

/**
 * Shows the selected list
 * param index: list index as stored in localStorage
 * return: null
 */
Remi.prototype.showList = function (index){
	/*emergency cleanup code*/
	//localStorage['lists'] = null;
	//return;
	//$.Storage.set('lists', []);
	//return;
	
	// Clear dom
	$.Dom.id('index-listname').innerHTML = '';
	$.Dom.id('index-itemslist-notchecked').innerHTML = '';
	$.Dom.id('index-itemslist-checked').innerHTML = '';
	
	// Load the list and its option
	var lists = this._loadLists();
	var list = lists[index];
	
	if (lists.length && list) {
		var items = $.Storage.get('list-'+list.identifier);
		
		if (list.options['move-to-bottom']) {
			// Add items to dom with move-to-bottom option
			$.Each(items, function(item){
			//TODO: aggiungere bottone spunta
			//TODO: aggiungere evento click
				if (item.checked) {
					$.Dom.inject($.Dom.element('li', {}, item.name), $.Dom.id('index-itemslist-checked'));
				}
				else{
					$.Dom.inject($.Dom.element('li', {}, item.name), $.Dom.id('index-itemslist-notchecked'));
				}
			});
		}
		else{
			// Add items to dom as in localStorage order
			$.Each(items, function(item){
				if (item.checked) {
					$.Dom.inject($.Dom.element('li', {'class':'checked'}, item.name), $.Dom.id('index-itemslist-notchecked'));
				}
				else{
					$.Dom.inject($.Dom.element('li', {}, item.name), $.Dom.id('index-itemslist-notchecked'));
				}
			});
		}
		// Print list name
		$.Dom.id('index-listname').innerHTML = list.name;
		// Close drawer
		location.href = '#';
	}
	
	// Update lists position
	this.updateListsPositions(index);
}

/**
 * Update lists positions, last accessed first
 * param index: index of the last accessed list
 * return: null
 */
Remi.prototype.updateListsPositions = function(index){
	// Load lists from localStorage
	var orderedList = [];
	var lists = this._loadLists();
	
	if (lists && lists.length) {
		// Put last shown list in first place
		orderedList[0] = lists[index];
		
		// Put all others lists in same order
		$.Each(lists, function(list, key){
			if (!list) {
				return;
			}
			if(index != key) {
				orderedList.push(list);
			}
		});
		
		// Save lists on localStorage
		$.Storage.set('lists', orderedList);
	}
	
	this._reloadDrawer();
}

/**
 * Load items from a list
 * param index: list to be shown
 * return: null
 */
Remi.prototype.loadList = function(index){
	this.showList(index);
}

/**
 * Edit lists names, new names are taken from Input
 * return: this
 */
Remi.prototype.editListNames=function(){
	var lists=this._loadLists();
	
	$.Each(lists, function(item, key){
		item.name=$.Dom.select('#settings-master-elements input[data-index="'+key+'"]')[0].value;
	});
	
	$.Storage.set('lists', lists);
	
	return this;
}

/**
 * Delete marked lists
 * return: this
 */
Remi.prototype.deleteLists=function(){
	
	var lists=this._loadLists();
	var newlist=[];
	
	$.Each(lists, function(item, key){
		if ($.Dom.select('#settings-master-elements input[type="checkbox"][data-index="'+key+'"]')[0].checked) {
			$.Storage.set('list-'+item.identifier, []);
		}
		else{
			newlist.push(item);
		}
	});
	
	$.Storage.set('lists', newlist);
	
	return this;
}