function init(startCol, startRow, url) {

	var id = MKON.FNC.randomString(5)	
	var req = ['v.atmosphericDensity'];

	// register a new module
	var mod = new MKON.module('Atmospheric Density', 'Scale', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var min = 0;
		var max = 1.2040531;
		var rng = max - min;

		var d = MKON.CONTENT.getVariable(req);

		var perc = (d/max)*100;

		t.find('.marker').css('left', perc + '%')	
	
	
	}
	);

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
					<div class="content"> <div class="density s scale-bar"><h3>ATMOSPHERE</H3><div class="scale"><div class="marker s"></div></div></div></div></li>';

	content = { html: content, x:3, y:1, col: startCol, row: startRow };

	MKON.CONTENT.addModule(mod, content);

	;
	//updateAPIString();

}