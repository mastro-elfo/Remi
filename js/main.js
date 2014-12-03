$.Dom.addEvent(window, 'load', function(){
	// Set browser language
	// TODO: get from localStorage
	$.L10n.setLanguage($.L10n.sniff().substring(0, 2));
	// $.L10n.setLanguage('de');
	
	// Translate all
	$.L10n.translateAll();
	
	// Create new Remi instance
	var remi=new Remi();
	
	// Show the last selected list
	remi.showList(0);
	
	// Add 'goto' events
	$.Each(document.body.querySelectorAll('[data-goto]'), function(item){
		$.Dom.addEvent(item, 'click', function(event){
			Page.open(event.target.getAttribute('data-goto'));
		});
	});
	
	// Add 'goback' events
	$.Each(document.body.querySelectorAll('[data-goback]'), function(item){
		$.Dom.addEvent(item, 'click', function(event){
			Page.back();
		});
	});
	
	// Keypress event for new list input
	$.Dom.addEvent('index-drawer-input', 'keypress', function(event){
		if (event.key == 'Enter') {
			remi.createList(event.target.value);
		}
	});
	
	// Keypress event for new item input
	$.Dom.addEvent('index-item-input', 'keypress', function(event){
		if (event.key == 'Enter') {
			remi.addElement(event.target.value);
		}
	});
	
	// Open master settings panel
	$.Each($.Dom.select('[data-goto="settings-master"]'), function(item){
		$.Dom.addEvent(item, 'click', function(){
			remi._reloadMasterSettings();
		});
	});
	
	// Open detail settings panel
	$.Each($.Dom.select('[data-goto="settings-detail"]'), function(item){
		$.Dom.addEvent(item, 'click', function(){
			remi._reloadDetailSettings();
		});
	});
	
	// Done edit master settings
	$.Dom.addEvent('settings-master-done', 'click', function(event){
		remi.editListNames().deleteLists();
		remi.showList(0);
	});
	
	// Done edit detail settings
	$.Dom.addEvent('settings-detail-done', 'click', function(event){
		remi.editItemPositions().editItemNames().deleteItems();
		remi.showList(0);
	});
});