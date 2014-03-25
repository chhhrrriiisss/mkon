// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;

// custom global variables
var mesh;

initSphere();
animate();

// FUNCTIONS 		
function initSphere() 
{
	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	var VIEW_ANGLE = 25, ASPECT = 400 / 400, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,0,-300);
	
	camera.lookAt(scene.position);	
	camera.rotation.z = 0;

	// RENDERER
	if ( Detector.webgl ) {
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	}
	else

	renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(300, 300);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );

	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,2000,0);
	scene.add(light);

	var r = 50;

		// Sphere parameters: radius, segments along width, segments along height.
	var geometry = new THREE.SphereGeometry(r,60,60);

	var texture = THREE.ImageUtils.loadTexture('img/navballTexture.png');		

	// var material = new THREE.MeshPhongMaterial({
	// 										map: texture,
	// 										specular: 0x222222,
	// 										shininess: 100
	// 									});



		// to help orient
	var N = new THREE.Vector3(0, r, 0);
	var S1 = new THREE.Vector3(0.01, -r, 0);
	var S2 = new THREE.Vector3(-0.01, -r, 0);
	var S3 = new THREE.Vector3(0, -r, 0.01);
	var S4 = new THREE.Vector3(0, -r, -0.01);
	var E = new THREE.Vector3(r, 0, 0);
	var W1 = new THREE.Vector3(-r, 0, 0.01);
	var W2 = new THREE.Vector3(-r, 0, -0.01);	
	drawCurve( createSphereArc(N,S1), new THREE.Color(0x0000ff) );
	drawCurve( createSphereArc(N,S2), new THREE.Color(0x0000ff) );
	drawCurve( createSphereArc(N,S3), new THREE.Color(0xff0000) );
	drawCurve( createSphereArc(N,S4), new THREE.Color(0xff0000) );
	drawCurve( createSphereArc(E,W1), new THREE.Color(0x00ff00) );
	drawCurve( createSphereArc(E,W2), new THREE.Color(0x00ff00) );

	// draw lines from mesh vertices to sphere
	for (var i=0; i < mesh2.geometry.vertices.length; i++)
	{
		var origin = mesh2.geometry.vertices[i].clone();
		var proj   = projectOntoMesh( origin, sphere );
		drawLine( origin, proj, new THREE.Color(0xffcc00), true ); 
	}
		
	// create a non-repeating array of edges
	var edgeArray = [];
	for (var i=0; i < mesh2.geometry.faces.length; i++)
	{
		var face = mesh2.geometry.faces[i];
		// indices of vertices on the face
		var iva = face['a'];
		var ivb = face['b'];
		var ivc = face['c'];
		// vertices on the face
		var va  = mesh2.geometry.vertices[iva];
		var vb  = mesh2.geometry.vertices[ivb];
		var vc  = mesh2.geometry.vertices[ivc];
		
		addEdgeToArray( edgeArray, [va,vb] );
		addEdgeToArray( edgeArray, [vb,vc] );
		
		if (face instanceof THREE.Face3)
		{
			addEdgeToArray( edgeArray, [vc,va] );
		}
		else
		{
			var ivd = face['d'];
			var vd  = mesh2.geometry.vertices[ivd];
			addEdgeToArray( edgeArray, [vc,vd] );
			addEdgeToArray( edgeArray, [vd,va] );
		}
	}
	
	// draw arc for each projected mesh edge
	for (var i = 0; i < edgeArray.length; i++)
	{
		var P = projectOntoMesh( edgeArray[i][0], sphere );
		var Q = projectOntoMesh( edgeArray[i][1], sphere );
		drawCurve( createSphereArc(P,Q), new THREE.Color(0xffff00) );
	}





		var material = new THREE.MeshLambertMaterial( { color: 0x888888 } );

		//var material = new THREE.MeshBasicMaterial({map: texture});

	this.sphere = new THREE.Mesh( geometry, material );

	scene.add(sphere);


	function radToDeg(val) {


		val = val * (180 / Math.PI);
		return -val;		
	}

	function degToRad(val) {
		var rads = val * (Math.PI / 180);
		return rads;
	}


	euler = new THREE.Euler(
			degToRad(270), // pitch
			degToRad(0), // heading
			degToRad(0), // roll
			'ZXY'
	);

	sphere.rotation.copy(euler);





} 


////////////////////////////////////////
// some methods to create a set of edges

// e1 = [a1, b1]; e2 = [a2, b2].
// e1 == e2 iff {a1,b1} = {a2,b2}.
function edgeEquals( e1, e2 )
{
    return ( e1[0].equals(e2[0]) && e1[1].equals(e2[1]) ) 
	    || ( e1[0].equals(e2[1]) && e1[1].equals(e2[0]) );
}

function arrayContainsEdge( array, edge )
{
	for (var i = 0; i < array.length; i++ )
		if (edgeEquals( array[i], edge )) return true;
	
	return false;
}

function addEdgeToArray( array, edge )
{
	if ( !arrayContainsEdge(array, edge) )
		array.push( edge );
}

// some methods to create and draw great circles on a sphere

function greatCircleFunction(P, Q)
{
	var angle = P.angleTo(Q);
	return function(t)
	{
	    var X = new THREE.Vector3().addVectors(
			P.clone().multiplyScalar(Math.sin( (1 - t) * angle )), 
			Q.clone().multiplyScalar(Math.sin(      t  * angle )))
			.divideScalar( Math.sin(angle) );
	    return X;
	};
}

function createSphereArc(P,Q)
{
	var sphereArc = new THREE.Curve();
	sphereArc.getPoint = greatCircleFunction(P,Q);
	return sphereArc;
}

function drawCurve(curve, color)
{
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices = curve.getPoints(100);
	lineGeometry.computeLineDistances();
	var lineMaterial = new THREE.LineBasicMaterial();
	lineMaterial.color = color;
	var line = new THREE.Line( lineGeometry, lineMaterial );
	scene.add(line);
}

function drawLine(P,Q, color, dashed)
{
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push( P, Q );
	lineGeometry.computeLineDistances();
	if ( dashed === undefined || !dashed )
		var lineMaterial = new THREE.LineBasicMaterial();
	else // dashed = true
		var lineMaterial = new THREE.LineDashedMaterial( { dashSize: 2, gapSize: 2 } );
	lineMaterial.color = color;
	var line = new THREE.Line( lineGeometry, lineMaterial );
	scene.add(line);
}	

// draw a ray from point to origin and return point of intersection with mesh
function projectOntoMesh(point, mesh)
{
	var origin = point.clone();
	var direction = point.clone().multiplyScalar(-1);
	var ray = new THREE.Raycaster( origin, direction.normalize() );
	var intersection = ray.intersectObject( mesh );
	if ( intersection.length > 0 )
		return intersection[ 0 ].point;
	else
		// console.log( "No intersection?" );
		return null;
}

function animate() 
{
	
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{

}

function render() 
{	
	renderer.render( scene, camera );
}

