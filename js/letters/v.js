import * as THREE from 'three';

class LetterV {
	constructor(splineWidth, material){
		let sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		let cap1 = new THREE.Mesh( sphereGeometry, material );
		let cap2 = new THREE.Mesh( sphereGeometry, material );
		let cap3 = new THREE.Mesh( sphereGeometry, material );
		let cap4 = new THREE.Mesh( sphereGeometry, material );
		let cap5 = new THREE.Mesh( sphereGeometry, material );
		let cap6 = new THREE.Mesh( sphereGeometry, material );

		cap1.position.x = -12;
		cap1.position.y = 15;
		
		cap2.position.x = -5;
		cap2.position.y = -5;

		cap3.position.x = 0;
		cap3.position.y = -15;
		cap3.position.z = 5;

		cap4.position.x = 12;
		cap4.position.y = 15;

		cap5.position.x = 5;
		cap5.position.y = -5;

		cap6.position.x = 0;
		cap6.position.y = -15;
		cap6.position.z = -5;

		// Path 1

		let line1 = new THREE.LineCurve(
			new THREE.Vector3( -12, 15, 0 ),
			new THREE.Vector3( -5, -5, 0 )
		)

		let curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -5, -5, 0 ),
			new THREE.Vector3( -5, -8, 0 ),
			new THREE.Vector3( -5, -15, 5  ),
			new THREE.Vector3( 0, -15, 5 )
		);


		let geometryLine1 = new THREE.TubeGeometry( line1, 60, splineWidth, 15, false );
		let geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );

		let line1mesh = new THREE.Mesh( geometryLine1, material );
		let curve1mesh = new THREE.Mesh( geometryCurve1, material );


		let stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( line1mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );
		stroke1.add( cap3 );

		// Path 2

		let curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 0, -15, -5 ),
			new THREE.Vector3( 5, -15, -5),
			new THREE.Vector3( 5, -8, 0 ),
			new THREE.Vector3( 5, -5, 0 )
		);

		let line2 = new THREE.LineCurve(
			new THREE.Vector3( 5, -5, 0 ),
			new THREE.Vector3( 12, 15, 0 )
		);

		let geometryLine2 = new THREE.TubeGeometry( line2, 60, splineWidth, 15, false );
		let geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );

		let line2mesh = new THREE.Mesh( geometryLine2, material );
		let curve2mesh = new THREE.Mesh( geometryCurve2, material );

		// 
		let stroke2 = new THREE.Group();
		stroke2.add( line2mesh );
		stroke2.add( curve2mesh );
		stroke2.add( cap4 );
		stroke2.add( cap5 );
		stroke2.add( cap6 );
		
		let letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;
	}
}

export { LetterV };