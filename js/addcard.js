/* =====================================
* 		[ Inicio del JS]
=========================================*/

let Notes = [];
let ColorSelected = 0;

let Colors = 
[
	"240,240,125",
	"245, 156, 156",
	"137, 178, 231",
	"137, 231, 137"
]
let formularioExpandido = false;
const divForm = document.getElementById('container_form');
const buttonExpand = document.getElementById('expand_button');

/* ===========================================
* [ Cargamos Las notas al cargar la página ]
=============================================*/

window.addEventListener("load", () => {
	LoadNotes();
});

/* ===========================================
* [ Funcion del botón "Agregar Nota" ]
=============================================*/

function AddCard() {
	let inputBody = document.getElementById("inputbody");

	let textBody = inputBody.value;

	if (!textBody) {
		window.alert("No se puede crear una nota vacia!");
		return;
	}

	let divcard = document.getElementById("container_cards");

	let inputTitle = document.getElementById("inputtitle");
	let textTitle = inputTitle.value;

	NoNotesShow(false);

	let idCard = Date.now();
	divcard.innerHTML += CreateCard(idCard, ColorSelected );

	LoadDataSafe(idCard, textTitle, textBody);

	Notes.push({
		id: idCard,
		title: textTitle,
		body: textBody,
		color: ColorSelected
	});

	// * Remover la animación

	setTimeout(() => {
		document.getElementById(idCard).className = "card";
	}, 1000);

	localStorage.setItem("NotesDB", JSON.stringify(Notes));

	inputTitle.value = "";
	inputBody.value = "";
	inputTitle.focus();
}

/* =========================================================
* [ Funcion de borrar la notita ]
=============================================================*/

function DeleteNote(e) {
	let id = e.id;

	let elements = document.getElementsByName(id);

	for (let i = 0; i < Notes.length; i++) {
		if (Notes[i].id == id) {
			Notes.splice(i, 1);
			break;
		}
	}

	localStorage.setItem("NotesDB", JSON.stringify(Notes));

	elements[0].classList.add("animate__animated", "animate__fadeOut");

	setTimeout(() => {
		elements[0].remove();
		Notes.length == 0 && NoNotesShow(true);
	}, 360);
}

/* =========================================================
* [ Funcion de borrar todas las notas del almacenamiento ]
=============================================================*/

function DeleteAll() {
	if (Notes.length == 0) return;

	ShowBlackBackground(false);
	CloseDialog();

	let AllNotes = document.querySelectorAll(".card");

	if (AllNotes != null) {

		if( Notes.length < 15 )
		{
			for (notes of AllNotes) {
				notes.classList.add("animate__animated", "animate__bounceOutLeft");
			}

			setTimeout(() => {
				for (notes of AllNotes) {
					notes.remove();
					NoNotesShow(true);
				}
			}, 500);
		}

		else{
			AllNotes.forEach( note => note.remove())
			NoNotesShow(true);
		}

	}

	Notes = [];
	localStorage.removeItem("NotesDB");
}

/* =========================================================
* [ Crear una nota mediante los argumentos recibidos ]
=============================================================*/

const CreateCard = ( id, color = 0 ) => {
	return `
	<div class="card animate__bounceIn animate__fast" id="${id}" name=${id} style="background-color: rgb(${Colors[ color ]});">
		<div class="cardtitle" id="titlecard${id}"></div>
		<ion-icon name="close-outline" align="right" class="icon-close" onclick="DeleteNote(this)" id="${id}"></ion-icon>
		<div class="separator"></div>
		<div class="bodycard" id="bodycard${id}"></div>
		<ion-icon class="icon-preview" name="open-outline" onclick="NoteFullScreen(this)" id="${id}" ></ion-icon>		
	</div>`;
};

/* =========================================================
* [ Cargamos los datos de titulo y nota sin el inner ]
! Esto sirve para que no introduzcan código html en las notas
=============================================================*/

const LoadDataSafe = (id, titulo = "Anotación", body = "cuerpo de la nota") => {
	let divTitle = document.getElementById(`titlecard${id}`);
	let divBody = document.getElementById(`bodycard${id}`);

	divTitle.innerText = titulo;
	divBody.innerText = body;
};

/* =====================================
* Cargamos Las notas al cargar la página
=========================================*/

