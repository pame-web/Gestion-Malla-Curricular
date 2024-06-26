const apiUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('facultadForm').addEventListener('submit', e => {
        e.preventDefault();
        createData('Facultad', {
            id: document.getElementById('facultadId').value,
            codigo_facultad: document.getElementById('codigoFacultad').value,
            descripcion_facultad: document.getElementById('descripcionFacultad').value
        });
    });

    document.getElementById('materiaForm').addEventListener('submit', e => {
        e.preventDefault();
        createData('Materia', {
            id: document.getElementById('materiaId').value,
            cod_materia: document.getElementById('codigoMateria').value,
            descripcion: document.getElementById('descripcionMateria').value,
            credito: document.getElementById('credito').value
        });
    });

    document.getElementById('materialForm').addEventListener('submit', e => {
        e.preventDefault();
        createData('Material', {
            edicion: document.getElementById('edicion').value,
            autor: document.getElementById('autor').value,
            fecha: document.getElementById('fecha').value,
            descripcion: document.getElementById('descripcionMaterial').value
        });
    });

    loadData('Facultad');
    loadData('Materia');
    loadData('Material');
});

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
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editData('${sheet}', ${index}, '${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}')"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteData('${sheet}', ${index})"><i class="bi bi-trash"></i> Eliminar</button>
                        </td>`;
                }
                tableBody.appendChild(newRow);
            });
        })
        .catch(error => console.error('Error al cargar datos:', error));
}

function editData(sheet, index, ...args) {
    let newData;
    if (sheet === 'Facultad') {
        newData = prompt("Nueva Facultad:", args.join(',')).split(',');
    } else if (sheet === 'Materia') {
        newData = prompt("Nueva Materia:", args.join(',')).split(',');
    } else if (sheet === 'Material') {
        newData = prompt("Nuevo Material:", args.join(',')).split(',');
    }
    if (newData) {
        let url = `${apiUrl}?action=update&sheet=${sheet}&id=${index + 1}`;
        newData.forEach((value, idx) => {
            url += `&${Object.keys(args)[idx]}=${encodeURIComponent(value)}`;
        });
        fetch(url)
            .then(response => response.text())
            .then(data => {
                alert(data);
                loadData(sheet);
            })
            .catch(error => console.error('Error al editar datos:', error));
    }
}

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

function showSection(section) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
    document.querySelector(`#${section}`).classList.remove('hidden');
    document.querySelector(`.nav-link[href*="${section}"]`).classList.add('active');
}
