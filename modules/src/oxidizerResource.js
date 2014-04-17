function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['r.resource[Oxidizer]', 'r.resourceMax[Oxidizer]'];

	// register a new module
	var mod = new MKON.module('Oxidizer Resource', 'Resource', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var oxd = MKON.CONTENT.getVariable(req[0]);
		var maxOxd = MKON.CONTENT.getVariable(req[1]);
		var perc = MKON.FNC.toFixed( (oxd/maxOxd)*100, 2 );
		oxd = MKON.FNC.toFixed(oxd, 2);
		maxOxd= MKON.FNC.toFixed(maxOxd, 0);
		var target = t.find('.data-oxd');

		target.css('width', perc + '%');
		target.attr('data-val', oxd);
		target.parent().attr('data-val', maxOxd);

		// t.find('.marker').css('left', perc + '%')	
	
	
	}
	);

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="resource-bar"><h3>OXIDIZER</H3><div class="s resource" data-val="0"><div class="s value data-oxd" data-val="0"></div></div></div></div></li>';

	content = { html: content, x:3, y:1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	;
	//updateAPIString();

}