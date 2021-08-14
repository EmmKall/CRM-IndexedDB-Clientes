( function() {
    
    let idCliente;
    
    const formulario = document.querySelector('#formulario');
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    
    document.addEventListener('DOMContentLoaded', () => {
        
        conectarDB();

        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = Number(parametrosURL.get('id'));
        
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente); 
            }, 350);
        }

        formulario.addEventListener('submit', validarDatos);

    });

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objStore = transaction.objectStore('crm');
        
        const cliente = objStore.openCursor();
        cliente.onerror = () => { console.log('Hubo un error'); }
        cliente.onsuccess = (e) => {
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === id){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario(cliente){
        const { nombre, email, telefono, empresa } = cliente;
        nombreInput.value= nombre;
        emailInput.value= email;
        telefonoInput.value= telefono;
        empresaInput.value= empresa;
    }

    function actualizarCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const ojbStore = transaction.objectStore('crm');

        ojbStore.put(cliente);
        
        transaction.onerror = () => { imprimirAlerta('No se actualizo el cliente', 'error'); }
        transaction.oncomplete = () => {
            imprimirAlerta('Cliente actualizado');
            
            formulario.reset();

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }

    }

    function validarDatos(e){
        e.preventDefault();
        const nombre = nombreInput.value;
        const email = emailInput.value;
        const telefono = telefonoInput.value;
        const empresa = empresaInput.value;

        if( nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los datos son obligatorios');
            return;
        }

        const cliente = { nombre, email, telefono, empresa };
        cliente.id = idCliente;

        actualizarCliente(cliente);

    }

})();