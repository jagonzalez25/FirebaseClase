import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider , signInWithPopup , 
            signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

import { verAutenticacion } from "./firebase.js";

window.onload = function(){
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

    const email =  document.getElementById("txtcorreoIngresar").value;
    const password = document.getElementById("txtcontraIngresar").value;

    if(email == "" || password == "") {
        document.getElementById("alertErrorLogueo").style.display = "block";
        document.getElementById("alertErrorLogueo").innerHTML = "Email y/o contraseña son obligatorios";
        return false;
    } else {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password).then((userCredential) =>{

            //console.log(userCredential);

        }).catch((error) =>{
            document.getElementById("alertErrorLogueo").style.display = "block";
            document.getElementById("alertErrorLogueo").innerHTML = error.message;
        });
    }

}

window.authGoogle = function authGoogle() {

    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            //const credential = GoogleAuthProvider.credentialFromResult(result);
            //const token = credential.accessToken;
            // The signed-in user info.
           //console.log(credential);
            //console.log(token);

            //const user = result.user;
            //console.log(user);
            

            // ...
        }).catch((error) => {
            //const errorCode = error.code;
            //const email = error.email;
            const errorMessage = error.message;
            document.getElementById("alertErrorLogueo").style.display = "block";
            document.getElementById("alertErrorLogueo").innerHTML = errorMessage;     
            // The AuthCredential type that was used.
            //const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}




