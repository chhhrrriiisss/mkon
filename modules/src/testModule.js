function init(startCol, startRow, url) {

	var id = MKON.FNC.randomString(5)	
	var req = ['v.sasValue'];

	// register a new module
	var testModule = new Module('Test Module', 'Button', id, function() {   

		var t = $('#'+this.id);

		var d = MKON.CONTENT.getVariable(req) || 0;	
		console.log(d);

		if (d == 'True') {
			t.find('.button').removeClass('gray');
		
		} else {
			t.find('.button').addClass('gray');
	
		}
	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">';
	content += '<div class="options"><div class="remove">  X </div></div>';
	content += '<div class="content blank"><a class="button lightText large square blue" data-defaultClass="blue" href="javascript:void(0);">GEAR</a></div></li>';

	content = { html: content, x: 3, y: 1, col: startCol, row: startRow };

	MKON.CONTENT.addModule(mod,content);

	
	//updateAPIString();
}