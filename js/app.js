( function() {
    
    let DB;
    const listado = document.querySelector('#listado-clientes');
    
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if(window.indexedDB.open('crm', 1)){
            cargarLista();
        }

        listado.addEventListener('click', eliminarRegistro);
    });

    function crearDB() {
    
        const crearDB = window.indexedDB.open('crm', 1);
    
        crearDB.onerror = () => {
            console.log('Error al crear la DB');
        }
    
        crearDB.onsuccess = () => {
            DB = crearDB.result;
        }
    
        crearDB.onupgradeneeded = (e) => {
            const db = e.target.result;
            const objStore = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true,
            });
    
            objStore.createIndex('id', 'id', {unique: true});
            objStore.createIndex('nombre', 'nombre', {unique: false});
            objStore.createIndex('email', 'email', {unique: true});
            objStore.createIndex('telefono', 'telefono', {unique: false});
            objStore.createIndex('empresa', 'empresa', {unique: false});

            console.log('The squema od DB was created');
        }
    }

    function cargarLista(){

        const abrirConexion = window.indexedDB.open('crm', 1);
        abrirConexion.onerror = () => { console.log('Hubo un error'); }
        abrirConexion.onsuccess = () => { 
            DB = abrirConexion.result;

            const objStore = DB.transaction('crm').objectStore('crm');
            objStore.openCursor().onsuccess = (e) => {
                const cursor = e.target.result;

                if(cursor){

                    crearFila(cursor.value);
                    
                    cursor.continue();
                }
            }
         }

    }
    
    function crearFila(cliente){

        const { nombre, telefono, empresa, email, id } = cliente;

        const fila = document.createElement('TR');
        fila.classList.add('text-center');
        const nombreTd = document.createElement('TD');
        nombreTd.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'text-gray-700');
        const telefonoTd = document.createElement('TD');
        telefonoTd.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'text-gray-700');
        const empresaTd = document.createElement('TD');
        empresaTd.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'text-gray-700');
        const accionesTd = document.createElement('TD');
        accionesTd.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'text-gray-700');

        nombreTd.innerHTML = `
            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
        `;
        telefonoTd.textContent = telefono;
        empresaTd.textContent = empresa;
        accionesTd.innerHTML = `
            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
        `;
        
        fila.appendChild(nombreTd);
        fila.appendChild(telefonoTd);
        fila.appendChild(empresaTd);
        fila.appendChild(accionesTd);

        listado.appendChild(fila);
        
    }

    function eliminarRegistro(e){

        if(e.target.classList.contains('eliminar')){
            
            const id = Number(e.target.dataset.cliente);

            const eliminar = confirm('¿Deseas eliminar el registro');

            if(eliminar){
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objStore = transaction.objectStore('crm');
                objStore.delete(id);
                
                quitarElemento(e);

                transaction.onerror = () => { alert('Error al elininar'); }
                transaction.oncomplete = () => { alert('Se elimino Cliente'); }
            }
        }
    }

    function quitarElemento(e){

        e.target.parentElement.parentElement.remove();
    }


} )();