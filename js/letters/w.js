import * as THREE from 'three';

class LetterW {
	constructor(splineWidth, material){
		let sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		let cap1 = new THREE.Mesh( sphereGeometry, material );
		let cap2 = new THREE.Mesh( sphereGeometry, material );
		let cap3 = new THREE.Mesh( sphereGeometry, material );
		let cap4 = new THREE.Mesh( sphereGeometry, material );
		let cap5 = new THREE.Mesh( sphereGeometry, material );
		let cap6 = new THREE.Mesh( sphereGeometry, material );
		let cap7 = new THREE.Mesh( sphereGeometry, material );
		let cap8 = new THREE.Mesh( sphereGeometry, material );

		cap1.position.x = -4;
		cap1.position.y = -15;
		
		cap2.position.x = -12;
		cap2.position.y = 15;

		cap3.position.x = 4;
		cap3.position.y = -15;

		cap4.position.x = 12;
		cap4.position.y = 15;

		cap5.position.y = -15;
		cap5.position.z = 0;

		cap6.position.y = 10;
		cap6.position.z = -5;

		cap7.position.y = 5;
		cap7.position.z = -5;

		cap8.position.y = -10;

		// Path 1

		let line1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -12, 15, 0 ),
			new THREE.Vector3( -12, 15, 0 ),
			new THREE.Vector3( -10, 5, 0 ),
			new THREE.Vector3( -10, -5, 0 )
		)

		let curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, -5, 0 ),
			new THREE.Vector3( -10, -15, 0 ),
			new THREE.Vector3( -10, -15, 0  ),
			new THREE.Vector3( -4, -15, 0 )
		);


		let curve3 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 4, -15, 0 ),
			new THREE.Vector3( 4, -10, 5 ),
			new THREE.Vector3( -4, -10, 5  ),
			new THREE.Vector3( -4, -15, 0 )
		);

		let curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 4, -15, 0 ),
			new THREE.Vector3( 10, -15, 0 ),
			new THREE.Vector3( 10, -10, 0 ),
			new THREE.Vector3( 10, -5, 0 )
		);

		let line2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 10, -5, 0 ),
			new THREE.Vector3( 10, 5, 0 ),
			new THREE.Vector3( 12, 15, 0 ),
			new THREE.Vector3( 12, 15, 0 )
		)


		let geometryLine1 = new THREE.TubeGeometry( line1, 60, splineWidth, 15, false );
		let geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );
		let geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );
		let geometryCurve3 = new THREE.TubeGeometry( curve3, 60, splineWidth, 15, false );
		let geometryLine2 = new THREE.TubeGeometry( line2, 60, splineWidth, 15, false );

		let line1mesh = new THREE.Mesh( geometryLine1, material );
		let line2mesh = new THREE.Mesh( geometryLine2, material );
		let curve1mesh = new THREE.Mesh( geometryCurve1, material );
		let curve2mesh = new THREE.Mesh( geometryCurve2, material );
		let curve3mesh = new THREE.Mesh( geometryCurve3, material );


		let stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( line1mesh );
		stroke1.add( line2mesh );
		stroke1.add( curve2mesh );
		stroke1.add( curve3mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );
		stroke1.add( cap3 );
		stroke1.add( cap4 );

		// Path 2

		let line3 = new THREE.LineCurve(
			new THREE.Vector3( 0, 10, -5 ),
			new THREE.Vector3( 0, 5, -5 )
		)

		let curve4 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 0, 5, -5 ),
			new THREE.Vector3( 5, 0, -5 ),
			new THREE.Vector3( 5, -5, -5),
			new THREE.Vector3( 0, -10, 0)
		);

		let line4 = new THREE.LineCurve(
			new THREE.Vector3( 0, -10, 0 ),
			new THREE.Vector3( 0, -15, 0 )
		);

		let geometryLine3 = new THREE.TubeGeometry( line3, 1, splineWidth, 15, false );
		let geometryCurve4 = new THREE.TubeGeometry( curve4, 60, splineWidth, 15, false );
		let geometryLine4 = new THREE.TubeGeometry( line4, 1, splineWidth, 15, false );

		let line3mesh = new THREE.Mesh( geometryLine3, material );
		let curve4mesh = new THREE.Mesh( geometryCurve4, material );
		let line4mesh = new THREE.Mesh( geometryLine4, material );

		// 
		let stroke2 = new THREE.Group();
		stroke2.add( line3mesh );
		stroke2.add( curve4mesh );
		stroke2.add( line4mesh );
		stroke2.add( cap5 );
		stroke2.add( cap6 );
		stroke2.add( cap7 );
		stroke2.add( cap8 );
		
		let letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;
	}
}

export { LetterW };