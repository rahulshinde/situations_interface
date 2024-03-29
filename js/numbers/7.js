import * as THREE from 'three';

class Number7 {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		
		const cap1 = new THREE.Mesh( sphereGeometry, material );
		const cap2 = new THREE.Mesh( sphereGeometry, material );
		const cap3 = new THREE.Mesh( sphereGeometry, material );
		const cap4 = new THREE.Mesh( sphereGeometry, material );
		const cap5 = new THREE.Mesh( sphereGeometry, material );

		cap1.position.x = -10;
		cap1.position.y = 15;
		cap1.position.z = 0;

		cap2.position.x = 10;
		cap2.position.y = 15;
		cap2.position.z = 0;

		cap3.position.x = -8;
		cap3.position.y = -15;
		cap3.position.z = 0;

		cap4.position.x = -10;
		cap4.position.y = 0;
		cap4.position.z = 0;

		cap5.position.x = 10;
		cap5.position.y = 0;
		cap5.position.z = 0;


		// Path 1 top

		const curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, 15, 0 ),
			new THREE.Vector3( -10, 10, 0 ),
			new THREE.Vector3( 5, 10, 0 ),
			new THREE.Vector3( 10, 15, 0 )
		);

		let line1 = new THREE.LineCurve(
			new THREE.Vector3( 10, 15, 0 ),
			new THREE.Vector3( -8, -15, 0 )
		);


		const geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );
		const geometryLine1 = new THREE.TubeGeometry( line1, 1, splineWidth, 15, false );

		const curve1mesh = new THREE.Mesh( geometryCurve1, material );
		const line1mesh = new THREE.Mesh( geometryLine1, material );

		const stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( line1mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );
		stroke1.add( cap3 );

		// Path 2 bottom
		const curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, 0, 0),
			new THREE.Vector3( -10, 2, 5 ),
			new THREE.Vector3( 0, 2, 5 ),
			new THREE.Vector3( 10, 0, 0 )
		);

		const geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );
		const curve2mesh = new THREE.Mesh( geometryCurve2, material );
		
		const stroke2 = new THREE.Group();
		stroke2.add( curve2mesh );
		stroke2.add( cap4 );
		stroke2.add( cap5 );
		
		const letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;

		this.enter1 = cap1;
		this.exit1 = cap3;

		this.enter2 = cap4;
		this.exit2 = cap5;
	}
}

export { Number7 };