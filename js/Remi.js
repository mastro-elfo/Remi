// TODO: trim in list names
// TODO: Backup import/export
// TODO: stile icone mtb e abo
// TODO: todoitems / total items ...

/**
  * class Remi
  * 
  */

Remi = function ()
{
	this._init ();
	
	// Apply global options
	this.editGlobalOptions(this._globalOptions._fontFamily, this._globalOptions._fontSize, this._globalOptions._pageStyle);
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
 * Load the items array
 * param index: index of the list within localStorage
 * return: array of items
 */
Remi.prototype._loadItems = function(index){
	var lists = this._loadLists();
	var list = lists[index] || [];
	return $.Storage.get('list-' +list.identifier);
}

/**
 * Stores items in localStorage
 * param index: intex of the list to update
 * param items: new list items
 * return: null
 */
Remi.prototype._storeItems = function(index, items) {
	var lists = this._loadLists();
	var list = lists[index];
	$.Storage.set('list-' +list.identifier, items);
}

/**
 * Reload the drawer content with list names
 */
Remi.prototype._reloadDrawer = function () {
	var self = this;
	var lists = this._loadLists();
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
Remi.prototype._reloadMasterSettings = function(){
	var lists = this._loadLists();
	$.Dom.id('settings-master-elements').innerHTML = '';
	$.Each(lists, function(list, i){
		var li = $.Dom.element('li');
		

		var label_abo = $.Dom.element('label', {
//		TODO: quali classi deve avere la label
		});
		
		var abo_checkbox = $.Dom.element('input', {
			'type': 'checkbox',
			'data-index': i,
			'data-class': 'list-abo'
		});
		
		if(list.options['alphabetical-order']){
			abo_checkbox.checked='checked';
		}
		
		var icon_abo = $.Dom.element('img', {
			'src': 'img/alphabetical_order.svg',
			'alt': 'abo'
		});
		
		var label_mtb = $.Dom.element('label', {
//		TODO: quali classi deve avere la label
		});
		
		var mtb_checkbox = $.Dom.element('input', {
			'type': 'checkbox',
			'data-index': i,
			'data-class': 'list-mtb'
		});
		
		if(list.options['move-to-bottom']){
			mtb_checkbox.checked='checked';
		}
		
		var icon_mtb = $.Dom.element('img', {
			'src': 'img/move_to_bottom.svg',
			'alt': 'mtb'
		});
		
		var list_new_name=$.Dom.element('input', {
			'type': 'text',
			'value': list.name,
			'data-index': i,
			'class': 'fit six',
			'data-class': 'list-name'
		});
		var label = $.Dom.element('label', {
			'class': 'pack-checkbox danger fit'
		});
		var delete_list = $.Dom.element('input', {
			'type': 'checkbox',
			'data-index': i,
			'data-class': 'list-delete'
		});
		var span = $.Dom.element('span');
		$.Dom.inject(abo_checkbox, label_abo);
		$.Dom.inject(mtb_checkbox, label_mtb);
		$.Dom.inject(icon_abo, label_abo);
		$.Dom.inject(icon_mtb, label_mtb);
		$.Dom.inject(label_abo, li);
		$.Dom.inject(label_mtb, li);
		$.Dom.inject(list_new_name, li);
		$.Dom.inject(label, li)
		$.Dom.inject(delete_list, label);
		$.Dom.inject(span, label);
		$.Dom.inject(li, $.Dom.id('settings-master-elements'));
		
	});
}

Remi.prototype._reloadDetailSettings = function(){
	var lists = this._loadLists();
	var list = lists[0];
	var items = this._loadItems(0);
	$.Dom.id('settings-detail-elements').innerHTML = '';
	$.Dom.id('settings-detail-listname').innerHTML = list.name;
	$.Each(items, function(item, key){
		var li = $.Dom.element('li', {
			'data-index': key
		});
		var item_name=$.Dom.element('input', {
			'type': 'text',
			'value': item.name,
			'data-index': key,
			'class': 'fit six',
			'data-class': 'item-name'
		});
		var label = $.Dom.element('label', {
			'class': 'pack-checkbox danger fit'
		});
		var delete_item = $.Dom.element('input', {
			'type': 'checkbox',
			'data-index': key,
			'data-class': 'item-delete'
		});
		var span = $.Dom.element('span');
		$.Dom.inject(item_name, li);
		$.Dom.inject(label, li)
		$.Dom.inject(delete_item, label);
		$.Dom.inject(span, label);
		$.Dom.inject(li, $.Dom.id('settings-detail-elements'));
	});
}

/**
 * Create the main screen items list
 */
Remi.prototype._createMainScreenItem = function (key, item, list) {
	var self = this;

	// list item
	var li = $.Dom.element('li');
	
	// span for item name
	var spanItemName = $.Dom.element('span', {
		'class': 'fit six'
	}, item.name);
	
	// label for checkbox
	var label = $.Dom.element('label', {
		'class': 'pack-checkbox fit'
	});
	
	// checkbox
	var input = $.Dom.element('input', {
		'type': 'checkbox',
		'data-index': key
	}, '', {
		'click': function() {
			var items = self._loadItems(0);
			$.Each(items, function(currItem, currKey){
				if (currItem.name==item.name) {
					self.switchItemState(currKey);
					return false;
				}
				return true;
			});
		}
	});
	if (item.checked) {
		input.setAttribute('checked', 'checked');
	}
	// span for checkbox image
	var span = $.Dom.element('span');
	
	// container (checked list or not checked list)
	var container = $.Dom.id('index-itemslist-notchecked')
	if (item.checked) {
		if (list.options['move-to-bottom']) {
			container = $.Dom.id('index-itemslist-checked');
		}
		else {
			$.Dom.addClass(li, 'checked');
		}
	}
	
	// inject all items
	$.Dom.inject(li, container);
	$.Dom.inject(spanItemName, li);
	$.Dom.inject(label, li);
	$.Dom.inject(input, label);
	$.Dom.inject(span, label);
};

/* Use Cases */


/**
 * Create a new empty list with default options and stores it in localStorage
 * param new_list_name: new list name
 * return: null
 */
Remi.prototype.createList = function (new_list_name) {
	var lists = this._loadLists();
	//alert('start create list '+lists+' lists.lenght= '+lists.length);
	var found = null; // After the following Each is non-null if a list with the given name exists; null otherwise
	
	//alert(lists.length)
	if (lists && lists.length) { // TODO: eliminare questo if, lists non dovrebbe mai essere null
		$.Each(lists, function(list, i){
			if (!list) {
				return true;
			}
			if(list.name == new_list_name){ //TODO: uppercase/lowercase-trim-multiple blanks
				found = i;
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
		var uid = parseInt($.Storage.getns('static-info', 'unique-id')) || 0;
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
		$.Storage.set('list-' +uid, []);
		
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
	
	var self = this;
	
	// Clear dom
	$.Dom.id('index-listname').innerHTML = '';
	$.Dom.id('index-itemslist-notchecked').innerHTML = '';
	$.Dom.id('index-itemslist-checked').innerHTML = '';
	
	// Load the list and its option
	var lists = this._loadLists();
	var list = lists[index];
	
	if (lists.length && list) {
		var items = this._loadItems(index);
		
		if (list.options['alphabetical-order']) {
			items.sort(function(a, b) {
				return a.name.localeCompare(b.name);
			});
		}
		
		$.Each(items, function(item, key){
			self._createMainScreenItem(key, item, list);
		});
		
		//
		if ($.Dom.children('index-itemslist-checked', 'li').length) {
			var not_checked_items = $.Dom.children('index-itemslist-notchecked', 'li');
			if (not_checked_items.length) {
				$.Dom.addClass(not_checked_items[not_checked_items.length -1], 'not-last');
			}
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
Remi.prototype.editListNames = function(){
	var lists = this._loadLists();
	
	$.Each(lists, function(item, key){
		item.name = $.Dom.select('#settings-master-elements input[data-class="list-name"][data-index="'+key+'"]')[0].value;
	});
	
	$.Storage.set('lists', lists);
	
	return this;
}

/**
 * Delete marked lists
 * return: this
 */
Remi.prototype.deleteLists = function(){
	
	var lists = this._loadLists();
	var newlist = [];
	
	$.Each(lists, function(item, key){
		if ($.Dom.select('#settings-master-elements input[data-class="list-delete"][data-index="'+key+'"]')[0].checked) {
			$.Storage.set('list-'+item.identifier, []);
		}
		else{
			newlist.push(item);
		}
	});
	
	$.Storage.set('lists', newlist);
	
	return this;
}

/**
 * Add a new element to the current list. If the item alredy exists in this list it will be set unchecked without creating a new item
 * param new_item_name: name of the item to add to the current list
 * return: null
 */
Remi.prototype.addElement = function(new_item_name){
	
	var items = this._loadItems(0);
	var found = false;
	$.Each(items, function(item, key){
		if (item.name == new_item_name) {
			found = true;
			item.checked = false;
		}
		return !found;
	});
	if (!found) {
		items.splice(0, 0, {
			'name': new_item_name,
			'checked': false,
			'position': 0
		});
	}
	
	this._storeItems(0, items);
	
	this.showList(0);
}

/**
 * Invert the state of the item
 * param index: index within item list of the item to switch
 * return: null
 */
Remi.prototype.switchItemState = function(index) {
	var items = this._loadItems(0);
	var item = items[index];
	item.checked =! item.checked;
	this._storeItems(0, items);
	this.showList(0);
}

/**
 * Delete checked items from the current list
 * return: this for method chaining
 */
Remi.prototype.deleteItems = function(){
	var items = this._loadItems(0);
	var newItems = [];
	
	$.Each(items, function(item, key){
		if (!$.Dom.select('#settings-detail-elements input[data-class="item-delete"][data-index="'+key+'"]')[0].checked) {
			newItems.push(item);
		}
	});
	this._storeItems(0, newItems);
	return this;
}

/**
 * Modify item names, new names are taken from Input
 * return: this for method chaining
 */
Remi.prototype.editItemNames = function(){
	var items = this._loadItems(0);
	
	$.Each(items, function(item, key){
		item.name = $.Dom.select('#settings-detail-elements input[data-class="item-name"][data-index="'+key+'"]')[0].value;
	});
	
	this._storeItems(0, items);
	
	return this;
}

/**
 * Updates positions for each items
 * return: this for method chaining
 */
Remi.prototype.editItemPositions = function(){
	var items = this._loadItems(0);
	var newItems = [];
	
	$.Each($.Dom.select('#settings-detail-elements li'), function(item, key){		
		newItems.push({
			'name': items[item.getAttribute('data-index')].name,
			'checked': items[item.getAttribute('data-index')].checked
		});
	});
	
	this._storeItems(0, newItems);
	return this;
}

/**
 *
 */
Remi.prototype.editGlobalOptions = function (fontFamily, fontSize, pageStyle) {
	// Save options to local storage
	$.Storage.setns('global-options', {
		'font-family': fontFamily,
		'font-size': fontSize,
		'page-style': pageStyle
	});
	
	// Setup options
	// Apply font-family and font-size to body element
	$.Dom.style(document.body, {
		'font-family': fontFamily,
		'font-size': fontSize
	});
	// Apply page style
	// $.Dom.addClass(document.body, pageStyle);
	document.body.setAttribute('data-style', pageStyle);
}

/**
 *
 */
Remi.prototype.editListOptions = function(){
	var lists=this._loadLists();
	
	$.Each(lists, function(item, key){
		lists[key].options['alphabetical-order']=$.Dom.select('#settings-master-elements input[data-class="list-abo"][data-index="'+key+'"]')[0].checked;
		lists[key].options['move-to-bottom']=$.Dom.select('#settings-master-elements input[data-class="list-mtb"][data-index="'+key+'"]')[0].checked;
	});
	$.Storage.set('lists', lists);
	return this;
}

Remi.prototype.cleanList=function(index){
	var items=this._loadItems(index);
	$.Each(items, function(item, key){
		if (item.checked) {
			$.Dom.select('#settings-detail-elements input[data-class="item-delete"][data-index="'+key+'"]')[0].checked='checked';
		}
	});

}
