/* =====================================
* 		[ Inicio del JS]
=========================================*/

let Notes = [];

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
	divcard.innerHTML += CreateCard(idCard);

	LoadDataSafe(idCard, textTitle, textBody);

	Notes.push({
		id: idCard,
		title: textTitle,
		body: textBody,
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

	Notes = [];
	localStorage.removeItem("NotesDB");
}

/* =========================================================
* [ Crear una nota mediante los argumentos recibidos ]
=============================================================*/

const CreateCard = (id) => {
	return `
	<div class="card animate__bounceIn animate__fast" id="${id}" name=${id}>
		<div class="cardtitle" id="titlecard${id}"></div>
		<ion-icon name="close-outline" align="right" class="icon-close" onclick="DeleteNote(this)" id="${id}"></ion-icon>
		<div class="separator"></div>
		<div class="bodycard" id="bodycard${id}"></div>
		<ion-icon class="icon-preview" name="reorder-four-outline" onclick="NoteFullScreen(this)" id="${id}" ></ion-icon>		
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

			divcard.innerHTML += CreateCard(id);
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

	let title, body;

	for (let i = 0; i < Notes.length; i++) {
		if (Notes[i].id == id) {
			title = Notes[i].title;
			body = Notes[i].body;
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
}

/* ================================================================
* [ Cerrar la nota ampliada ]
===================================================================*/

function CloseNote(e) {
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
		deleteAllButton.style.visibility = "hidden";
	} else {
		noNotesDiv.style.display = "none";
		deleteAllButton.style.visibility = "visible";
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
	let background = document.getElementsByClassName("black-background");

	if (visible) {
		let All = document.getElementById("all");
		background[0].style.visibility = "visible";
		background[0].style.width = All.offsetWidth.toString() + "px";
		background[0].style.height = All.offsetHeight.toString() + "px";
		background[0].classList.add("animate__animated");
		background[0].classList.add("animate__fadeIn");
	} else {
		background[0].classList.remove("animate__fadeIn");
		background[0].classList.add("animate__fadeOut");

		setTimeout(() => {
			background[0].classList.remove("animate__animated");
			background[0].classList.remove("animate__fadeOut");
			background[0].style.visibility = "hidden";
		}, 800);
	}
};
