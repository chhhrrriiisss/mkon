function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['t.timeWarp'];
	var com = ['t.timeWarp', 't.timeWarp'];

	// register a new module
	var mod = new MKON.module('Time Warp', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		var w = t.find('.data-speed');
		var l = w[0].getAttribute('data-last');
		var n = MKON.CONTENT.getVariable(req[0]) || 0;

	

		// var s = t.find('.data-status');

		// var p =  MKON.CONTENT.getVariable(req[0]) || 0;
		// var l = s.getAttribute('data-last'); 

	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="timewarp screen"><div class="data-speed holder tw1">\
					<span class="trg"></span><span class="trg"></span><span class="trg"></span>\
					<span class="trg"></span><span class="trg"></span><span class="trg"></span>\
					<span class="trg"></span><span class="trg"></span></div><h3 class="data-title">WARP</h3></div></li>';

	content = { html: content, x: 3, y: 1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	// Adds a keyboard hook that sends a command
	MKON.CONTENT.addHook(id, '.', function() { MKON.COMMS.command(com[0]); });
	MKON.CONTENT.addHook(id, ',', function() { MKON.COMMS.command(com[1]); });

}

