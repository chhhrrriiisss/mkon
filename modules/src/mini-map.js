function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['o.ApA', 'o.PeA', 'o.trueAnomaly','o.eccentricity','v.body'];

	// register a new module
	var mod = new MKON.module('Mini-Map', 'Screen', id, req,

	//handle data function
	function() {   
		function drawEllipse(ctx, x0, y0, a, exc, lineWidth, color) {
			x0 += a * exc;
			var r = a * (1 - exc*exc)/(1 + exc)
			var x = x0 + r;
			var y = y0;
			ctx.beginPath();
			ctx.moveTo(x, y);
			var i = 0;
			var twoPi = 2 * Math.PI;
			while (i < twoPi) {
				r = a * (1 - exc*exc)/(1 + exc * Math.cos(i));
				x = x0 + r * Math.cos(i);
				y = y0 + r * Math.sin(i);
				ctx.lineTo(x, y);
				i += 0.01 * Math.PI;
			}
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = color;
			ctx.closePath();
			ctx.stroke();
		}
		
		//draw the ship icons
		function drawShip(ctx, x0, y0, a, exc, angle) {
			x0 += a * exc;
			var r = a * (1 - exc*exc)/(1 + exc * Math.cos(angle));
			var x = -10 + x0 + r * Math.cos(angle); //center icon on the line
			var y = -10 + y0 + r * Math.sin(angle); //center icon on the line
			ctx.drawImage(minimapicons,0,0,20,20,x,y,20,20);
		}
		
		//draw ap and pe icons
		function drawApAndPe(ctx,a) {
			//Pe
			x = a; //center icon
			y = -10; //center icon
			ctx.drawImage(minimapicons,0,40,20,20,x,y,20,20);
			//Ap
			x = -20 - a; //center icon
			y = -10; //center icon
			ctx.drawImage(minimapicons,0,20,20,20,x,y,20,20);
		}
		
		// I could use telemachus to get them but... 
		// It is much more simple like this...
		function getVBodyRadius(vbody) {
			var bodies = [["Sun",261600000],["Kerbin",600000],["Mun",200000],["Minmus",60000],["Eve",700000],["Gilly",13000],["Moho",250000],["Duna",320000],["Dres",138000],["Jool",6000000],["Laythe",500000],["Vall",300000],["Tylo",600000],["Bop",65000],["Pol",44000],["Eeloo",138000],["Ike",130000]];
			for (i = 0; i < bodies.length; i++) { 
				if (vbody === bodies[i][0]) {
					return bodies[i][1];
				}
			}
			return 0;
		}
		function getVBodyAtmo(vbody) {
			var bodies = [["Sun",0],["Kerbin",69077],["Mun",0],["Minmus",0],["Eve",96708],["Gilly",0],["Moho",0],["Duna",202650],["Dres",0],["Jool",138155],["Laythe",55262],["Vall",0],["Tylo",0],["Bop",0],["Pol",0],["Eeloo",0],["Ike",0]]; //data from the official wiki
			for (i = 0; i < bodies.length; i++) { 
				if (vbody === bodies[i][0]) {
					return bodies[i][1];
				}
			}
			return 0;
		}
		var t = $('#'+this.id);
		var maxradius=180; //this is the max radius of the drawn orbit.
	
		var Plane = document.getElementById("canvas"+this.id);
		var Context = Plane.getContext('2d');

		var apo = MKON.CONTENT.getVariable(req[0]);
		var per = MKON.CONTENT.getVariable(req[1]);
		var trueano = MKON.CONTENT.getVariable(req[2]);
		var ecc = MKON.CONTENT.getVariable(req[3]);
		var body = MKON.CONTENT.getVariable(req[4]);
		
		var bodyradius = getVBodyRadius(body);
		var bodyradiuswithatmo = bodyradius + (2*getVBodyAtmo(body));

		var ratio = (2*maxradius / (per + apo + (2*bodyradius))); //do not round this 
		var shipangle = -(trueano/190)* Math.PI; //in radians

		Context.save();
		//clear the context
		Context.clearRect(0,0,400,400);
		Context.translate(200,200);
			
		if (ecc < 1) { //The Orbit is closing... or at least not (hyper/para)boloid
			//Draw the Orbit
			drawEllipse(Context,0,0,maxradius,ecc,1,"YellowGreen"); 
			//Draw the body
			drawEllipse(Context,ecc*maxradius,0,bodyradius*ratio,0,0.5,"White");
			drawEllipse(Context,ecc*maxradius,0,bodyradiuswithatmo*ratio,0,0.1,"LightBlue");
			//Draw the Ship
			drawShip(Context,0,0,maxradius,ecc,shipangle);
			//Draw the cute Ap and Pe icons
			drawApAndPe(Context,maxradius);
			
			Context.fillStyle = "lightgrey";
			Context.font = "15pt BebasNeue";
			Context.translate(-200,-180);
			Context.fillText("ORBITING " + body,0,0);
		} else {
			Context.fillStyle = "lightgrey";
			Context.font = "15pt BebasNeue";
			Context.translate(-200,-180);
			Context.fillText("paraboloid orbits not yet implemented...",0,0);
		}
		Context.restore();
	}
	);

	// content for insertion to gridster
	// I need the canvas to have fixed height and width...
	// I load image there to avoid multiple loadings...
	var content =  '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="4" data-sizey="4">\
						<div class="options">\
							<div class="remove"><i class="fa fa-times"></i>\
							</div>\
						</div>\
						<div class="content">\
							<div class="mini-map screen">\
								<script>\
									minimapicons = new Image();\
									minimapicons.src = "./img/minimapicons.png";\
								</script>\
								<canvas class="mapcanvas" id="canvas'+ id + '" height="400" width="400"></canvas>\
								<h3>MINI-MAP</h3>\
								</div>\
							</div>\
						</div>\
					</li>';

	content = { html: content, x:4, y:4, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);
}