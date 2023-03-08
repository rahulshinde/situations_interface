import * as THREE from 'three';

class SymbolParenthesesR {
	constructor(splineWidth, material){
		const sphereGeometry = new THREE.SphereGeometry( splineWidth, 10, 10 );
		let cap1 = new THREE.Mesh( sphereGeometry, material );
		let cap2 = new THREE.Mesh( sphereGeometry, material );
		// let cap6 = new THREE.Mesh( sphereGeometry, material );

		cap1.position.x = -10;
		cap1.position.y = 20;

		cap2.position.x = -10;
		cap2.position.y = -20;


		// Path 1

		let curve1 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -10, 20, 0 ),
			new THREE.Vector3( 10, 20, 0 ),
			new THREE.Vector3( 10, -20, 0  ),
			new THREE.Vector3( -10, -20, 0 )
		);

		let geometryCurve1 = new THREE.TubeGeometry( curve1, 60, splineWidth, 15, false );

		let curve1mesh = new THREE.Mesh( geometryCurve1, material );

		let stroke1 = new THREE.Group()
		stroke1.add( curve1mesh );
		stroke1.add( cap1 );
		stroke1.add( cap2 );
		
		let letter = new THREE.Group();
		
		letter.add(stroke1);

		this.path = letter;
	}
}

export { SymbolParenthesesR };