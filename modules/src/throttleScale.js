function init(startCol, startRow, url) {

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
					<div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
					<div class="content"><div class="throttle s scale-bar"><h3>THROTTLE</H3><div class="scale"><div class="marker s data-thr"></div></div></div></div></li>';

	content = { html: content, x: 3, y: 1, col: startCol, row: startRow };

	MKON.CONTENT.addModule(mod, content);

	;
	//updateAPIString();
}

