function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = 
	['r.resource[LiquidFuel]', "r.resourceMax[LiquidFuel]",  
	'r.resource[Oxidizer]', "r.resourceMax[Oxidizer]",
	'r.resource[ElectricCharge]', "r.resourceMax[ElectricCharge]",
	'r.resource[MonoPropellant]', "r.resourceMax[MonoPropellant]",
	];

	// register a new module
	var mod = new MKON.module('Resource Information', 'Screen', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var temp = [];

		var count = 0;

		for (var i = 0; i<req.length; i+=2) {
			updateResource( MKON.CONTENT.getVariable(req[i]), MKON.CONTENT.getVariable(req[i+1]) );
			
		}	

		function updateResource(cur, max) {
			var perc = MKON.FNC.toFixed( (cur/max)*100, 2 );
			cur = MKON.FNC.toFixed(cur, 2);
			max= MKON.FNC.toFixed(max, 0);
			var target = t.find('div.data:eq(' + count + ')');	
			count++;	
			target.css('width', perc + '%');
			target.attr('data-val', cur);
			target.parent().attr('data-val', max);
		}


		// t.find('.data-lon').html(lon);
		// t.find('.data-lat').html(lat);
		// t.find('.data-ptc').html(ptc + '&deg;');
		// t.find('.data-rll').html(rll + '&deg;');
		// t.find('.data-hdn').html(hdn + '&deg;');
		// t.find('.data-srfvel').html(srfvel + 'm/s');
		// t.find('.data-thr').html(thr + '%');			
	}
	);
	

	// content for insertion to gridster
	var content =  '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content">\
					<div class="resource screen">\
					<div class="item">\
					<div class="resource-bar"><h3>LIQUID FUEL</H3>\
					<div class="s resource" data-val="0"><div class="s value data" data-val="0" style="width:60%;"></div></div>\
					</div>\
					</div>\
					<div class="item">\
					<div class="resource-bar"><h3>OXIDIZER</H3>\
					<div class="s resource" data-val="0"><div class="s value data" data-val="0" style="width:60%;"></div></div>\
					</div>\
					</div>\
					<div class="item">\
					<div class="resource-bar"><h3>ELECTRIC CHARGE</H3>\
					<div class="s resource" data-val="0"><div class="s value data" data-val="0" style="width:60%;"></div></div>\
					</div>\
					</div>\
					<div class="item">\
					<div class="resource-bar"><h3>MONOPROPELLANT</H3>\
					<div class="s resource" data-val="0"><div class="s value data" data-val="0" style="width:60%;"></div></div>\
					</div>\
					</div>\
					<h3>RESOURCES</h3>\
					</div>\
					</div></li>';

	content = { html: content, x:3, y:4, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	
	
	//updateAPIString();

}