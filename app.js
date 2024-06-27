const apiUrl = 'https://script.google.com/macros/s/AKfycbye_nWJJ65EtRCZSA6YaKkntbcSy_hBx_DDV8rf3WeaEwcrhbwM28vgbCrSijfvbJTc/exec';

document.addEventListener('DOMContentLoaded', () => {
    // Manejo de eventos de envío de formulario para cada sección
    document.getElementById('facultadForm').addEventListener('submit', e => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('facultadId').value,
            codigo_facultad: document.getElementById('codigoFacultad').value,
            descripcion_facultad: document.getElementById('descripcionFacultad').value
        };
        createData('Facultad', formData);
    });

    document.getElementById('materiaForm').addEventListener('submit', e => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('materiaId').value,
            cod_materia: document.getElementById('codigoMateria').value,
            descripcion: document.getElementById('descripcionMateria').value,
            credito: document.getElementById('credito').value
        };
        createData('Materia', formData);
    });

    document.getElementById('materialForm').addEventListener('submit', e => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('materialId').value,
            edicion: document.getElementById('edicion').value,
            autor: document.getElementById('autor').value,
            fecha: document.getElementById('fecha').value,
            descripcion: document.getElementById('descripcionMaterial').value
        };
        createData('Material', formData);
    });

    // Cargar datos iniciales
    loadData('Facultad');
    loadData('Materia');
    loadData('Material');

    // Manejo del menú de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').substring(1);
            showSection(section);
            if (section !== 'paginaPrincipal') {
                loadData(section);
            }
        });
    });

    // Mostrar la primera sección por defecto
    showSection('facultad');
});

// Función para crear datos
function createData(sheet, data) {
    let url = `${apiUrl}?action=create&sheet=${sheet}`;
    Object.keys(data).forEach(key => {
        url += `&${key}=${encodeURIComponent(data[key])}`;
    });
    fetch(url)
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadData(sheet);
        })
        .catch(error => console.error('Error al agregar datos:', error));
}

// Función para cargar datos
function loadData(sheet) {
    fetch(`${apiUrl}?action=read&sheet=${sheet}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(`${sheet.toLowerCase()}Table`);
            tableBody.innerHTML = '';
            data.forEach((row, index) => {
                const newRow = document.createElement('tr');
                if (sheet === 'Facultad') {
                    newRow.innerHTML = `
                        <td>${row[0]}</td>
                        <td>${row[1]}</td>
                        <td>${row[2]}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editData('${sheet}', ${index}, '${row[0]}', '${row[1]}', '${row[2]}')"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteData('${sheet}', ${index})"><i class="bi bi-trash"></i> Eliminar</button>
                        </td>`;
                } else if (sheet === 'Materia') {
                    newRow.innerHTML = `
                        <td>${row[0]}</td>
                        <td>${row[1]}</td>
                        <td>${row[2]}</td>
                        <td>${row[3]}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editData('${sheet}', ${index}, '${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}')"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteData('${sheet}', ${index})"><i class="bi bi-trash"></i> Eliminar</button>
                        </td>`;
                } else if (sheet === 'Material') {
                    newRow.innerHTML = `
                        <td>${row[0]}</td>
                        <td>${row[1]}</td>
                        <td>${row[2]}</td>
                        <td>${row[3]}</td>
                        <td>${row[4]}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editData('${sheet}', ${index}, '${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}', '${row[4]}')"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteData('${sheet}', ${index})"><i class="bi bi-trash"></i> Eliminar</button>
                        </td>`;
                }
                tableBody.appendChild(newRow);
            });
        })
        .catch(error => console.error('Error al cargar datos:', error));
}

// Función para editar datos
function editData(sheet, index, ...args) {
    const data = {};
    if (sheet === 'Facultad') {
        data.id = args[0];
        data.codigo_facultad = args[1];
        data.descripcion_facultad = args[2];
    } else if (sheet === 'Materia') {
        data.id = args[0];
        data.cod_materia = args[1];
        data.descripcion = args[2];
        data.credito = args[3];
    } else if (sheet === 'Material') {
        data.id = args[0];
        data.edicion = args[1];
        data.autor = args[2];
        data.fecha = args[3];
        data.descripcion = args[4];
    }
    let url = `${apiUrl}?action=update&sheet=${sheet}&id=${data.id}`;
    Object.keys(data).forEach(key => {
        url += `&${key}=${encodeURIComponent(data[key])}`;
    });
    fetch(url)
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadData(sheet);
        })
        .catch(error => console.error('Error al editar datos:', error));
}

// Función para eliminar datos
function deleteData(sheet, index) {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
        fetch(`${apiUrl}?action=delete&sheet=${sheet}&id=${index + 1}`)
            .then(response => response.text())
            .then(data => {
                alert(data);
                loadData(sheet);
            })
            .catch(error => console.error('Error al eliminar datos:', error));
    }
}

// Función para mostrar secciones
function showSection(section) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
    document.querySelector(`#${section}`).classList.remove('hidden');
    document.querySelector(`.nav-link[href="#${section}"]`).classList.add('active');

    // Si se selecciona la página principal, mostrar el div 'paginaPrincipal' y ocultar las secciones individuales
    if (section === 'paginaPrincipal') {
        document.getElementById('paginaPrincipal').classList.remove('hidden');
        document.getElementById('facultad').classList.add('hidden');
        document.getElementById('materia').classList.add('hidden');
        document.getElementById('material').classList.add('hidden');
    } else {
        document.getElementById('paginaPrincipal').classList.add('hidden');
    }
}
