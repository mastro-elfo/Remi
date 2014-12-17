$.Dom.addEvent(window, 'load', function(){
	// Set browser language
	$.L10n.setLanguage($.L10n.sniff().substring(0, 2));
	// $.L10n.setLanguage('de');
	
	// Translate all
	$.L10n.translateAll();
	
	// Create new Remi instance
	var remi = new Remi();
	
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
			event.target.value='';
			$.Dom.id('index-item-input').focus();
			$.Dom.id('index-item-input').value = '';
		}
	});
	
	// Keypress event for new item input
	$.Dom.addEvent('index-item-input', 'keypress', function(event){
		if (event.key == 'Enter') {
			remi.addElement(event.target.value);
			event.target.value='';
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
	$.Dom.addEvent('settings-master-done', 'click', function(){
		remi.editListNames().deleteLists().editListOptions();
		remi.showList(0);
	});
	
	// Done edit detail settings
	$.Dom.addEvent('settings-detail-done', 'click', function(){
		remi.editItemPositions().editItemNames().deleteItems();
		remi.showList(0);
	});
	
	$.Dom.addEvent('settings-done', 'click', function(){
		remi.editGlobalOptions($.Dom.id('settings-fontfamily').value, $.Dom.id('settings-fontsize').value, $.Dom.id('settings-pagestyle').value);
	});
	
	$.Dom.addEvent('settings-detail-clean', 'click', function(){
		remi.cleanList(0);
	});
	
	$.Dom.addEvent('index-opensidebar', 'click', function(){
		setTimeout(function(){
			$.Dom.id('index-drawer-input').focus();
		}, 250);
	});
});