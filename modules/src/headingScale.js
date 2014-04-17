function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['n.heading'];


	// register a new module
	var mod = new MKON.module('Heading Scale', 'Scale', id, req,

	function() {   

		var t = $('#'+this.id);	

		var hdn = MKON.CONTENT.getVariable(req);

		var start = -178;
		var end = -978;
		var difference = Math.abs(start - end);
		var scale = difference/360;
		hdn = (hdn*scale);	
		hdn = start - hdn;
		hdn = MKON.FNC.toFixed( hdn, 0);
	
		var target = t.find('.data-hdn');
		var oY = target.css('background-position-y');

		//console.log('output: ' + hdn);

		t.find('.data-hdn').css('background-position', hdn+'px '+oY);
		// var scale = range/360;
		//&deg;
	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content">   <div class="deg s heading-bar"><h3>HEADING</H3><div class="heading s data-hdn"><div class="marker s"></div></div></div></div></li>';

	content = { html: content, x:4, y:1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	
	//updateAPIString();
}

