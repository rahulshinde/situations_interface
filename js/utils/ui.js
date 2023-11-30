import * as sceneBuilder from './sceneBuilder.js'

export function initUi(){
	document.querySelectorAll('.character').forEach((char) =>{
		char.addEventListener('click', () => {
			sceneBuilder.addLetter(char.dataset.character);
		})
	});

	document.querySelectorAll('.background_image_style').forEach((control) => {
		control.addEventListener('click', function(e){
			setBackgroundStyle(e.target.id);
		})
	});

	document.querySelectorAll('.background_img').forEach((control) => {
		control.addEventListener('click', function(e){
			setBackground(e.target.innerHTML);
		})
	});

	document.getElementById('remove_image').addEventListener('click', clearBackgroundImage);
	document.getElementById('toggle_grid').addEventListener('click', sceneBuilder.toggleGrid);
	document.getElementById('hide_ui').addEventListener('click', hideUI);
	document.getElementById('show_ui').addEventListener('click', undoHiddenUI);

	document.getElementById('upload').addEventListener('change', readUrl);
	document.getElementById('remove_group').addEventListener('click', clearTransformGroup)
	document.getElementById('align_letters').addEventListener('click', function(){
		alignLetters('horizontal')
	});
	document.getElementById('align_letters_v').addEventListener('click', function(){
		alignLetters('vertical')
	});
	document.getElementById('align_letters_grid').addEventListener('click', function(){
		alignLetters('grid')
	});

	document.getElementById('width').addEventListener('change', updateSplineWidth);
	document.getElementById('toggle_tether').addEventListener('click', toggleTether);

	document.getElementById('dismiss_info').addEventListener('click', dismissInfo);
	document.getElementById('show_info').addEventListener('click', showInfo);

	updateSplineWidth();

	// random number between 1 and 6
	let random = Math.floor(Math.random() * 6) + 1;
	setBackground(random);

	// prev slide next slide 
	document.getElementById('prev_slide').addEventListener('click', previousSlide);
	document.getElementById('next_slide').addEventListener('click', nextSlide);
}

export function createUiCharacterControl(character, name){
	let div = document.createElement("div");
  div.id = name;
  div.className = "scene_character";

	let span = document.createElement("span");
	span.innerHTML = character;
	span.className = 'character_span'
	div.appendChild(span);
	
	let button = document.createElement("button");
	button.className = 'delete_character character_button'
  div.appendChild(button);
  button.innerHTML = 'x'
  button.addEventListener('click', deleteCharacterControl);

  let group_select = document.createElement("button");
	group_select.className = 'group_select group_button character_button'
  group_select.innerHTML = ''
  div.appendChild(group_select);

  group_select.addEventListener('click', (e) => {
		let scene_character = e.target.closest('.scene_character');
  	addCharacterToTransformGroup(scene_character);
  });

  let group_deselect = document.createElement("button");
  group_deselect.setAttribute("disabled", "");
	group_deselect.className = 'group_deselect group_button character_button'
  group_deselect.innerHTML = ''
  div.appendChild(group_deselect);

	let character_coordinates = document.createElement("div");
	character_coordinates.className = 'character_coordinates_wrapper'

	let character_position_label = document.createElement("div");
	character_position_label.className = 'character_label'
	character_position_label.innerHTML = 'Position'

	let character_position = document.createElement("div");
	character_position.className = 'character_position'

	let character_rotation_label = document.createElement("div");
	character_rotation_label.className = 'character_label'
	character_rotation_label.innerHTML = 'Rotation'

	let character_rotation = document.createElement("div");
	character_rotation.className = 'character_rotation'

	let character_scale_label = document.createElement("div");
	character_scale_label.className = 'character_label'
	character_scale_label.innerHTML = 'Scale'

	let character_scale = document.createElement("div");
	character_scale.className = 'character_scale'

	character_coordinates.appendChild(character_position_label);
	character_coordinates.appendChild(character_position);
	character_coordinates.appendChild(character_rotation_label);
	character_coordinates.appendChild(character_rotation);
	character_coordinates.appendChild(character_scale_label);
	character_coordinates.appendChild(character_scale);
	
	div.appendChild(character_coordinates);

  group_deselect.addEventListener('click', (e) => {
		let scene_character = event.target.closest('.scene_character');
  	removeCharacterFromTransformGroup(scene_character);
  });

	document.getElementById('scene_characters').appendChild(div);
}

