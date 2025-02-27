import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYmNSuy_3nzBaz_RqB-cP40vg97XpozCU",
    authDomain: "carpooling-79a41.firebaseapp.com",
    databaseURL: "https://carpooling-79a41-default-rtdb.firebaseio.com",
    projectId: "carpooling-79a41",
    storageBucket: "carpooling-79a41.appspot.com",
    messagingSenderId: "394767696944",
    appId: "1:394767696944:web:f26716deec1cdf96ce19f5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Función para agregar un viaje
function agregarViaje() {
    const viaje = {
        nombre: document.getElementById("name").value,
        salida: document.getElementById("location").value,
        contacto: document.getElementById("contact").value,
        fecha: document.getElementById("date").value,
        hora: document.getElementById("time").value,
        lugares: parseInt(document.getElementById("seats").value),
        pasajeros: [] // Agregar lista de pasajeros vacía
    };

    // Agregar el viaje a Firebase
    push(ref(database, 'viajes/'), viaje).then(() => {
        document.getElementById("carpoolForm").reset(); // Limpiar formulario
    }).catch((error) => {
        console.error("Error al agregar el viaje:", error);
    });
}

// Función para mostrar viajes
function mostrarViajes() {
    const viajesList = document.getElementById('list');
    viajesList.innerHTML = '';

    onValue(ref(database, 'viajes/'), (snapshot) => {
        viajesList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const viaje = childSnapshot.val();
            const viajeId = childSnapshot.key;
            const viajeItem = document.createElement('li');
            
            viajeItem.innerHTML = `
    <h3>${viaje.nombre} - ${viaje.salida}</h3>
    📅 ${viaje.fecha} | ⏰ ${viaje.hora} <br>
    📞 Contacto: ${viaje.contacto} <br>
    🚘 Lugares disponibles: <span class="seats">${viaje.lugares}</span> <br>
    <button class="join-button" onclick="unirseViaje('${viajeId}', ${viaje.lugares})">Unirse ✨</button>
    <button class="delete-button" onclick="eliminarViaje('${viajeId}')">🗑️ Eliminar</button>
    <div class="passengers">
        ${viaje.pasajeros ? viaje.pasajeros.map(p => `👤 ${p.nombre} 📱 ${p.contacto}`).join('<br>') : ''}
    </div>
`;

            viajesList.appendChild(viajeItem);
        });
    });
}

// Función para unirse a un viaje
window.unirseViaje = function (viajeId, lugares) {
    if (lugares > 0) {
        const nombrePasajero = prompt("Ingresa tu nombre:");
        const contactoPasajero = prompt("Ingresa tu número de contacto:");

        if (nombrePasajero && contactoPasajero) {
            const viajeRef = ref(database, `viajes/${viajeId}`);

            onValue(viajeRef, (snapshot) => {
                const viaje = snapshot.val();
                if (!viaje) return;

                // Verificar que aún haya lugares
                if (viaje.lugares > 0) {
                    const nuevosPasajeros = viaje.pasajeros ? [...viaje.pasajeros, { nombre: nombrePasajero, contacto: contactoPasajero }] : [{ nombre: nombrePasajero, contacto: contactoPasajero }];
                    const nuevosLugares = viaje.lugares - 1;

                    update(viajeRef, {
                        pasajeros: nuevosPasajeros,
                        lugares: nuevosLugares
                    });
                } else {
                    alert("No hay lugares disponibles.");
                }
            }, { onlyOnce: true });
        } else {
            alert("Debes ingresar tu nombre y contacto.");
        }
    } else {
        alert("No hay lugares disponibles.");
    }
};

// Función para eliminar un viaje
window.eliminarViaje = function (viajeId) {
    remove(ref(database, 'viajes/' + viajeId));
};

// Evento de envío del formulario
document.getElementById("carpoolForm").addEventListener("submit", (event) => {
    event.preventDefault();
    agregarViaje();
});

// Cargar viajes al iniciar
mostrarViajes();
