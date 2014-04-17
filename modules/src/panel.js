function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var width = width || 1;
	var height = height || 1;	

	// content for insertion to gridster
	var content =   '<li class="panel" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					</li>';


	content = { html: content, x: width, y: height, col: col, row: row };

	MKON.CONTENT.addModule('', content);
}

