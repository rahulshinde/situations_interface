import * as THREE from 'three';

class LetterG {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		let cap1 = new THREE.Mesh( sphereGeometry, material );
		let cap2 = new THREE.Mesh( sphereGeometry, material );
		let cap3 = new THREE.Mesh( sphereGeometry, material );
		let cap4 = new THREE.Mesh( sphereGeometry, material );
		let cap5 = new THREE.Mesh( sphereGeometry, material );
		cap1.position.x = 10;
		cap1.position.y = 6;

		cap2.position.x = 10;
		cap2.position.y = -2;


		cap4.position.x = 10;
		cap4.position.z = 5;

		cap5.position.x = 15;


		// Path 1

		let line1 = new THREE.LineCurve(
			new THREE.Vector3( -10, -6, 0 ),
			new THREE.Vector3( -10, 6, 0 )
		)

		let curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, 6, 0 ),
			new THREE.Vector3( -10, 20, 0 ),
			new THREE.Vector3( 10, 20, 0  ),
			new THREE.Vector3( 10, 6, 0 )
		);

		let curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, -6, 0 ),
			new THREE.Vector3( -10, -20, 0 ),
			new THREE.Vector3( 10, -20, 0 ),
			new THREE.Vector3( 10, -6, 0 )
		)

		let line2 = new THREE.LineCurve(
			new THREE.Vector3( 10, -6, 0 ),
			new THREE.Vector3( 10, -2, 0 )
		)

		let geometryLine1 = new THREE.TubeGeometry( line1, 1, splineWidth, 15, false );
		let geometryLine2 = new THREE.TubeGeometry( line2, 1, splineWidth, 15, false );
		let geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );
		let geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );

		let line1mesh = new THREE.Mesh( geometryLine1, material );
		let line2mesh = new THREE.Mesh( geometryLine2, material );
		let curve1mesh = new THREE.Mesh( geometryCurve1, material );
		let curve2mesh = new THREE.Mesh( geometryCurve2, material );

		let stroke1 = new THREE.Group()
		stroke1.add( line1mesh );
		stroke1.add( line2mesh );
		stroke1.add( curve1mesh );
		stroke1.add( curve2mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );

		// Path 2

		const curve3 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 0, 0, 0),
			new THREE.Vector3( 0, -5, -5),
			new THREE.Vector3( 10, -5, -5 ),
			new THREE.Vector3( 10, 0, 5 )
		)

		let line3 = new THREE.LineCurve(
			new THREE.Vector3( 10, 0, 5 ),
			new THREE.Vector3( 15, 0, 0 )
		)

		let geometryCurve3 = new THREE.TubeGeometry( curve3, 60, splineWidth, 15, false );
		let geometryLine3 = new THREE.TubeGeometry( line3, 1, splineWidth, 15, false );


	
		let curve3mesh = new THREE.Mesh( geometryCurve3, material );
		let linemesh = new THREE.Mesh( geometryLine3, material );
		
		let stroke2 = new THREE.Group();
		stroke2.add( curve3mesh );
		stroke2.add( linemesh );
		stroke2.add( cap3 );
		stroke2.add( cap4 );
		stroke2.add( cap5);
		
		let letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;

		this.enter1 = cap2;
		this.exit1 = cap1;

		this.enter2 = cap3;
		this.exit2 = cap5;
	}
}

export { LetterG };