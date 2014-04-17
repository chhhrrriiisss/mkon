function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['o.PeA','o.ApA','o.timeToAp','o.timeToPe','o.inclination','o.eccentricity','v.orbitalVelocity'];

	// register a new module
	var mod = new MKON.module('Orbital Information', 'Screen', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var per = MKON.FNC.formatters.distance(  Math.round(MKON.CONTENT.getVariable(req[0])) );
		var apo = MKON.FNC.formatters.distance(  Math.round(MKON.CONTENT.getVariable(req[1])) );
		var tta = MKON.FNC.formatters.time(   Math.round(MKON.CONTENT.getVariable(req[2])) );
		var ttp = MKON.FNC.formatters.time( Math.round(MKON.CONTENT.getVariable(req[3])) );
		var inc = MKON.FNC.toFixed(  MKON.CONTENT.getVariable(req[4]) , 3);
		var ecc = MKON.FNC.toFixed(  MKON.CONTENT.getVariable(req[5]) , 3);
		var vel = MKON.FNC.formatters.velocity(  MKON.FNC.toFixed( MKON.CONTENT.getVariable(req[6]) , 1) );


		t.find('.data-apa').html(apo);
		t.find('.data-per').html(per);
		t.find('.data-tta').html(tta);
		t.find('.data-ttp').html(ttp);
		t.find('.data-inc').html(inc + '&deg;');
		t.find('.data-ecc').html(ecc);
		t.find('.data-vel').html(vel);			
	}
	);

	// content for insertion to gridster
	var content =  '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content">\
					<div class="orbital screen">\
                    <div class="item"> <h4>APOAPSIS</h4> <span class="data data-apa">0m</span> </div>\
                    <div class="item"> <h4>TIME TO APOAPSIS</span></h4> <span class="data data-tta">0s</span> </div>\
                    <div class="item"> <h4>PERIAPSIS</h4> <span class="data data-per">0m</span> </div>\
                    <div class="item"> <h4>TIME TO PERIAPSIS</span></h4> <span class="data data-ttp">0s</span> </div>\
                    <div class="item"> <h4>INCLINATION</h4> <span class="data data-inc">0.25deg</span> </div>\
                    <div class="item"> <h4>ECCENTRICITY</span></h4> <span class="data data-ecc">0.25</span> </div>\
                    <div class="item"> <h4>ORBITAL VELOCITY</span></h4> <span class="data data-vel">1200m/s</span></div>\
                    <h3>ORBITAL</h3>\
                	</div>\
					</div></li>';

	content = { html: content, x:3, y:4, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	
	

	/*
	for (var i=1; i<req.length; i+=2) {

		var v = [req[i-1], req[i]];
		addVariables(v)
	} */
	
	//updateAPIString();

}