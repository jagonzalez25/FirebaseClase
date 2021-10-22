// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyDWqoNnYqjy6tLmadPJU_sO3dDOHUP7A",
  authDomain: "fir-clase-bc138.firebaseapp.com",
  projectId: "fir-clase-bc138",
  storageBucket: "fir-clase-bc138.appspot.com",
  messagingSenderId: "993493277624",
  appId: "1:993493277624:web:ccce35b624cf0c30120d4d",
  measurementId: "G-4NNN050R18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

window.salir = function salir() {
      const auth = getAuth();
      signOut(auth).then(() =>{
            document.location.href = "/";
      }).catch((err) =>{
          alert("Se produce error al cerrar la sesion");
          console.log(err);
      });
}


export function verAutenticacion(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) =>{
        if(user) {
          /*Al iniciar sesion
          console.log("Inicio sesion");  
          console.log(user);*/

          if(document.getElementById("divRedes"))
            document.getElementById("divRedes").style.visibility = "hidden";

          if(document.getElementById("divInicioSesion"))        
            document.getElementById("divInicioSesion").style.visibility = "hidden";          


          if(user.photoURL != null)
            document.getElementById("imgFotoUsuario").src= user.photoURL;
          else
            document.getElementById("imgFotoUsuario").src= "asset/img/nouser.jpg";

          if(user.displayName != null)
              document.getElementById("lblNombreUsuario").innerHTML = user.displayName;
          else if (user.email != null)    
              document.getElementById("lblNombreUsuario").innerHTML = user.email;
          else
              document.getElementById("lblNombreUsuario").innerHTML = ""; 

          document.getElementById("barraMenuId").style.visibility = "visible";
          document.getElementById("divDatosUsu").style.visibility = "visible";



        } else {
         /** 
          * Al cerrar sesion
          * 
         */
          document.getElementById("barraMenuId").style.visibility = "hidden";
          document.getElementById("divDatosUsu").style.visibility = "hidden";

          if(document.getElementById("divRedes"))
            document.getElementById("divRedes").style.visibility = "visible";

          if(document.getElementById("divInicioSesion"))  
            document.getElementById("divInicioSesion").style.visibility = "visible";
        }
    });
}