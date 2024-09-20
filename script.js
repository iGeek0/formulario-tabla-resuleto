document.addEventListener('DOMContentLoaded', () => {
    cargarEmpleadosDesdeLocalStorage();

    document.getElementById("formularioEmpleados").addEventListener('submit', (evento) => {
        evento.preventDefault();

        let nombre = document.getElementById("firstName").value;
        let apellido = document.getElementById("lastName").value;
        let edad = document.getElementById("age").value;
        let indexEmpleado = document.getElementById("employeeIndex").value;

        if (!nombre || !apellido || !edad) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (indexEmpleado === "") {
            agregarNuevoEmpleado({ nombre, apellido, edad });
        } else {
            editarEmpleadoExistente({ nombre, apellido, edad }, indexEmpleado);
        }

        reiniciarFormulario();
    });
});


// Funciones relacionadas a empleados
const cargarEmpleadosDesdeLocalStorage = () => {
    const cuerpoTabla = document.getElementById("bodyTablaEmpleados");
    cuerpoTabla.innerHTML = ""; // Limpiar la tabla
    const empleados = obtenerEmpleadosDesdeLocalStorage();
    empleados.forEach((empleado, indice) => agregarEmpleadoATabla(empleado, indice));
    // la siguiente linea es equivalente a la anterior
    // empleados.forEach(agregarEmpleadoATabla);
};

const agregarNuevoEmpleado = (empleado) => {
    let empleados = obtenerEmpleadosDesdeLocalStorage();
    empleados.push(empleado);
    actualizarEmpleadosEnLocalStorage(empleados);
};

const editarEmpleadoExistente = (empleado, indexEmpleado) => {
    let empleados = obtenerEmpleadosDesdeLocalStorage();
    const indice = parseInt(indexEmpleado);
    if (indice >= empleados.length) {
        alert("No se encontró el empleado a editar");
        return;
    }
    empleados[indice] = empleado;
    actualizarEmpleadosEnLocalStorage(empleados);
};

const obtenerEmpleadosDesdeLocalStorage = () => {
    return JSON.parse(localStorage.getItem("empleados")) || [];
};

const actualizarEmpleadosEnLocalStorage = (empleados) => {
    localStorage.setItem("empleados", JSON.stringify(empleados));
    cargarEmpleadosDesdeLocalStorage();
};

const agregarEmpleadoATabla = (empleado, indice) => {
    const cuerpoTabla = document.getElementById("bodyTablaEmpleados");
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${indice + 1}</td>
        <td>${empleado.nombre}</td>
        <td>${empleado.apellido}</td>
        <td>${empleado.edad}</td>
        <td class="text-center">
            <button class="btn btn-warning btn-edit" data-indice="${indice}">Editar</button>
            <button class="btn btn-danger btn-delete" data-indice="${indice}">Eliminar</button>
        </td>
    `;
    cuerpoTabla.appendChild(fila);

    // Event listeners para editar y eliminar
    fila.querySelector('.btn-edit').addEventListener('click', () => prepararEdicionEmpleado(indice));
    fila.querySelector('.btn-delete').addEventListener('click', () => eliminarEmpleado(indice));
};

// Editar empleado
const prepararEdicionEmpleado = (indice) => {
    const empleados = obtenerEmpleadosDesdeLocalStorage();
    const empleado = empleados[indice];

    document.getElementById("firstName").value = empleado.nombre;
    document.getElementById("lastName").value = empleado.apellido;
    document.getElementById("age").value = empleado.edad;
    document.getElementById("employeeIndex").value = indice; // Guardar el índice para editar
};

// Eliminar empleado
const eliminarEmpleado = (indice) => {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
        const empleados = obtenerEmpleadosDesdeLocalStorage();
        empleados.splice(indice, 1); // Eliminar empleado por su índice
        actualizarEmpleadosEnLocalStorage(empleados);
    }
};

// Reiniciar formulario
const reiniciarFormulario = () => {
    document.getElementById("formularioEmpleados").reset();
    document.getElementById("employeeIndex").value = ""; // Limpiar el índice después de la edición
};
