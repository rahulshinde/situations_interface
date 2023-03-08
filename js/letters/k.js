import * as THREE from 'three';

class LetterK {
	constructor(splineWidth, material){
		let sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		let cap1 = new THREE.Mesh( sphereGeometry, material );
		let cap2 = new THREE.Mesh( sphereGeometry, material );
		let cap3 = new THREE.Mesh( sphereGeometry, material );
		let cap4 = new THREE.Mesh( sphereGeometry, material );
		let cap5 = new THREE.Mesh( sphereGeometry, material );
		let cap6 = new THREE.Mesh( sphereGeometry, material );
		cap1.position.x = -13;
		cap1.position.y = -10;
		cap2.position.x = 10;
		cap2.position.y = 15;
		cap3.position.z = -5;
		cap4.position.x = 15;
		cap4.position.y = -15;

		// Path 1


		let curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -13, -10, 0 ),
			new THREE.Vector3( -13, -16, 0 ),
			new THREE.Vector3( -6, -16, 0  ),
			new THREE.Vector3( -6, -10, 0 )
		);

		let line1 = new THREE.LineCurve(
			new THREE.Vector3( -6, -10, 0 ),
			new THREE.Vector3( -6, 10, 0 )
		)

		let curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -6, 10, 0 ),
			new THREE.Vector3( -6, 16, 0 ),
			new THREE.Vector3( -13, 16, 0  ),
			new THREE.Vector3( -13, 10, 0 )
		);

		let line2 = new THREE.LineCurve(
			new THREE.Vector3( -13, 10, 0 ),
			new THREE.Vector3( -13, 5, 0 )
		)

		let curve3 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -13, 5, 0 ),
			new THREE.Vector3( -13, 0, 0 ),
			new THREE.Vector3( -10, 0, 5  ),
			new THREE.Vector3( -6, 0, 5 )
		);

		let line3 = new THREE.LineCurve(
			new THREE.Vector3( -6, 0, 5 ),
			new THREE.Vector3( 0, 0, 5 )
		)

		let curve4 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 0, 0, 5 ),
			new THREE.Vector3( 10, 0, 5 ),
			new THREE.Vector3( 10, 10, 0),
			new THREE.Vector3( 10, 15, 0)
		);

		let geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );
		let geometryLine1 = new THREE.TubeGeometry( line1, 1, splineWidth, 15, false );
		let geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );
		let geometryLine2 = new THREE.TubeGeometry( line2, 1, splineWidth, 15, false );
		let geometryCurve3 = new THREE.TubeGeometry( curve3, 60, splineWidth, 15, false );
		let geometryLine3 = new THREE.TubeGeometry( line3, 1, splineWidth, 15, false );
		let geometryCurve4 = new THREE.TubeGeometry( curve4, 60, splineWidth, 15, false );

		let line1mesh = new THREE.Mesh( geometryLine1, material );
		let curve1mesh = new THREE.Mesh( geometryCurve1, material );
		let curve2mesh = new THREE.Mesh( geometryCurve2, material );
		let curve3mesh = new THREE.Mesh( geometryCurve3, material );
		let curve4mesh = new THREE.Mesh( geometryCurve4, material );
		let line2mesh = new THREE.Mesh( geometryLine2, material );
		let line3mesh = new THREE.Mesh( geometryLine3, material );

		let stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( line1mesh );
		stroke1.add( curve2mesh );
		stroke1.add( curve3mesh );
		stroke1.add( line2mesh );
		stroke1.add( line3mesh );
		stroke1.add( curve4mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );

		// Path 2

    let curve5 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 0, 0, -5 ),
			new THREE.Vector3( 0, -10, 0 ),
			new THREE.Vector3( 5, -15, 0),
			new THREE.Vector3( 15, -15, 0)
		);
		

		let geometryCurve5 = new THREE.TubeGeometry( curve5, 60, splineWidth, 15, false );
		let curve5mesh = new THREE.Mesh( geometryCurve5, material );

		// 
		let stroke2 = new THREE.Group();
		stroke2.add( curve5mesh );
		stroke1.add( cap3 );
		stroke2.add( cap4 );
		
		let letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;
	}
}

export { LetterK };