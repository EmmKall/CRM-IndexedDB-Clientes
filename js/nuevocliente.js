( function(){

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        formulario.addEventListener('submit', validarDatos);

    });

    function validarDatos(e) {
        e.preventDefault();
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if( nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        id = Date.now();
        const cliente = { id, nombre, email, telefono, empresa }
        crearCliente(cliente);

        formulario.reset();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        
    }

    function crearCliente(cliente){
        //Guardar en la DB
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objStore = transaction.objectStore('crm');
        objStore.add(cliente);
        transaction.onerror = () => { imprimirAlerta('Hubo un error al guardar el registro', 'error'); }
        transaction.oncomplete = () => { imprimirAlerta('Cliente creado correctamente'); }
    }

})();