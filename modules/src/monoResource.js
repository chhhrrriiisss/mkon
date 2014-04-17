function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['r.resource[MonoPropellant]', 'r.resourceMax[MonoPropellant]'];

	// register a new module
	var mod = new MKON.module('Monopropellant Resource', 'Resource', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var mono = MKON.CONTENT.getVariable(req[0]);
		var maxMono = MKON.CONTENT.getVariable(req[1]);
		var perc = MKON.FNC.toFixed( (mono/maxMono)*100, 2 );
		mono = MKON.FNC.toFixed(mono, 2);
		maxMono = MKON.FNC.toFixed(maxMono, 0);

		var target = t.find('.data-mono');

		target.css('width', perc + '%');
		target.attr('data-val', mono);
		target.parent().attr('data-val', maxMono);

		// t.find('.marker').css('left', perc + '%')	
	
	
	}
	);

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="resource-bar"><h3>MONOPROPELLANT</H3><div class="s resource" data-val="0"><div class="s value data-mono" data-val="0"></div></div></div></div></li>';


	content = { html: content, x:3, y:1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	;
	//updateAPIString();

}