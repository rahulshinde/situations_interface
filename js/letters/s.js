import * as THREE from 'three';

class LetterS {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		
		const cap1 = new THREE.Mesh( sphereGeometry, material );
		const cap2 = new THREE.Mesh( sphereGeometry, material );
		const cap3 = new THREE.Mesh( sphereGeometry, material );
		const cap4 = new THREE.Mesh( sphereGeometry, material );
		const cap5 = new THREE.Mesh( sphereGeometry, material );
		cap1.position.x = -8;
		cap1.position.y = -2;

		cap2.position.x = 10;
		cap2.position.y = 12;
		cap2.position.z = -5;

		cap3.position.x = 10;
		cap3.position.y = 5;


		cap4.position.x = 12;
		cap4.position.y = 5;
		cap4.position.z = 5;

		cap5.position.x = -8;
		cap5.position.y = -12;
		cap5.position.z = 0;


		// Path 1

		const curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -8, -2, 0 ),
			new THREE.Vector3( -15, 8, 5 ),
			new THREE.Vector3( -6, 20, -5  ),
			new THREE.Vector3( 10, 12, -5 )
		);

		let line1 = new THREE.LineCurve(
			new THREE.Vector3( -8, -2, 0 ),
			new THREE.Vector3( 10, 5, 0 ),
		);


		const geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );
		let geometryLine1 = new THREE.TubeGeometry( line1, 1, splineWidth, 15, false );


		let line1mesh = new THREE.Mesh( geometryLine1, material );
		const curve1mesh = new THREE.Mesh( geometryCurve1, material );

		const stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( line1mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );
		stroke1.add( cap3 );

		// Path 2
		const curve2 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 12, 5, 5 ),
			new THREE.Vector3( 18, -5, 5 ),
			new THREE.Vector3( 8, -18, 0 ),
			new THREE.Vector3( -8, -12, 0 )
		)

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

		this.exit1 = [10, 12, -5];
		this.exit2 = [12, 5, 5];
	}
}

export { LetterS };