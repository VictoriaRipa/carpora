document.addEventListener('DOMContentLoaded', function () {
    const carpoolForm = document.getElementById('carpoolForm');
    const carpoolList = document.getElementById('list');

    loadCarpools();

    carpoolForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const location = document.getElementById('location').value; // Desde dónde sale
        const contact = document.getElementById('contact').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const seats = parseInt(document.getElementById('seats').value);

        const newCarpool = {
            driver: name,
            location,
            contact,
            date,
            time,
            seats,
            passengers: []
        };

        saveCarpool(newCarpool);
        renderCarpool(newCarpool);
        carpoolForm.reset();
    });

    function saveCarpool(carpool) {
        let carpools = JSON.parse(localStorage.getItem('carpools')) || [];
        carpools.push(carpool);
        localStorage.setItem('carpools', JSON.stringify(carpools));
    }

    function loadCarpools() {
        let carpools = JSON.parse(localStorage.getItem('carpools')) || [];
        carpools.forEach(carpool => renderCarpool(carpool));
    }

    function renderCarpool(carpool) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${carpool.driver}</strong> - Desde: ${carpool.location} <br>
            📅 ${carpool.date} | ⏰ ${carpool.time} <br>
            📞 Contacto: ${carpool.contact} <br>
            🚘 Lugares: <span class="seats">${carpool.seats}</span>
            <button class="join-button">Unirse</button>
            <button class="delete-button">Eliminar</button>
            <div class="passengers"></div>`;

        const passengersContainer = listItem.querySelector('.passengers');
        carpool.passengers.forEach(passenger => {
            const passengerInfo = document.createElement('div');
            passengerInfo.textContent = `${passenger.name} 📱 ${passenger.contact}`;
            passengersContainer.appendChild(passengerInfo);
        });

        // Unirse a un viaje
        listItem.querySelector('.join-button').addEventListener('click', function () {
            if (carpool.seats > 0) {
                const userName = prompt("Ingresa tu nombre:");
                const userContact = prompt("Ingresa tu número de contacto:");

                if (userName && userContact) {
                    carpool.seats--;
                    listItem.querySelector('.seats').textContent = carpool.seats;

                    const newPassenger = { name: userName, contact: userContact };
                    carpool.passengers.push(newPassenger);

                    const passengerInfo = document.createElement('div');
                    passengerInfo.textContent = `${userName} 📱 ${userContact}`;
                    passengersContainer.appendChild(passengerInfo);

                    updateCarpools();
                } else {
                    alert('Debes ingresar tu nombre y contacto.');
                }
            } else {
                alert('No hay lugares disponibles.');
            }
        });

        // Eliminar un viaje (cualquiera puede eliminarlo)
        listItem.querySelector('.delete-button').addEventListener('click', function () {
            const confirmation = confirm("¿Estás seguro de que quieres eliminar este viaje?");
            if (confirmation) {
                const carpools = JSON.parse(localStorage.getItem('carpools')) || [];
                const updatedCarpools = carpools.filter(c => c.contact !== carpool.contact || c.driver !== carpool.driver);
                localStorage.setItem('carpools', JSON.stringify(updatedCarpools));
                listItem.remove();
            }
        });

        carpoolList.appendChild(listItem);
    }

    function updateCarpools() {
        let carpools = [];
        document.querySelectorAll('#list li').forEach(item => {
            let [driver, location] = item.textContent.split(' - Desde: ');
            let seats = parseInt(item.querySelector('.seats').textContent);
            let passengers = [...item.querySelectorAll('.passengers div')].map(div => {
                let [name, contact] = div.textContent.split(' 📱 ');
                return { name, contact };
            }).filter(p => p.name && p.contact);
            
            carpools.push({ driver, location, seats, passengers });
        });
        localStorage.setItem('carpools', JSON.stringify(carpools));
    }
});
