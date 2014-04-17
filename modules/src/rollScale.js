function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['n.roll'];


	// register a new module
	var mod = new MKON.module('Roll Scale', 'Scale', id, req,

	function() {   

		var t = $('#'+this.id);	

		var roll = MKON.CONTENT.getVariable(req);
		var r = t.find('.data-roll');
		var last = r[0].getAttribute('data-last');
		var direction = 0;
		var dif = Math.round( Math.abs(roll-last) );

		var base = 50;
		var newPos;

		var scale = dif*2;

		if (scale > 50) {
			scale = 50;
		} else if (scale < 0) {
			scale =  0;
		}

		if (roll < last) {
			// direction is positive;
			newPos = base + scale;
		} else if (roll > last) {
			// direction is negative
			newPos = base - scale;
		} else {
			// direction must be neutral/no change
			newPos = base;
		}

		t.find('.data-roll').css('left', newPos + '%').attr('data-last', roll);		

	
	} );
         
	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="roll control-bar"><h3>ROLL</H3><div class="control s"><div class="marker s data-roll"></div></div></div></div></li>';

	content = { html: content, x:2, y:1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	
	//updateAPIString();
}

