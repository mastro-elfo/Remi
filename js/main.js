// TODO: What to do when there are no lists?
// TODO: What to do the first time app is lunched?
// TODO: Correct appcache

$.Dom.addEvent(window, 'load', function(){
	// Set browser language
	$.L10n.setLanguage($.L10n.sniff().substring(0, 2));
	$.L10n.setLanguage('en');
	
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
	
	// Add autocapitalize attribute to inputs
	// Here and not in HTML for compatibility
	$.Dom.id('index-drawer-input').setAttribute('autocapitalize', 'on');
	$.Dom.id('index-item-input').setAttribute('autocapitalize', 'on');
	// TODO: test this feature
	
	// Keypress event for new list input
	$.Dom.addEvent('index-drawer-input', 'keypress', function(event){
		if (event.keyCode == 13) {
			remi.createList(event.target.value);
			event.target.value='';
			$.Dom.id('index-item-input').focus();
			$.Dom.id('index-item-input').value = '';
		}
	});
	
	// Keypress event for new item input
	$.Dom.addEvent('index-item-input', 'keypress', function(event){
		if (event.keyCode == 13) {
			remi.addElement(event.target.value);
			event.target.value='';
		}
	});
	
	// Open master settings panel
	/*$.Each($.Dom.select('[data-goto="settings-master"]'), function(item){
		$.Dom.addEvent(item, 'click', function(){
			remi._reloadMasterSettings();
		});
	});*/
	
	// Open detail settings panel
	$.Each($.Dom.select('[data-goto="settings-detail"]'), function(item){
		$.Dom.addEvent(item, 'click', function(){
			remi._reloadDetailSettings();
		});
	});
	
	// Done edit master settings
	/*$.Dom.addEvent('settings-master-done', 'click', function(){
		remi.editListNames().deleteLists().editListOptions();
		remi.showList(0);
	});*/
	
	// Done edit detail settings
	$.Dom.addEvent('settings-detail-done', 'click', function(){
		remi.editItemPositions().editItemNames().deleteItems();
		remi.showList(0);
	});
	
	// Apply settings
	$.Dom.addEvent('settings-done', 'click', function(){
		remi.editGlobalOptions($.Dom.id('settings-fontfamily').value, $.Dom.id('settings-fontsize').value, $.Dom.id('settings-pagestyle').value);
	});
	
	// Apply clean list
	$.Dom.addEvent('settings-detail-clean', 'click', function(){
		remi.cleanList(0);
	});
	
	// When opening sidebar, only focus on input if there is no list, because one can open the sidebar not to add lists
	$.Dom.addEvent('index-opensidebar', 'click', function(){
		var lists = remi._loadLists();
		if (!lists || !lists.length) {
			 setTimeout(function(){
				 $.Dom.id('index-drawer-input').focus();
			 }, 250);
		}
	});
	
	$.Dom.addEvent('settings-backup-import', 'click', function(){
		remi.importBackup();
		remi.showList(0);
	});

	$.Dom.addEvent('settings-backup-export', 'click', function(){
		remi.exportBackup();
	});
	
	// Get info from .webapp file
	$.Ajax.get('./manifest.webapp', {}, {
		'onSuccess': function(t){
			// alert(t)
			var data = $.Json.decode(t);
			$.Dom.id('info-versionvalue').innerHTML = data.version;
		}
	});
	
	
	$.Dom.addEvent('settings-detail-deletelist', 'click', function(){
		remi.deleteList($.Dom.id('settings-detail-listkey').value);
		remi.showList(0);
	});
});