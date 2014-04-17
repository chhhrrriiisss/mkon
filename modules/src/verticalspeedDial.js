function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['v.verticalSpeed'];


	// register a new module
	var mod = new MKON.module('Vertical Speed Dial', 'Dial', id, req,

	function() {   

		var t = $('#'+this.id);	

		var vs = MKON.CONTENT.getVariable(req) || 0;

		var negative = false;

		if (vs < 0) {
			negative = true;
		}

		vs = Math.abs(vs);
		var scale = 0;

		if (vs <= 10) {
			scale = vs*4.5;
		} else if (vs > 10 && vs <= 100) {
			scale = (vs * .45) + 45;
		} else if (vs > 100 && vs <= 1000) {
			scale = (vs * 0.045) + 90;
		} else if (vs > 1000) {
			scale = 1000;
		}

		if (negative){
			scale = scale * -1;
		}

		setTransform(t.find('.data-vs'), 'rotate(' + scale + 'deg)');


		// to ensure cross browser css
		function setTransform(target, transform) {

			target.css({'-webkit-transform': transform, 
			'-moz-transform': transform,
			'-ms-transform':transform,
			'-o-transform': transform,
			'transform': transform});
		}

	
	} );
         
	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content blank"><div class="verticalspeed s dial"><div class="pointer s data-vs"></div></div></div></li>';

	content = { html: content, x: 2, y: 2, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	
	//updateAPIString();
}

