import {
    getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup,
    signInWithEmailAndPassword, TwitterAuthProvider, GithubAuthProvider, FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";

import { verAutenticacion } from "./firebase.js";

const db = getFirestore();
const storage = getStorage();
var usarActual;

window.onload = function () {
    verAutenticacion();
}

window.abrirMoldal = function abrirMoldal() {
    document.getElementById("alertaErrorRegistro").style.display = "none";
    document.getElementById("alertaErrorRegistro").innerHTML = "";
    document.getElementById("txtDisplayName").value = "";
    document.getElementById("txtcorreo").value = "";
    document.getElementById("txtcontra").value = "";
}

window.crearUsuario = function crearUsuario() {

    const displayName = document.getElementById("txtDisplayName").value;
    const correo = document.getElementById("txtcorreo").value;
    const contrasena = document.getElementById("txtcontra").value;

    if (displayName == "") {
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = "Debe ingresar un displayName";
        return;
    }
    if (correo == "") {
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = "Debe ingresar un correo";
        return;
    }
    if (contrasena == "") {
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = "Debe ingresar un contrasena";
        return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, correo, contrasena).then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
            displayName: displayName
        }).then(() => {
            alert("Usuario registrado correctamente");
            //console.log(userCredential);
            auth.signOut();
            document.location.href = "/";
        }).catch((error) => {
            const errorMessage = error.message;
            document.getElementById("alertaErrorRegistro").style.display = "block";
            document.getElementById("alertaErrorRegistro").innerHTML = errorMessage;
        });

    }).catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = errorMessage;
    });

}

window.iniciarSesion = function iniciarSesion() {

    const email = document.getElementById("txtcorreoIngresar").value;
    const password = document.getElementById("txtcontraIngresar").value;

    if (email == "" || password == "") {
        document.getElementById("alertErrorLogueo").style.display = "block";
        document.getElementById("alertErrorLogueo").innerHTML = "Email y/o contraseña son obligatorios";
        return false;
    } else {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

            actualizarPerfil(userCredential.user, "EmailAndPassword");

        }).catch((error) => {
            document.getElementById("alertErrorLogueo").style.display = "block";
            document.getElementById("alertErrorLogueo").innerHTML = error.message;
        });
    }

}

window.authGoogle = function authGoogle() {
    const provider = new GoogleAuthProvider();
    authGeneric(provider, "Google");
}

window.authTwitter = function authTwitter() {
    const provider = new TwitterAuthProvider();
    authGeneric(provider, "Twitter");
}

window.authGithub = function authGithub() {
    const provider = new GithubAuthProvider();
    authGeneric(provider, "GitHub");
}

window.authFacebook = function authFacebook() {
    const provider = new FacebookAuthProvider();
    authGeneric(provider, "Facebook");
}

function authGeneric(provider, providerName) {
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            actualizarPerfil(result.user, providerName);
        }).catch((error) => {
            //const errorCode = error.code;
            //const email = error.email;
            const errorMessage = error.message;
            document.getElementById("alertErrorLogueo").style.display = "block";
            document.getElementById("alertErrorLogueo").innerHTML = errorMessage;
        });
}


function limpiarModalUpdate() {
    document.getElementById("alertaActulizacionRegistro").style.display = "none";
    document.getElementById("alertaActulizacionRegistro").innerHTML = "";
    document.getElementById("progressUploadPhoto").style.visibility = "hidden";

    document.getElementById("txtDisplayNameUpd").value = "";
    document.getElementById("txtnombre").value = "";
    document.getElementById("txtapellido").value = "";
    document.getElementById("txtemail").value = "";
    document.getElementById("txttelefono").value = "";
    document.getElementById("txtprovider").value = "";
    document.getElementById("imgFoto").src = null;
}

function actualizarPerfil(user, providerName) {

    const docRef = doc(db, "usuario", user.uid);
    getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
        } else {
            usarActual = user;
            limpiarModalUpdate();

            document.getElementById("txtDisplayNameUpd").value = user.displayName != null ? user.displayName : "";
            document.getElementById("txtemail").value = user.email != null ? user.email : "";
            document.getElementById("txttelefono").value = user.phoneNumber != null ? user.phoneNumber : "";
            document.getElementById("imgFoto").src = user.photoURL != null ? user.photoURL : "asset/img/nouser.jpg";
            //document.getElementById("txtprovider").value = providerName;
            document.getElementById("txtprovider").value = user.reloadUserInfo.providerUserInfo[0].providerId;

            if (providerName === "google") {
                document.getElementById("txtnombre").value = user.displayName != null ? user.displayName : "";
            } else if (providerName === "EmailAndPassword") {
                document.getElementById("txtnombre").value = "";
            } else if (providerName === "Twitter") {
                document.getElementById("txtemail").removeAttribute('readonly');
                document.getElementById("txtnombre").value = "";
            } else if (providerName === "GitHub") {
                document.getElementById("txtnombre").value = "";
            }

            $("#exampleModalUpdate").modal('show');

        }
    }).catch((error) => {
        document.getElementById("alertErrorLogueo").style.display = "block";
        document.getElementById("alertErrorLogueo").innerHTML = error.message;
    });
}


window.cambiarFoto = function cambiarFoto(archivo) {

    const file = archivo.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        document.getElementById("progressUploadPhoto").style.visibility = "visible";

        document.getElementById("imgFoto").src = reader.result;
        const imageRef = ref(storage, 'fotoPerfil/' + usarActual.uid);
        const uploadTask = uploadBytesResumable(imageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);
            },
            (error) => {
                document.getElementById("progressUploadPhoto").style.visibility = "hidden";
                $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
                document.getElementById("alertaActulizacionRegistro").style.display = "block";
                document.getElementById("alertaActulizacionRegistro").innerHTML = error.message;
            },
            () => {
                document.getElementById("progressUploadPhoto").style.visibility = "hidden";
                $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                });
            }
        );

    }
    reader.readAsDataURL(file);
}

window.editarPerfil = function editarPerfil() {



}