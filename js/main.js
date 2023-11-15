import * as THREE from 'three';

import * as sceneBuilder from './utils/sceneBuilder.js'
import * as ui from './utils/ui.js'

function init(){
	sceneBuilder.initScene();
	ui.initUi();
	// interfaceEventHandlers();
}

function loading(){
	if (THREE){
		document.body.classList.add('loaded');
		init();
	} else {
		setTimeout(loading, 500);
	}
}

setTimeout(loading, 1250);