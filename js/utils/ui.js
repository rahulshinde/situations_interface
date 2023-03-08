import * as sceneBuilder from './sceneBuilder.js'

export function initUi(){
	document.querySelectorAll('.character').forEach((char) =>{
		char.addEventListener('click', () => {
			sceneBuilder.addLetter(char.dataset.character);
		})
	});
}