import * as THREE from 'three';

class LetterX {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		
		const cap1 = new THREE.Mesh( sphereGeometry, material );
		const cap2 = new THREE.Mesh( sphereGeometry, material );
		const cap3 = new THREE.Mesh( sphereGeometry, material );
		const cap4 = new THREE.Mesh( sphereGeometry, material );
		cap1.position.x = -10;
		cap1.position.y = 15;

		cap2.position.x = 10;
		cap2.position.y = 15;

		cap3.position.x = -10;
		cap3.position.y = -15;

		cap4.position.x = 10;
		cap4.position.y = -15;


		// Path 1

		const curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, 15, 0 ),
			new THREE.Vector3( -10, -9, 6 ),
			new THREE.Vector3( 10, -9, -6  ),
			new THREE.Vector3( 10, 15, 0 )
		);


		const geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );

		const curve1mesh = new THREE.Mesh( geometryCurve1, material );

		const stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );

		// Path 2
		const curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, -15, 0 ),
			new THREE.Vector3( -10, 9, -6 ),
			new THREE.Vector3( 10, 9, 6 ),
			new THREE.Vector3( 10, -15, 0 )
		)

		const geometryCurve2 = new THREE.TubeGeometry( curve2, 60, splineWidth, 15, false );
		const curve2mesh = new THREE.Mesh( geometryCurve2, material );
		
		const stroke2 = new THREE.Group();
		stroke2.add( curve2mesh );
		stroke2.add( cap3 );
		stroke2.add( cap4 );
		
		const letter = new THREE.Group();
		
		letter.add(stroke1);
		letter.add(stroke2);

		this.path = letter;
	}
}

export { LetterX };