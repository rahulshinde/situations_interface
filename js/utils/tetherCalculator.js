export function calculatePosition (origin, transformation){
	let x = origin[0];
	let y = origin[1];
	let z = origin[2];

	return {
		'x': x + transformation.x, 
		'y': y + transformation.y,
		'z': z + transformation.z
	};
}

export function calculateDisplacement(exit, enter){
	return {
		'x': randomInteger(exit.x, enter.x), 
		'y': randomInteger(exit.y, enter.y),
		'z': randomInteger(exit.z, enter.z)
	}
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}