export function disableScale(){
	document.getElementById('scale').setAttribute('disabled', '');
}

export function enableScale(){
	document.getElementById('scale').removeAttribute('disabled');
}

export function deleteCharacterControl(event){
	let scene_character = event.target.closest('.scene_character');
	sceneBuilder.deleteLetter(scene_character);
	scene_character.remove();
}

export function addCharacterToTransformGroup(scene_character){
	scene_character.classList.add('in_group');
	document.getElementById('scene_characters').classList.add('group');
	document.getElementById('remove_group').removeAttribute('disabled');
	scene_character.querySelector('.delete_character').setAttribute('disabled', '');
	scene_character.querySelector('.group_deselect').removeAttribute('disabled');
	sceneBuilder.addObjectToTransformControlsGroup(scene_character.id);
}

export function removeCharacterFromTransformGroup(scene_character){
	disableSceneCharacterGroupControls(scene_character);
	sceneBuilder.removeObjectFromTransformControlsGroup(scene_character.id, true);
}

export function disableSceneCharacterGroupControls(scene_character){
	scene_character.classList.remove('in_group');
	scene_character.querySelector('.group_deselect').setAttribute('disabled', '');
	scene_character.querySelector('.delete_character').removeAttribute('disabled');
	
}

export function clearTransformGroup(){
	document.getElementById('scene_characters').classList.remove('group');
	document.getElementById('remove_group').setAttribute('disabled', '');
	sceneBuilder.removeTransformControlsGroup();
}

export function setTransformMode(transformControl, mode){
	transformControl.mode = mode;
	document.querySelector('.transform_control.selected').classList.remove('selected');
	document.getElementById(mode).classList.add('selected');
}

function clearBackgroundImage(){
	document.getElementById('background').setAttribute('src', '')
}


function setBackground(number){
	let background = document.getElementById('background');
	document.querySelectorAll('.background_img').forEach((control) => {
		control.classList.remove('selected');
	});
	console.log(document.querySelector(`.background_img:nth-child(1)`));
	document.querySelector(`.background_img:nth-child(${number})`).classList.add('selected');
	if (number <= 4){
		background.src = `img/${number}.jpg`;
	} else{
		background.setAttribute('src', '')
		if (number == 5){
			background.style.backgroundColor = 'white';
		} else {
			background.style.backgroundColor = 'fuchsia';
		}
	}
}

function setBackgroundStyle(backgroundStyle){
	document.querySelector('.background_image_style.selected').classList.remove('selected');
	document.getElementById(backgroundStyle).classList.add('selected')
	document.getElementById('background').style.objectFit = backgroundStyle;
}

function readUrl(event){
	if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('background').src = e.target.result;
			document.querySelector('.background_img.selected').classList.remove('selected');
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}

function updateSplineWidth(e){
	let width = 2;
	if (e){
		width = e.target.value;
	}
	document.getElementById('spline_width').innerHTML = width;
	sceneBuilder.updateSplineWidth(width);
}

function toggleTether(){
	let tether = document.getElementById('toggle_tether');
	if (tether.classList.contains('selected')){
		document.body.classList.remove('tethering');
		tether.classList.remove('selected');
		sceneBuilder.removeTethers();
	} else {
		document.body.classList.add('tethering');
		tether.classList.add('selected');
		sceneBuilder.buildTethers();
	}
}

function alignLetters(orientation){
	sceneBuilder.alignLetters(orientation);
}

export function enableAlignButton(){
	document.getElementById('align_letters').removeAttribute('disabled');
	document.getElementById('align_letters_v').removeAttribute('disabled');
	document.getElementById('align_letters_grid').removeAttribute('disabled');
}

export function disableAlignButton(){
	document.getElementById('align_letters').setAttribute('disabled', '');
	document.getElementById('align_letters_v').setAttribute('disabled', '');
	document.getElementById('align_letters_grid').setAttribute('disabled', '');
}

