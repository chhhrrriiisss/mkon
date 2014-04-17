function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['f.throttle'];


	// register a new module
	var mod = new MKON.module('Throttle Scale', 'Scale', id, req,

	function() {   

		var t = $('#'+this.id);	

		var thr = 100 - ( Math.round( MKON.CONTENT.getVariable(req) * 100 ) );

		t.find('.data-thr').css('left', thr + '%');		
	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="throttle s scale-bar"><h3>THROTTLE</H3><div class="scale"><div class="marker s data-thr"></div></div></div></div></li>';

	content = { html: content, x: 3, y: 1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	MKON.CONTENT.addHook(id, 'shift', function() { MKON.COMMS.command("f.throttleUp"); });
	MKON.CONTENT.addHook(id, 'ctrl', function() { MKON.COMMS.command("f.throttleDown"); });
	MKON.CONTENT.addHook(id, 'x', function() { MKON.COMMS.command("f.throttleZero"); });
	MKON.CONTENT.addHook(id, 'z', function() { MKON.COMMS.command("f.throttleFull"); });
	
	//updateAPIString();
}

