const apiUrlFacultad = 'https://script.google.com/macros/s/AKfycbyKwEGktI5aw7elWMt-kGGiG5jl1ZZ7_hmRaW6U-p2b5J1xU9OGNQ_zXNV4l_Kd21YAHA/exec';
const apiUrlMateria = 'https://script.google.com/macros/s/AKfycbx7kzzcjB7zG5P4KiOj3f-AbirchsQWI-zgryg3qb16VPyXmlJPY7x7APPrl2IyjB4hVw/exec';
const apiUrlMaterial = 'https://script.google.com/macros/s/AKfycbyOpjo0uZD9EZYKyMDHukzqSfK0B2bk1bvJHc1NLBTuC1bi7eORi1U8QYsjtBJUFtsHyw/exec';

document.addEventListener('DOMContentLoaded', () => {
    // Manejo de eventos de envío de formulario para cada sección
    document.getElementById('FacultadForm').addEventListener('submit', e => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('Id').value,
            descripcion: document.getElementById('Descripción').value,
            tipo: 'Facultad'
        };
        createData('Facultad', formData);
    });

    document.getElementById('MateriaForm').addEventListener('submit', e => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('MateriaId').value,
            codigo: document.getElementById('CodigoMateria').value,
            descripcion: document.getElementById('DescripcionMateria').value,
            tipo: 'Materia'
        };
        createData('Materia', formData);
    });

    document.getElementById('MaterialForm').addEventListener('submit', e => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('MaterialId').value,
            titulo: document.getElementById('TituloMaterial').value,
            autor: document.getElementById('AutorMaterial').value,
            fecha: document.getElementById('FechaMaterial').value,
            edicion: document.getElementById('EdicionMaterial').value,
            tipo: 'Material'
        };
        createData('Material', formData);
    });

    // Cargar datos iniciales
    loadData('Facultad');
    loadData('Materia');
    loadData('Material');
});

// Función para crear datos
function createData(sheet, data) {
    let url = '';
    if (sheet === 'Facultad') {
        url = apiUrlFacultad;
    } else if (sheet === 'Materia') {
        url = apiUrlMateria;
    } else if (sheet === 'Material') {
        url = apiUrlMaterial;
    }

    fetch(`${url}?action=create&sheet=${sheet}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadData(sheet);
        })
        .catch(error => console.error('Error al agregar datos:', error));
}

// Función para editar datos
function editData(sheet, index, ...args) {
    const data = {};
    if (sheet === 'Facultad') {
        data.id = args[0];
        data.descripcion = args[1];
    } else if (sheet === 'Materia') {
        data.id = args[0];
        data.codigo = args[1];
        data.descripcion = args[2];
    } else if (sheet === 'Material') {
        data.id = args[0];
        data.titulo = args[1];
        data.autor = args[2];
        data.fecha = args[3];
        data.edicion = args[4];
    }

    let url = '';
    if (sheet === 'Facultad') {
        url = `${apiUrlFacultad}?action=update`;
    } else if (sheet === 'Materia') {
        url = `${apiUrlMateria}?action=update`;
    } else if (sheet === 'Material') {
        url = `${apiUrlMaterial}?action=update`;
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadData(sheet);
        })
        .catch(error => console.error('Error al editar datos:', error));
}

// Función para eliminar datos
function deleteData(sheet, index) {
    let url = '';
    if (sheet === 'Facultad') {
        url = `${apiUrlFacultad}?action=delete&id=${index + 1}`;
    } else if (sheet === 'Materia') {
        url = `${apiUrlMateria}?action=delete&id=${index + 1}`;
    } else if (sheet === 'Material') {
        url = `${apiUrlMaterial}?action=delete&id=${index + 1}`;
    }

    fetch(url)
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadData(sheet);
        })
        .catch(error => console.error('Error al eliminar datos:', error));
}

// Función para cargar datos
function loadData(sheet) {
    let url = '';
    if (sheet === 'Facultad') {
        url = `${apiUrlFacultad}?action=read&sheet=${sheet}`;
    } else if (sheet === 'Materia') {
        url = `${apiUrlMateria}?action=read&sheet=${sheet}`;
    } else if (sheet === 'Material') {
        url = `${apiUrlMaterial}?action=read&sheet=${sheet}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(`${sheet.toLowerCase()}Table`);
            if (tableBody) {
                tableBody.innerHTML = '';
                data.forEach((row, index) => {
                    const newRow = document.createElement('tr');
                    if (sheet === 'Facultad') {
                        newRow.innerHTML = `
                            <td>${row[0]}</td>
                            <td>${row[1]}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editData('${sheet}', ${index}, '${row[0]}', '${row[1]}')"><i class="bi bi-pencil"></i> Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteData('${sheet}', ${index})"><i class="bi bi-trash"></i> Eliminar</button>
                            </td>`;
                    } else if (sheet === 'Materia') {
                        newRow.innerHTML = `
                            <td>${row[0]}</td>
                            <td>${row[1]}</td>
                            <td>${row[2]}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editData('${sheet}', ${index}, '${row[0]}', '${row[1]}', '${row[2]}')"><i class="bi bi-pencil"></i> Editar</button>
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
            }
        })
        .catch(error => console.error('Error al cargar datos:', error));
}