const LoadNotes = () => {
	Notes = JSON.parse(localStorage.getItem("NotesDB")) || [];

	let divcard = document.getElementById("container_cards");

	if (Notes.length > 0) {
		Notes.forEach((element) => {
			let id = element.id;

			divcard.innerHTML += CreateCard(id, element.color );
			LoadDataSafe(id, element.title, element.body);
			document.getElementById(id).className = "card";
		});

		NoNotesShow(false);
	} else {
		NoNotesShow(true);
	}
};

/* ================================================================
* [ Ampliar notita ]
===================================================================*/

function NoteFullScreen(e) {
	let id = e.id;

	let title, body, color = 0;

	for (let i = 0; i < Notes.length; i++) {
		if (Notes[i].id == id) {
			title = Notes[ i ].title;
			body = Notes[ i ].body;
			color = Notes[ i ].color;
			break;
		}
	}

	ShowBlackBackground(true);

	let bigCardTitle = document.getElementById("id-big-cardtitle");
	let bigCardBody = document.getElementById("id-big-bodycard");

	let bigCard = document.getElementById("idbigcard");
	bigCard.style.display = "";

	bigCardTitle.innerText = title;
	bigCardBody.innerText = body;
	bigCard.style.backgroundColor = `rgb(${Colors[ color ]})`
}

/* ================================================================
* [ Cerrar la nota ampliada ]
===================================================================*/

function CloseNote() {
	ShowBlackBackground(false);

	let bigCard = document.getElementById("idbigcard");
	bigCard.style.display = "none";
}

/* ================================================================
* [ Verificar si hay notas ]
===================================================================*/

const NoNotesShow = (show = true) => {
	let noNotesDiv = document.getElementById("no_notes");
	let deleteAllButton = document.getElementById("iddelete");

	if (show == true) {
		noNotesDiv.style.display = "inline";
		deleteAllButton.style.display = "none";
	} else {
		noNotesDiv.style.display = "none";
		deleteAllButton.style.display = "block";
	}
};

/* ================================================================
* [ Eliminar Todo | Dialogo ]
===================================================================*/

function ShowDeleteAll() {
	ShowBlackBackground(true);

	let dialog = document.getElementById("iddeletecard");
	dialog.style.display = "flex";

	dialog.classList.add("animate__animated");
	dialog.classList.add("animate__bounceIn");

	let bigcard = document.getElementById("idbigcard");
	bigcard.style.display = "none";
}

function CloseDialog() {
	ShowBlackBackground(false);

	let dialog = document.getElementById("iddeletecard");

	dialog.classList.remove("animate__bounceIn");
	dialog.classList.add("animate__bounceOut");

	setTimeout(() => {
		dialog.classList.remove("animate__animated");
		dialog.classList.remove("animate__bounceOut");
		dialog.style.display = "none";
	}, 600);
}

/* ================================================================
* [ Mostrar fondo ]
===================================================================*/

const ShowBlackBackground = (visible = true) => {

	let background = document.getElementById("idblack-background")

	if ( visible ) {
		let All = document.getElementById("all");

		background.style.display = "block";
		background.style.width = All.offsetWidth.toString() + "px";
		background.style.height = All.offsetHeight.toString() + "px";

		background.classList.add("animate__animated");
		background.classList.add("animate__fadeIn");
	} else {
		background.classList.remove("animate__fadeIn");
		background.classList.add("animate__fadeOut");

		setTimeout(() => {
			background.classList.remove("animate__animated");
			background.classList.remove("animate__fadeOut");
			background.style.display = "none";
		}, 800);
	}
};


/* ================================================================
* [ Mostrar fondo ]
===================================================================*/

function reportWindowSize() {
	let All = document.getElementById("all");
	let background = document.getElementById("idblack-background")
	background.style.width = All.offsetWidth.toString() + "px";
	background.style.height = All.offsetHeight.toString() + "px";
}

window.onresize = reportWindowSize;

/* ================================================================
* [ Seleccionar Color]
===================================================================*/

function SelectColor( e ){
	colors = document.getElementsByClassName("colorselected")
	colors[0].classList.remove("colorselected")
	e.classList.add("colorselected");
	ColorSelected = parseInt( e.id );
}

/* ================================================================
* [ Función de expandir el formulario - version movil ]
===================================================================*/


function ExpandForm(){
	
	if (!formularioExpandido) {
		buttonExpand.innerHTML = '<ion-icon name="chevron-up-outline"></ion-icon>'
		formularioExpandido = true;
		divForm.style.display = 'flex'	
	} 
	
	else {
		buttonExpand.innerHTML = '<ion-icon name="chevron-down-outline"></ion-icon> Agregar Notas'
		divForm.style.display = 'none'
		formularioExpandido = false;
	}		

}