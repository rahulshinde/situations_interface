import * as THREE from 'three';

class LetterF {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		let cap1 = new THREE.Mesh( sphereGeometry, material );
		let cap2 = new THREE.Mesh( sphereGeometry, material );
		let cap3 = new THREE.Mesh( sphereGeometry, material );
		let cap4 = new THREE.Mesh( sphereGeometry, material );
		let cap5 = new THREE.Mesh( sphereGeometry, material );

		cap1.position.x = -10;
		cap1.position.y = -15;

		cap2.position.x = 10;
		cap2.position.y = 6;

		cap3.position.x = -15;
		cap3.position.y = 0;

		cap4.position.z = 5;

		cap5.position.x = 5;

		// Path 1

		let line1 = new THREE.LineCurve(
			new THREE.Vector3( -10, -15, 0 ),
			new THREE.Vector3( -10, 6, 0 )
		)

		let curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, 6, 0 ),
			new THREE.Vector3( -10, 20, 0 ),
			new THREE.Vector3( 10, 20, 0  ),
			new THREE.Vector3( 10, 6, 0 )
		);

		let geometryLine1 = new THREE.TubeGeometry( line1, 1, splineWidth, 15, false );
		let geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );

		let line1mesh = new THREE.Mesh( geometryLine1, material );
		let curve1mesh = new THREE.Mesh( geometryCurve1, material );

		let stroke1 = new THREE.Group()
		stroke1.add( line1mesh );
		stroke1.add( curve1mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );

		// Path 2

		const curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -15, 0, 0),
			new THREE.Vector3( -15, 10, -5),
			new THREE.Vector3( 0, 10, -5 ),
			new THREE.Vector3( 0, 0, 5 )
		)

		let line2 = new THREE.LineCurve(
			new THREE.Vector3( 0, 0, 5 ),
			new THREE.Vector3( 5, 0, 0 )
		)

		let geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );
		let geometryLine2 = new THREE.TubeGeometry( line2, 1, splineWidth, 15, false );


	
		let curve2mesh = new THREE.Mesh( geometryCurve2, material );
		let line2mesh = new THREE.Mesh( geometryLine2, material );

		
		let stroke2 = new THREE.Group();
		stroke2.add( curve2mesh );
		stroke2.add( line2mesh );
		stroke2.add( cap3 );
		stroke2.add( cap4 );
		stroke2.add( cap5 );
		
		let letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;
	}
}

export { LetterF };