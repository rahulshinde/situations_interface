import * as THREE from 'three';

class SymbolBracketR {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		let cap1 = new THREE.Mesh( sphereGeometry, material );
		let cap2 = new THREE.Mesh( sphereGeometry, material );
		let cap3 = new THREE.Mesh( sphereGeometry, material );
		let cap4 = new THREE.Mesh( sphereGeometry, material );
		// let cap6 = new THREE.Mesh( sphereGeometry, material );

		cap1.position.x = 10;
		cap1.position.y = 15;

		cap2.position.x = 10;
		cap2.position.y = -15;

		cap3.position.x = -10;
		cap3.position.y = 15;

		cap4.position.x = -10;
		cap4.position.y = -15;


		// Path 1

		let line1 = new THREE.LineCurve(
			new THREE.Vector3( 10, 15, 0 ),
			new THREE.Vector3( 10, -15, 0 )
		);

		let line2 = new THREE.LineCurve(
			new THREE.Vector3( 10, -15, 0 ),
			new THREE.Vector3( -10, -15, 0 )
		);

		let line3 = new THREE.LineCurve(
			new THREE.Vector3( -10, 15, 0 ),
			new THREE.Vector3( 10, 15, 0 )
		);

		let geometryLine1 = new THREE.TubeGeometry( line1, 1, splineWidth, 15, false );
		let geometryLine2 = new THREE.TubeGeometry( line2, 1, splineWidth, 15, false );
		let geometryLine3 = new THREE.TubeGeometry( line3, 1, splineWidth, 15, false );

		let line1mesh = new THREE.Mesh( geometryLine1, material );
		let line2mesh = new THREE.Mesh( geometryLine2, material );
		let line3mesh = new THREE.Mesh( geometryLine3, material );

		let stroke1 = new THREE.Group()
		stroke1.add( line1mesh );
		stroke1.add( line2mesh );
		stroke1.add( line3mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );
		stroke1.add( cap3 );
		stroke1.add( cap4 );
		
		let letter = new THREE.Group();
		
		letter.add(stroke1);

		this.path = letter;
	}
}

export { SymbolBracketR };