export function updateTransformValues(object){
	let id = object.name;
	let position = object.position;
	let rotation = object.rotation;
	let scale = object.scale;

	let character_position = document.getElementById(id).querySelector('.character_position');
	let character_rotation = document.getElementById(id).querySelector('.character_rotation');
	let character_scale = document.getElementById(id).querySelector('.character_scale');

	character_position.innerHTML = `${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`;
	character_rotation.innerHTML = `${rotation.x.toFixed(2)}, ${rotation.y.toFixed(2)}, ${rotation.z.toFixed(2)}`;
	character_scale.innerHTML = `${scale.x.toFixed(2)}, ${scale.y.toFixed(2)}, ${scale.z.toFixed(2)}`;
}

export function dismissInfo(){
	document.body.classList.add('info_hidden');
}

export function showInfo(){
	document.body.classList.remove('info_hidden');
	setTimeout(()=>{
		playSlide(0, 'next');
	}, 1000);
}

const slides = [
	'Welcome... This type tool is meant to set short words or phrases in three dimensional space.',
	'\'Character Select\': Add characters to the scene.',
	'\'Scene Characters\': Contains active characters in scene, also houses group controls.',
	'\'Transform Controls\': Adjust which transform control you are using, keyboard shortcut indicated in \'()\'.',
	'Note: Hovering over a character will reveal its transform controls.',
	'Note: Characters can be grouped together by shift clicking on them in the scene, or through the \'Scene Characters\' panel.',
	'\'Character Controls\': Adjust incoming character width or add tethers.',
	'Note: Characters already in the scene must be grouped to adjust their width.',
	'\'Background\': Select from available presets or upload from your computer.',
	'\'General Controls\': Scene export and grid options. Pngs are exported at 300dpi for print purposes.',
]

let currentSlide = 0;

let isPlayingSlide = false;

let currentTimeout;

export function playSlide(index, direction) {
	let info = document.getElementById('slide_content');
	
	if (isPlayingSlide){
		clearTimeout(currentTimeout);
		if (direction === 'next') {
			currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
		} else if (direction === 'prev') {
			currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
		}
		info.innerHTML = slides[currentSlide];
		isPlayingSlide = false;
		return
	}

	let text = slides[index];
	let i = 0;
	let speed = 20;
	info.innerHTML = '';

	function typeWriter() {
		isPlayingSlide = true;
		if (i < text.length) {
			info.innerHTML += text.charAt(i);
			i++;
			currentTimeout = setTimeout(typeWriter, speed);
		} else{
			isPlayingSlide = false;
		
		}
	}

	typeWriter();
	currentSlide = index;
	revealUi(currentSlide);
	document.getElementById('current_slide').innerHTML = `${index < 9 ? 0 : ''}${index + 1}`;
}

function revealUi(index){
	document.querySelectorAll('.ui').forEach((ui) => {
		ui.classList.remove('show');
	});
	if (index == 1){
		document.getElementById('character_select_container').classList.add('show'); 
	} else if (index == 2){
		document.getElementById('scene_characters').classList.add('show');
	} else if (index == 3){
		document.getElementById('transform_controls').classList.add('show');
	}else if (index == 6){
		document.getElementById('character_controls').classList.add('show');
	}else if (index == 8){
		document.getElementById('background_controls').classList.add('show');
	}else if (index == 9){
		document.getElementById('general_controls').classList.add('show');
	}
}

function hideUI(){
	document.body.classList.add('ui_hidden');
	document.getElementById('show_ui').style.display = 'block';
	document.getElementById('show_ui').style.opacity = '0';

	setTimeout(() => {
		document.getElementById('show_ui').style.opacity = '1';
	}, 1000);
}

function undoHiddenUI(){
	document.getElementById('show_ui').style.opacity = '0';
	setTimeout(() => {
		document.body.classList.remove('ui_hidden');
		setTimeout(() => {
			document.getElementById('show_ui').style.display = 'none';
		}, 500);
	}, 100);
}

function previousSlide(){
	if (currentSlide > 0){
		currentSlide--;	
	} else {
		currentSlide = slides.length - 1;
	}
	playSlide(currentSlide, 'prev');
}

function nextSlide(){
	if (currentSlide < slides.length - 1){
		currentSlide++;
	} else {
		currentSlide = 0;
	}
	playSlide(currentSlide, 'next');
}