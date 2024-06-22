const form = document.getElementById('dataForm');
const dataTable = document.getElementById('dataTable');
const apiUrl = 'https://script.google.com/macros/s/AKfycbwoB7FCDLTdCUgW6lb2Nf8XMtcdXMZ17sYCmCXTv5f6zBiBtygKPnoX7M3o10j2nHPA/exec';

// Función para cargar todos los datos desde Google Sheets
function loadData() {
    fetch(`${apiUrl}?action=read`)
        .then(codMateria => codMateria.json())
        .then(data => {
            dataTable.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos
            data.forEach((row, index) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editRow(${index + 1}, '${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}')">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRow(${index + 1})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </td>
                `;
                dataTable.appendChild(newRow);
            });
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            alert('Ocurrió un error al cargar los datos. Por favor, intenta nuevamente.');
        });
}

// Función para agregar datos a Google Sheets
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const facultad = document.getElementById('facultad').value;
    const codMateria = document.getElementById('codMateria').value;
    const materia = document.getElementById('materia').value;
    const bibliografia = document.getElementById('bibliografia').value;

    fetch(`${apiUrl}?action=create&facultad=${facultad}&codMateria=${codMateria}&materia=${materia}&bibliografia=${bibliografia}`)
        .then(response => response.text())
        .then(data => {
            alert(data);
            form.reset();
            loadData();
        })
        .catch(error => {
            console.error('Error al agregar datos:', error);
            alert('Ocurrió un error al agregar los datos. Por favor, intenta nuevamente.');
        });
});

// Función para editar una fila
function editRow(id, facultad, codMateria, materia, bibliografia) {
    const newFacultad = prompt("Nueva Facultad:", facultad);
    const newCodMateria = prompt("Nuevo Código de Materia:", codMateria);
    const newMateria = prompt("Nueva Materia:", materia);
    const newBibliografia = prompt("Nueva Bibliografía:", bibliografia);
    if (newFacultad !== null && newCodMateria !== null && newMateria !== null && newBibliografia !== null) {
        fetch(`${apiUrl}?action=update&id=${id}&facultad=${newFacultad}&codMateria=${newCodMateria}&materia=${newMateria}&bibliografia=${newBibliografia}`)
            .then(response => response.text())
            .then(data => {
                alert(data);
                loadData();
            })
            .catch(error => {
                console.error('Error al editar datos:', error);
                alert('Ocurrió un error al editar los datos. Por favor, intenta nuevamente.');
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
            })
            .catch(error => {
                console.error('Error al eliminar datos:', error);
                alert('Ocurrió un error al eliminar los datos. Por favor, intenta nuevamente.');
            });
    }
}

// Función para buscar datos por cualquier columna en Google Sheets
function searchData() {
    const searchTerm = document.getElementById('searchTerm').value.trim().toLowerCase();

    fetch(`${apiUrl}?action=read`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            dataTable.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos
            let foundAny = false; // Variable para verificar si se encontraron resultados

            data.forEach((row, index) => {
                let found = false;
                for (let i = 0; i < row.length; i++) { // Comenzar desde 1 para omitir el ID en la búsqueda
                    if (row[i].toString().toLowerCase().includes(searchTerm)) {
                        found = true;
                        break; // Si se encuentra el término en alguna columna, salir del bucle
                    }
                }
                if (found) {
                    foundAny = true; // Se encontró al menos un resultado
                    const newRow = document.createElement('tr');
                    let rowContent = `<td>${index + 1}</td>`; // Mostrar el ID correspondiente

                    // Construir las celdas de datos
                    for (let i = 0; i < row.length; i++) { // Comenzar desde 1 para omitir el ID en la construcción de celdas
                        rowContent += `<td>${row[i]}</td>`;
                    }

                    // Botones de acciones
                    rowContent += `
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editRow(${index + 1}, '${row[1]}', '${row[2]}', '${row[3]}', '${row[4]}')">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteRow(${index + 1})">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </td>
                    `;
                    newRow.innerHTML = rowContent;
                    dataTable.appendChild(newRow);
                }
            });

            if (!foundAny) {
                dataTable.innerHTML = `<tr><td colspan="${data[0].length + 1}">No se encontraron resultados para "${searchTerm}".</td></tr>`;
            }
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
