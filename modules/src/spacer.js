function init(url, col, row, meta, width, height) {

	var width = width || 1;
	var height = height || 1;

	console.log(width + ' ' + height)

	// content for insertion to gridster	
	var content = '<li class="blank" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
				   <div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
				   </li>';

	content = { html: content, x: width, y: height, col: col, row: row };

	MKON.CONTENT.addModule('', content);
	
}

