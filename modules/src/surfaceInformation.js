function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['v.long', 'v.lat', 'n.pitch','n.roll','n.heading','v.surfaceVelocity','f.throttle'];

	// register a new module
	var mod = new MKON.module('Surface Information', 'Screen', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var lon = MKON.FNC.toFixed( MKON.CONTENT.getVariable(req[0]) , 6);
		var lat = MKON.FNC.toFixed( MKON.CONTENT.getVariable(req[1]) , 6);
		var ptc = MKON.FNC.toFixed( MKON.CONTENT.getVariable(req[2]) , 1);
		var rll = MKON.FNC.toFixed( MKON.CONTENT.getVariable(req[3]) , 1);
		var hdn = MKON.FNC.toFixed( MKON.CONTENT.getVariable(req[4]) , 2);
		var srfvel = MKON.FNC.toFixed( MKON.CONTENT.getVariable(req[5]) , 1);
		var thr = Math.round( MKON.CONTENT.getVariable(req[6]) * 100 );

		t.find('.data-lon').html(lon);
		t.find('.data-lat').html(lat);
		t.find('.data-ptc').html(ptc + '&deg;');
		t.find('.data-rll').html(rll + '&deg;');
		t.find('.data-hdn').html(hdn + '&deg;');
		t.find('.data-srfvel').html(srfvel + 'm/s');
		t.find('.data-thr').html(thr + '%');			
	}
	);
	

	// content for insertion to gridster
	var content =  '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content">\
					<div class="surface screen">\
					<div class="item"> <h4>LATITUDE</h4> <span class="data data-lat">0</span> </div>\
                    <div class="item"> <h4>LONGITUDE</span></h4> <span class="data data-lon">0</span> </div>\
                    <div class="item"> <h4>PITCH</h4> <span class="data data-ptc">0</span></div>\
                    <div class="item"> <h4>ROLL</h4> <span class="data data-rll">0</span></div>\
                    <div class="item"> <h4>HEADING</span></h4> <span class="data data-hdn">0deg</span> </div>\
                    <div class="item"> <h4>SURFACE VELOCITY</span></h4> <span class="data data-srfvel">0m/s</span> </div>\
                    <div class="item"> <h4>THROTTLE</span></h4> <span class="data data-thr">0%</span> </div>\
                    <h3>SURFACE</h3>\
                	</div>\
					</div></li>';

	content = { html: content, x: 3, y: 4, col: col, row: row };
	
	MKON.CONTENT.addModule(mod, content);

	
	

	//updateAPIString();

}