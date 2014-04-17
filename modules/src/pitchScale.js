function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['n.pitch'];


	// register a new module
	var mod = new MKON.module('Pitch Scale', 'Scale', id, req,

	function() {   

		var t = $('#'+this.id);	

		var ptc = MKON.CONTENT.getVariable(req);
		var l = t.find('.data-ptc');
		var last = l[0].getAttribute('data-last');
		var direction = 0;
		var dif = Math.round( Math.abs(ptc-last) );

		var base = 50;
		var newPos;

		var scale = dif*20;

		if (scale > 50) {
			scale = 50;
		} else if (scale < 0) {
			scale =  0;
		}

		if (ptc > last) {
			// direction is positive;
			newPos = base + scale;
		} else if (ptc < last) {
			// direction is negative
			newPos = base - scale;
		} else {
			// direction must be neutral/no change
			newPos = base;
		}

		t.find('.data-ptc').css('left', newPos + '%').attr('data-last', ptc);	
	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="pitch control-bar"><h3>PITCH</H3><div class="control s"><div class="marker s data-ptc"></div></div></div></div></li>';

	content = { html: content, x:1, y:2, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	
	//updateAPIString();
}

