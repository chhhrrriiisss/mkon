function init(startCol, startRow, url) {

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
					<div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
					<div class="content"><div class="resource-bar"><h3>MONOPROPELLANT</H3><div class="s resource" data-val="0"><div class="s value data-mono" data-val="0"></div></div></div></div></li>';


	content = { html: content, x:3, y:1, col: startCol, row: startRow };

	MKON.CONTENT.addModule(mod, content);

	;
	//updateAPIString();

}