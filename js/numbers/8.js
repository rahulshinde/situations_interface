import * as THREE from 'three';

class Number8 {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		
		const cap1 = new THREE.Mesh( sphereGeometry, material );
		const cap2 = new THREE.Mesh( sphereGeometry, material );
		const cap3 = new THREE.Mesh( sphereGeometry, material );
		const cap4 = new THREE.Mesh( sphereGeometry, material );

		cap1.position.x = 8;
		cap1.position.y = 5;
		cap1.position.z = 0;

		cap2.position.x = -8;
		cap2.position.y = 5;
		cap2.position.z = 0;

		cap3.position.x = 9;
		cap3.position.y = -8;
		cap3.position.z = 0;

		cap4.position.x = -9;
		cap4.position.y = -8;
		cap4.position.z = 0;

		// Path 1 top

		const curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 8, 5, 0 ),
			new THREE.Vector3( 8, 18, -5),
			new THREE.Vector3( -8, 18, 5 ),
			new THREE.Vector3( -8, 5, 0 )
		)

		let curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 8, 5, 0 ),
			new THREE.Vector3( 8, -5, 5),
			new THREE.Vector3( -8, -5, -5 ),
			new THREE.Vector3( -8, 5, 0 )
		);


		const geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );
		const curve1mesh = new THREE.Mesh( geometryCurve1, material );

		const geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );
		const curve2mesh = new THREE.Mesh( geometryCurve2, material );
		
		const stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( curve2mesh );

		stroke1.add( cap1 );
		stroke1.add( cap2 );

		// Path 2 bottom
		const curve3 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 9, -8, 0 ),
			new THREE.Vector3( 9, 2, -5),
			new THREE.Vector3( -9, 2, 5 ),
			new THREE.Vector3( -9, -8, 0 )
		)

		let curve4 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 9, -8, 0 ),
			new THREE.Vector3( 9, -20, 5),
			new THREE.Vector3( -9, -20, -5 ),
			new THREE.Vector3( -9, -8, 0 )
		);

		const geometryCurve3 = new THREE.TubeGeometry( curve3, 60, splineWidth, 15, false );
		const curve3mesh = new THREE.Mesh( geometryCurve3, material );

		const geometryCurve4 = new THREE.TubeGeometry( curve4, 60, splineWidth, 15, false );
		const curve4mesh = new THREE.Mesh( geometryCurve4, material );
		
		const stroke2 = new THREE.Group();
		stroke2.add( curve3mesh );
		stroke2.add( curve4mesh );
		stroke2.add( cap3 );
		stroke2.add( cap4 );
		
		const letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;
	}
}

export { Number8 };