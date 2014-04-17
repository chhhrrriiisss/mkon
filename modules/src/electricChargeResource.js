function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['r.resource[ElectricCharge]', 'r.resourceMax[ElectricCharge]'];

	// register a new module
	var mod = new MKON.module('Electric Charge Resource', 'Resource', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var chr = MKON.CONTENT.getVariable(req[0]);
		var maxChr = MKON.CONTENT.getVariable(req[1]);
		var perc = MKON.FNC.toFixed( (chr/maxChr)*100, 2 );
		chr = MKON.FNC.toFixed(chr, 2);
		maxChr = MKON.FNC.toFixed(maxChr, 0);

		var target = t.find('.data-chr');

		target.css('width', perc + '%');
		target.attr('data-val', chr);
		target.parent().attr('data-val', maxChr);

		// t.find('.marker').css('left', perc + '%')	
	
	
	}
	);

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="resource-bar"><h3>ELECTRIC CHARGE</H3><div class="s resource" data-val="0"><div class="s value data-chr" data-val="0"></div></div></div></div></li>';

	content = { html: content, x:3, y:1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	;
	//updateAPIString();

}