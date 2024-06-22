const form = document.getElementById('dataForm');
const dataTable = document.getElementById('dataTable');
const apiUrl = 'https://script.google.com/macros/s/AKfycbypNq_6dNVORCb04ln9fWXWk6obkMEFQytAE30_t6vJJ-VE6m8E0-U5xhTh9QQ00j__/exec';

// Función para cargar todos los datos desde Google Sheets
function loadData() {
    fetch(`${apiUrl}?action=read`)
        .then(response => response.json())
        .then(data => {
            dataTable.innerHTML = ''; // Limpiar la tabla antes de nnnncargar nuevos datos
            data.forEach((row, index) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>
                        <button onclick="editRow(${index + 1}, '${row[0]}', '${row[1]}')">Editar</button>
                        <button onclick="deleteRow(${index + 1})">Eliminar</button>
                    </td>
                `;
                dataTable.appendChild(newRow);
            });
        });
}

// Función para agregar datos a Google Sheets
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    fetch(`${apiUrl}?action=create&name=${name}&email=${email}`)
        .then(response => response.text())
        .then(data => {
            alert(data);
            form.reset();
            loadData();
        });
});

// Función para editar una fila
function editRow(id, name, email) {
    const newName = prompt("Nuevo Nombre:", name);
    const newEmail = prompt("Nuevo Correo:", email);
    if (newName !== null && newEmail !== null) {
        fetch(`${apiUrl}?action=update&id=${id}&name=${newName}&email=${newEmail}`)
            .then(response => response.text())
            .then(data => {
                alert(data);
                loadData();
            });
    }
}

// Función para eliminar una fila
function deleteRow(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
        fetch(`${apiUrl}?action=delete&id=${id}`)
            .then(response => response.text())
            .then(data => {
                alert(data);
                loadData();
            });
    }
}

// Función para buscar datos por nombre en Google Sheets
function searchData() {
    const searchTerm = document.getElementById('searchTerm').value.trim().toLowerCase();

    fetch(`${apiUrl}?action=read`)
        .then(response => response.json())
        .then(data => {
            dataTable.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos
            data.forEach((row, index) => {
                let found = false;
                row.forEach(cell => {
                    if (cell.toLowerCase().includes(searchTerm)) {
                        found = true;
                    }
                });
                if (found) {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${row[0]}</td>
                        <td>${row[1]}</td>
                        <td>
                            <button onclick="editRow(${index + 1}, '${row[0]}', '${row[1]}')">Editar</button>
                            <button onclick="deleteRow(${index + 1})">Eliminar</button>
                        </td>
                    `;
                    dataTable.appendChild(newRow);
                }
            });
        })
        .catch(error => {
            console.error('Error al buscar datos:', error);
            alert('Ocurrió un error al buscar datos. Por favor, intenta nuevamente.');
        });
}

// Función para limpiar el filtro y mostrar todos los datos
function clearFilter() {
    document.getElementById('searchTerm').value = ''; // Limpiar el campo de búsqueda
    loadData(); // Volver a cargar todos los datos
}

// Cargar los datos cuando se carga la página
window.onload = loadData;
