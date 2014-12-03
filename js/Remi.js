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
 * Load the items array
 * param index: index of the list within localStorage
 * return: array of items
 */
Remi.prototype._loadItems=function(index){
	var lists=this._loadLists();
	var list=lists[index];
	return $.Storage.get('list-'+list.identifier);
}

/**
 * Stores items in localStorage
 * param index: intex of the list to update
 * param items: new list items
 * return: null
 */
Remi.prototype._storeItems = function(index, items) {
	var lists=this._loadLists();
	var list=lists[index];
	$.Storage.set('list-'+list.identifier, items);
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
		var li=$.Dom.element('li');
		var list_new_name=$.Dom.element('input', {
			'type':'text',
			'value':list.name,
			'data-index':i,
			'class': 'fit six',
			'data-class':'list-name'
		});
		var label = $.Dom.element('label', {
			'class': 'pack-checkbox danger fit'
		});
		var delete_list=$.Dom.element('input', {
			'type':'checkbox',
			'data-index':i,
			'data-class':'list-delete'
		});
		var span = $.Dom.element('span');
		$.Dom.inject(list_new_name, li);
		$.Dom.inject(label, li)
		$.Dom.inject(delete_list, label);
		$.Dom.inject(span, label);
		$.Dom.inject(li, $.Dom.id('settings-master-elements'));
		
	});
}

