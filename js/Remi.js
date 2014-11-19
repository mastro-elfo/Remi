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
	$.Storage.load('lists', []);
	return $.Storage.get('lists');
}

/**
 * Reload the drawer content with list names
 */
Remi.prototype._reloadDrawer = function () {
	var self=this;
	var lists=this._loadLists();
	$.Dom.id('index-drawer-lists').innerHTML = '';
	$.Each(lists, function(list, i){
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
		$.Dom.inject($.Dom.element('li', {}, '<input type="text" value="'+list.name+'" data-index="'+i+'"/>'), $.Dom.id('settings-master-elements'));
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
	var found=null; // After the following Each is non-null if a list with the given name exists; null otherwise
	
	//alert(lists.length)
	if (lists) { // TODO: eliminare questo if, lists non dovrebbe mai essere null
		$.Each(lists, function(list, i){
			if(list.name==new_list_name){ //TODO: uppercase/lowercase-trim-multiple blanks
				found=i;
				return false;
			}
			else{
				// Continue to the following step...
				return true;
			}
		});
		//alert(found)
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
		$.Storage.set('lists', lists);
		$.Storage.set('list-'+ uid, []);
		
	}
	
	this.showList(found || lists.length -1);
}

/**
 * Shows the selected list
 * param index: list index as stored in localStorage
 * return: null
 */
Remi.prototype.showList = function (index){
	// Load the list and its option
	var lists = this._loadLists();
	if (!lists) {
		return;
	}
	
	var list = lists[index];
	var items = $.Storage.get('list-'+list.identifier);
	
	// Clear dom
	$.Dom.id('index-itemslist-notchecked').innerHTML = '';
	$.Dom.id('index-itemslist-checked').innerHTML = '';
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
	
	// Put last shown list in first place
	orderedList[0] = lists[index];
	
	// Put all others lists in same order
	$.Each(lists, function(list, key){
		if(index != key) {
			orderedList.push(list);
		}
	});
	
	// Save lists on localStorage
	$.Storage.set('lists', orderedList);
	
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
 *
 *
 */
Remi.prototype.editListNames=function(){
	var lists=this._loadLists();
	
	$.Each($.Dom.select('#settings-master-elements input'), function(item){
		lists[item.getAttribute('data-index')].name=item.value;
	});
	
	$.Storage.set('lists', lists);
	
/*4. Il sistema aggiorna le modifiche effettuate
 *1raccogliere input dal contenitore
 *2per ogni input leggo il valore e */
}
