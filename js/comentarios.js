
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

import { verAutenticacion } from "./firebase.js";

const db = getFirestore();

window.onload = function () {
    verAutenticacion();
    hacerComentario();
}

//Funcion cuando el usuario hace un comentario a un restaurante
function hacerComentario() {

    const auth = getAuth();
    onAuthStateChanged(auth, (user) =>{
        if(user) {
            const idRestarunte = "o3lECafXWNDlaF0ZDnGg"; 
            const comentario = "Pesimo.";
            const rating = 2;

            const nuevoComentario = doc(collection(db, "resturante/"+ idRestarunte + "/comentario"));
            setDoc(nuevoComentario , {
                comentario: comentario,
                rating: rating,
                usuario: {
                    displayName : user.displayName,
                    foto        :  user.photoURL,
                    uid        :  user.uid 
                }
            }).then(() => {
                editarRating(idRestarunte, rating);
            }).catch((error) =>{
                console.log("Ha ocurrido un error.");
                console.log(error);
            });


        }
    });
}

function editarRating(idRestarunte, rating) {

    const docRef = doc(db, "resturante", idRestarunte);
    getDoc(docRef).then(docSnap =>{

        if(docSnap.exists()) {
                const data = docSnap.data();
                const newRating = (rating + data.rating) / 2;

                const restauranteRef = doc(db, "resturante", idRestarunte);
                updateDoc(restauranteRef , {
                    rating: newRating
                }).then(() =>{
                    alert("Comentario agregado correctamente");
                }).catch((error) =>{
                        console.log("Ha ocurrido un error.");
                        console.log(error);
                });
        }

    }).catch((error) =>{
        console.log("Ha ocurrido un error.");
        console.log(error);
    });

}