Remi.prototype._reloadDetailSettings=function(){
	var lists=this._loadLists();
	var list=lists[0];
	var items=this._loadItems(0);
	$.Dom.id('settings-detail-elements').innerHTML='';
	$.Dom.id('settings-detail-listname').innerHTML=list.name;
	$.Each(items, function(item, key){
		var li=$.Dom.element('li', {
			'data-index': key
		});
		var item_name=$.Dom.element('input', {
			'type':'text',
			'value':item.name,
			'data-index': key,
			'class': 'fit six',
			'data-class':'item-name'
		});
		var label = $.Dom.element('label', {
			'class': 'pack-checkbox danger fit'
		});
		var delete_item=$.Dom.element('input', {
			'type':'checkbox',
			'data-index':key,
			'data-class':'item-delete'
		});
		var span = $.Dom.element('span');
		$.Dom.inject(item_name, li);
		$.Dom.inject(label, li)
		$.Dom.inject(delete_item, label);
		$.Dom.inject(span, label);
		$.Dom.inject(li, $.Dom.id('settings-detail-elements'));
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
		var uid=parseInt($.Storage.getns('static-info', 'unique-id'));
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
	
	var self = this;
	
	// Clear dom
	$.Dom.id('index-listname').innerHTML = '';
	$.Dom.id('index-itemslist-notchecked').innerHTML = '';
	$.Dom.id('index-itemslist-checked').innerHTML = '';
	
	// Load the list and its option
	var lists = this._loadLists();
	var list = lists[index];
	
	if (lists.length && list) {
		// TODO
		var items = this._loadItems(index);
		
		if (list.options['alphabetical-order']) {
			items.sort(function(a, b) {
				return a.localeCompare(b);
			});
		}
		if (list.options['move-to-bottom']) {
			// Add items to dom with move-to-bottom option
			$.Each(items, function(item, key){
				// TODO: usare una funzione per fare un piacere all'ingegnere...
				if (item.checked) {
					var li = $.Dom.element('li');
					var spanItemName = $.Dom.element('span', {}, item.name);
					var label = $.Dom.element('label', {
						'class': 'pack-checkbox'
					});
					var input = $.Dom.element('input', {
						'type': 'checkbox',
						'data-index': key,
						'checked': 'checked'
					}, '', {
						'click': function() {
							self.switchItemState(this.getAttribute('data-index'));
						}
					});
					var span = $.Dom.element('span');
					
					$.Dom.inject(li, $.Dom.id('index-itemslist-checked'));
					$.Dom.inject(spanItemName, li);
					$.Dom.inject(label, li);
					$.Dom.inject(input, label);
					$.Dom.inject(span, label);
				}
				else{
					var li = $.Dom.element('li');
					var spanItemName = $.Dom.element('span', {}, item.name);
					var label = $.Dom.element('label', {
						'class': 'pack-checkbox'
					});
					var input = $.Dom.element('input', {
						'type': 'checkbox',
						'data-index': key
					}, '', {
						'click': function() {
							self.switchItemState(this.getAttribute('data-index'));
						}
					});
					var span = $.Dom.element('span');
					
					$.Dom.inject(li, $.Dom.id('index-itemslist-notchecked'));
					$.Dom.inject(spanItemName, li);
					$.Dom.inject(label, li);
					$.Dom.inject(input, label);
					$.Dom.inject(span, label);
				}
			});
		}
		else{
			// Add items to dom as in localStorage order
			$.Each(items, function(item){
				if (item.checked) {
					var li = $.Dom.element('li', {
						'class': 'checked'
					});
					var spanItemName = $.Dom.element('span', {}, item.name);
					var label = $.Dom.element('label', {
						'class': 'pack-checkbox'
					});
					var input = $.Dom.element('input', {
						'type': 'checkbox',
						'data-index': key,
						'checked': 'checked'
					}, '', {
						'click': function() {
							self.switchItemState(this.getAttribute('data-index'));
						}
					});
					var span = $.Dom.element('span');
					
					$.Dom.inject(li, $.Dom.id('index-itemslist-notchecked'));
					$.Dom.inject(spanItemName, li);
					$.Dom.inject(label, li);
					$.Dom.inject(input, label);
					$.Dom.inject(span, label);
				}
				else{
					var li = $.Dom.element('li');
					var spanItemName = $.Dom.element('span', {}, item.name);
					var label = $.Dom.element('label', {
						'class': 'pack-checkbox'
					});
					var input = $.Dom.element('input', {
						'type': 'checkbox',
						'data-index': key
					}, '', {
						'click': function() {
							self.switchItemState(this.getAttribute('data-index'));
						}
					});
					var span = $.Dom.element('span');
					
					$.Dom.inject(li, $.Dom.id('index-itemslist-notchecked'));
					$.Dom.inject(spanItemName, li);
					$.Dom.inject(label, li);
					$.Dom.inject(input, label);
					$.Dom.inject(span, label);
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
		item.name=$.Dom.select('#settings-master-elements input[data-class="list-name"][data-index="'+key+'"]')[0].value;
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
Remi.prototype.addElement=function(new_item_name){
	
	var items=this._loadItems(0);
	var found=false;
	$.Each(items, function(item, key){
		if (item.name==new_item_name) {
			found=true;
			item.checked=false;
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
	var items=this._loadItems(0);
	var item=items[index];
	item.checked=!item.checked;
	this._storeItems(0, items);
	this.showList(0);
}

/**
 * Delete checked items from the current list
 * return: this for method chaining
 */
Remi.prototype.deleteItems=function(){
	var items=this._loadItems(0);
	var newItems=[];
	
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
Remi.prototype.editItemNames=function(){
	var items=this._loadItems(0);
	
	$.Each(items, function(item, key){
		item.name=$.Dom.select('#settings-detail-elements input[data-class="item-name"][data-index="'+key+'"]')[0].value;
	});
	
	this._storeItems(0, items);
	
	return this;
}

/**
 * Updates positions for each items
 * return: this for method chaining
 */
Remi.prototype.editItemPositions=function(){
	var items=this._loadItems(0);
	var newItems=[];
	
	$.Each($.Dom.select('#settings-detail-elements li'), function(item, key){		
		newItems.push({
			'name': items[item.getAttribute('data-index')].name,
			'checked': items[item.getAttribute('data-index')].checked
		});
	});
	
	this._storeItems(0, newItems);
	return this;
}
