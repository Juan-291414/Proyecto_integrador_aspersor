class Terreno {
    static ultimoId = 0;
    static PREFIJO = 'T-';
    static todosLosTerrenos = [];

    constructor(ancho, largo) {
        if (ancho <= 0 || largo <= 0) {
            throw new Error("Las dimensiones del terreno deben ser positivas.");
        }
        
        this.ancho = ancho;
        this.largo = largo;
        this.id = Terreno.PREFIJO + String(++Terreno.ultimoId).padStart(2, '0');
        this.aspersorActivo = false;
        this.humedad = 0;
        this.asignadoA = null;
        
        Terreno.todosLosTerrenos.push(this);
    }

    get area() {
        return parseFloat((this.ancho * this.largo).toFixed(2));
    }
    
    mostrarInfo() {
        console.log(`Terreno ${this.id}`);
        console.log(`Dimensiones: ${this.ancho}m x ${this.largo}m`);
        console.log(`Área: ${this.area} m²`);
        console.log(`Aspersor: ${this.aspersorActivo ? 'ACTIVO' : 'INACTIVO'}`);
        console.log(`Humedad: ${this.humedad}%`);
        console.log(`Asignado a: ${this.asignadoA ? this.asignadoA : 'Ninguno'}`);
    }

    toggleAspersor() {
        this.aspersorActivo = !this.aspersorActivo;
        console.log(`Aspersor del terreno ${this.id} ahora está ${this.aspersorActivo ? 'ACTIVO' : 'INACTIVO'}.`);
    }

    setHumedad(newHumedad) {
        if (newHumedad >= 0 && newHumedad <= 100) {
            this.humedad = newHumedad;
            console.log(`Humedad del terreno ${this.id} actualizada a ${this.humedad}%.`);
        } else {
            console.warn("La humedad debe ser un valor entre 0 y 100.");
        }
    }
}

class Usuario {
    #password;
    static usuarios = [];
    static usuarioActual = null;

    constructor(nombre, password, rol) {
        this.nombre = nombre;
        this.#password = password;
        this.rol = rol;
    }

    getNombreUsuario() {
        return this.nombre;
    }

    verificarContrasena(contrasenaIngresada) {
        return this.#password === contrasenaIngresada;
    }

    accederPanel() {
        console.warn(`El usuario ${this.nombre} (${this.rol}) ha accedido. (Implementación base)`);
        alert(`¡Bienvenido, ${this.nombre}! Has accedido.`);
        mostrarSeccion("welcomeSection");
    }

    static crearUsuario(rol, nombre, password) {
        if (Usuario.usuarios.some(u => u.getNombreUsuario() === nombre)) {
            console.warn(`El usuario con el nombre '${nombre}' ya existe. No se puede crear.`);
            return null;
        }

        let nuevoUsuario;
        switch (rol.toLowerCase()) {
            case "administrador":
            case "admin":
                nuevoUsuario = new Administrador(nombre, password);
                break;
            case "campesino":
                nuevoUsuario = new Campesino(nombre, password);
                break;
            default:
                console.error(`Rol desconocido: ${rol}. No se puede crear el usuario.`);
                return null;
        }
        Usuario.usuarios.push(nuevoUsuario);
        console.log(`Usuario '${nombre}' con rol '${rol}' creado y añadido al sistema.`);
        return nuevoUsuario;
    }

    static autenticarUsuario(username, password) {
        const usuarioEncontrado = Usuario.usuarios.find(
            (u) => u.getNombreUsuario() === username && u.verificarContrasena(password)
        );
        if (usuarioEncontrado) {
            Usuario.usuarioActual = usuarioEncontrado;
        }
        return usuarioEncontrado || null;
    }

    static iniciarSesionDesdeFormulario() {
        const formLogin = document.getElementById("formLogin");
        const loginNombreInput = document.getElementById("loginNombre");
        const loginContrasenaInput = document.getElementById("loginContrasena");
        const mensajeLogin = document.getElementById("mensajeLogin");

        if (!formLogin || !loginNombreInput || !loginContrasenaInput || !mensajeLogin) {
            console.error("Elementos del formulario de login no encontrados. La autenticación no se adjuntará.");
            return;
        }

        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = loginNombreInput.value;
            const password = loginContrasenaInput.value;

            const usuarioAutenticado = Usuario.autenticarUsuario(username, password);

            if (usuarioAutenticado) {
                mensajeLogin.textContent = `Bienvenido, ${usuarioAutenticado.getNombreUsuario()} (${usuarioAutenticado.rol})`;
                mensajeLogin.style.color = "green";
                usuarioAutenticado.accederPanel();
                formLogin.reset();
            } else {
                mensajeLogin.textContent = "Nombre de usuario o contraseña inválidos";
                mensajeLogin.style.color = "red";
            }
        });
    }

    static registrarCampesinoDesdeFormulario() {
        const formCrearUsuario = document.getElementById("formCrearUsuario");
        const nombreUsuarioInput = document.getElementById("nombreUsuario");
        const contrasenaUsuarioInput = document.getElementById("contrasenaUsuario");
        const mensajeRegistro = document.getElementById("mensajeRegistro");

        if (!formCrearUsuario || !nombreUsuarioInput || !contrasenaUsuarioInput || !mensajeRegistro) {
            console.error("Elementos del formulario de registro no encontrados. El registro no se adjuntará.");
            return;
        }

        formCrearUsuario.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = nombreUsuarioInput.value;
            const contrasena = contrasenaUsuarioInput.value;

            const nuevoCampesino = Usuario.crearUsuario("campesino", nombre, contrasena);

            if (nuevoCampesino) {
                mensajeRegistro.textContent = "Campesino registrado con éxito";
                mensajeRegistro.style.color = "green";
                formCrearUsuario.reset();
            } else {
                mensajeRegistro.textContent = "Error al registrar el campesino (posiblemente ya existe).";
                mensajeRegistro.style.color = "red";
            }
        });
    }

    static crearUsuarioDesdeAdminFormulario() {
        const formAdminCrearUsuario = document.getElementById("formAdminCrearUsuario");
        const adminNombreUsuarioInput = document.getElementById("adminNombreUsuario");
        const adminContrasenaUsuarioInput = document.getElementById("adminContrasenaUsuario");
        const adminRolUsuarioSelect = document.getElementById("adminRolUsuario");
        const mensajeAdminCrearUsuario = document.getElementById("mensajeAdminCrearUsuario");

        if (!formAdminCrearUsuario || !adminNombreUsuarioInput || !adminContrasenaUsuarioInput || !adminRolUsuarioSelect || !mensajeAdminCrearUsuario) {
            console.error("Elementos del formulario de administración para crear usuario no encontrados.");
            return;
        }

        formAdminCrearUsuario.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = adminNombreUsuarioInput.value;
            const contrasena = adminContrasenaUsuarioInput.value;
            const rol = adminRolUsuarioSelect.value;

            const nuevoUsuario = Usuario.crearUsuario(rol, nombre, contrasena);

            if (nuevoUsuario) {
                mensajeAdminCrearUsuario.textContent = `Usuario ${nombre} (${rol}) creado con éxito.`;
                mensajeAdminCrearUsuario.style.color = "green";
                formAdminCrearUsuario.reset();
                Usuario.actualizarListaUsuariosAdmin();
                Usuario.actualizarSelectAsignarTerreno();
            } else {
                mensajeAdminCrearUsuario.textContent = "Error al crear el usuario (posiblemente ya existe).";
                mensajeAdminCrearUsuario.style.color = "red";
            }
        });
    }

    static crearTerrenoDesdeAdminFormulario() {
        const formAdminCrearTerreno = document.getElementById("formAdminCrearTerreno");
        const adminAnchoTerrenoInput = document.getElementById("adminAnchoTerreno");
        const adminLargoTerrenoInput = document.getElementById("adminLargoTerreno");
        const mensajeAdminCrearTerreno = document.getElementById("mensajeAdminCrearTerreno");

        if (!formAdminCrearTerreno || !adminAnchoTerrenoInput || !adminLargoTerrenoInput || !mensajeAdminCrearTerreno) {
            console.error("Elementos del formulario de administración para crear terreno no encontrados.");
            return;
        }

        formAdminCrearTerreno.addEventListener("submit", (e) => {
            e.preventDefault();

            const ancho = parseFloat(adminAnchoTerrenoInput.value);
            const largo = parseFloat(adminLargoTerrenoInput.value);

            try {
                const nuevoTerreno = new Terreno(ancho, largo);
                mensajeAdminCrearTerreno.textContent = `Terreno ${nuevoTerreno.id} (Área: ${nuevoTerreno.area}m²) creado con éxito.`;
                mensajeAdminCrearTerreno.style.color = "green";
                formAdminCrearTerreno.reset();
                Usuario.actualizarListaTerrenosAdmin();
                Usuario.actualizarSelectAsignarTerreno(); 

            } catch (error) {
                mensajeAdminCrearTerreno.textContent = `Error al crear el terreno: ${error.message}`;
                mensajeAdminCrearTerreno.style.color = "red";
            }
        });
    }

    static asignarTerrenoDesdeAdminFormulario() {
        const formAdminAsignarTerreno = document.getElementById("formAdminAsignarTerreno");
        const selectCampesino = document.getElementById("selectCampesinoAsignar");
        const selectTerreno = document.getElementById("selectTerrenoAsignar");
        const mensajeAsignarTerreno = document.getElementById("mensajeAsignarTerreno");

        if (!formAdminAsignarTerreno || !selectCampesino || !selectTerreno || !mensajeAsignarTerreno) {
            console.error("Elementos del formulario de asignación de terreno no encontrados.");
            return;
        }

        formAdminAsignarTerreno.addEventListener("submit", (e) => {
            e.preventDefault();

            const campesinoNombre = selectCampesino.value;
            const terrenoId = selectTerreno.value;

            const campesino = Usuario.usuarios.find(u => u.getNombreUsuario() === campesinoNombre && u.rol === 'campesino');
            const terreno = Terreno.todosLosTerrenos.find(t => t.id === terrenoId);

            if (campesino && terreno) {
                if (terreno.asignadoA) {
                    mensajeAsignarTerreno.textContent = `El terreno ${terreno.id} ya está asignado a ${terreno.asignadoA}.`;
                    mensajeAsignarTerreno.style.color = "orange";
                    return;
                }
                if (campesino.terrenoAsignado) {
                    mensajeAsignarTerreno.textContent = `El campesino ${campesino.nombre} ya tiene asignado el terreno ${campesino.terrenoAsignado.id}.`;
                    mensajeAsignarTerreno.style.color = "orange";
                    return;
                }

                campesino.terrenoAsignado = terreno;
                terreno.asignadoA = campesino.nombre;
                mensajeAsignarTerreno.textContent = `Terreno ${terreno.id} asignado a ${campesino.nombre} con éxito.`;
                mensajeAsignarTerreno.style.color = "green";
                Usuario.actualizarListaTerrenosAdmin();
                Usuario.actualizarSelectAsignarTerreno();
                
            } else {
                mensajeAsignarTerreno.textContent = "Error: Campesino o Terreno no encontrado.";
                mensajeAsignarTerreno.style.color = "red";
            }
        });
    }

    static actualizarListaUsuariosAdmin() {
        const listaUsuariosDiv = document.getElementById("listaUsuarios");
        if (!listaUsuariosDiv) return;

        listaUsuariosDiv.innerHTML = '<h4>Lista de Usuarios:</h4><ul>' +
            Usuario.usuarios.map(u => `<li>${u.getNombreUsuario()} (Rol: ${u.rol})</li>`).join('') +
            '</ul>';
    }

    static actualizarListaTerrenosAdmin() {
        const listaTerrenosDiv = document.getElementById("listaTerrenos");
        if (!listaTerrenosDiv) return;

        if (Terreno.todosLosTerrenos.length === 0) {
            listaTerrenosDiv.innerHTML = '<p>No hay terrenos registrados.</p>';
            return;
        }

        listaTerrenosDiv.innerHTML = '<h4>Lista de Terrenos:</h4><ul>' +
            Terreno.todosLosTerrenos.map(t => `<li>ID: ${t.id}, Ancho: ${t.ancho}m, Largo: ${t.largo}m, Área: ${t.area}m² ${t.asignadoA ? `(Asignado a: ${t.asignadoA})` : ''}</li>`).join('') +
            '</ul>';
    }

    static actualizarSelectAsignarTerreno() {
        const selectCampesino = document.getElementById("selectCampesinoAsignar");
        const selectTerreno = document.getElementById("selectTerrenoAsignar");

        if (!selectCampesino || !selectTerreno) return;

        selectCampesino.innerHTML = '<option value="">Seleccione Campesino</option>';
        selectTerreno.innerHTML = '<option value="">Seleccione Terreno</option>';

        Usuario.usuarios.filter(u => u.rol === 'campesino').forEach(campesino => {
            const option = document.createElement('option');
            option.value = campesino.getNombreUsuario();
            option.textContent = campesino.getNombreUsuario();
            selectCampesino.appendChild(option);
        });

        Terreno.todosLosTerrenos.forEach(terreno => {
            const option = document.createElement('option');
            option.value = terreno.id;
            option.textContent = `${terreno.id} (Área: ${terreno.area}m²) ${terreno.asignadoA ? `(Asignado a: ${terreno.asignadoA})` : ''}`;
            selectTerreno.appendChild(option);
        });
    }

    static cerrarSesion() {
        Usuario.usuarioActual = null;
        mostrarSeccion("welcomeSection");

        const formLogin = document.getElementById("formLogin");
        if (formLogin) formLogin.reset();
        const mensajeLogin = document.getElementById("mensajeLogin");
        if (mensajeLogin) mensajeLogin.textContent = "";

        console.log("Sesión cerrada.");
        alert("¡Has cerrado sesión!");
    }
}

class Administrador extends Usuario {
    constructor(nombre, password) {
        super(nombre, password, "administrador");
    }

    accederPanel() {
        if (Usuario.usuarioActual && Usuario.usuarioActual.rol === "administrador") {
            const adminUsernameSpan = document.getElementById("adminUsername");
            const adminUserRoleSpan = document.getElementById("adminUserRole");
            if (adminUsernameSpan) adminUsernameSpan.textContent = this.nombre;
            if (adminUserRoleSpan) adminUserRoleSpan.textContent = this.rol;

            Usuario.actualizarListaUsuariosAdmin();
            Usuario.actualizarListaTerrenosAdmin();
            Usuario.actualizarSelectAsignarTerreno();

            mostrarSeccion("adminSection");
            console.log(`El administrador ${this.nombre} ha accedido al panel de administración.`);
        } else {
            console.error("Intento de acceder a panel de admin sin ser administrador.");
            mostrarSeccion("welcomeSection");
        }
    }
}

class Campesino extends Usuario {
    constructor(nombre, password) {
        super(nombre, password, "campesino");
        this.terrenoAsignado = null;
        this.aspersorEncendido = false;
    }

    accederPanel() {
        if (Usuario.usuarioActual && Usuario.usuarioActual.rol === "campesino") {
            const campesinoUsernameSpan = document.getElementById("campesinoUsername");
            const campesinoUserRoleSpan = document.getElementById("campesinoUserRole");
            const infoTerrenoCampesinoSpan = document.getElementById("infoTerrenoCampesino");
            const estadoAspersorCampesinoSpan = document.getElementById("estadoAspersorCampesino");

            if (campesinoUsernameSpan) campesinoUsernameSpan.textContent = this.nombre;
            if (campesinoUserRoleSpan) campesinoUserRoleSpan.textContent = this.rol;

            if (infoTerrenoCampesinoSpan) {
                if (this.terrenoAsignado) {
                    infoTerrenoCampesinoSpan.textContent = `ID: ${this.terrenoAsignado.id}, Área: ${this.terrenoAsignado.area}m²`;
                    this.aspersorEncendido = this.terrenoAsignado.aspersorActivo; 
                } else {
                    infoTerrenoCampesinoSpan.textContent = "Ninguno asignado.";
                    this.aspersorEncendido = false;
                }
            }
            if (estadoAspersorCampesinoSpan) estadoAspersorCampesinoSpan.textContent = this.aspersorEncendido ? "ENCENDIDO" : "APAGADO";


            mostrarSeccion("campesinoSection");
            console.log(`El campesino ${this.nombre} ha accedido al panel del campesino.`);
        } else {
            console.error("Intento de acceder a panel de campesino sin ser campesino.");
            mostrarSeccion("welcomeSection");
        }
    }

    encenderAspersor() {
        if (this.terrenoAsignado) {
            if (!this.terrenoAsignado.aspersorActivo) {
                this.terrenoAsignado.toggleAspersor(); 
                this.aspersorEncendido = this.terrenoAsignado.aspersorActivo;
                document.getElementById("estadoAspersorCampesino").textContent = "ENCENDIDO";
                alert(`Aspersor de ${this.nombre} en terreno ${this.terrenoAsignado.id} encendido.`);
            } else {
                alert("El aspersor ya está encendido.");
            }
        } else {
            alert("No tienes un terreno asignado para encender el aspersor.");
        }
    }

    apagarAspersor() {
        if (this.terrenoAsignado) {
            if (this.terrenoAsignado.aspersorActivo) {
                this.terrenoAsignado.toggleAspersor();
                this.aspersorEncendido = this.terrenoAsignado.aspersorActivo;
                document.getElementById("estadoAspersorCampesino").textContent = "APAGADO";
                alert(`Aspersor de ${this.nombre} en terreno ${this.terrenoAsignado.id} apagado.`);
            } else {
                alert("El aspersor ya está apagado.");
            }
        } else {
            alert("No tienes un terreno asignado para apagar el aspersor.");
        }
    }
}

function mostrarSeccion(idSeccion) {
    const mainContainers = document.querySelectorAll('.main-container');
    mainContainers.forEach(container => {
        container.classList.add('hidden');
        container.classList.remove('visible');
    });

    const targetSection = document.getElementById(idSeccion);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('visible');
    } else {
        console.error(`Sección con ID '${idSeccion}' no encontrada.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Usuario.crearUsuario("administrador", "Jsnavaro", "kaka");
    Usuario.crearUsuario("campesino", "Daniel", "1234");

    Usuario.iniciarSesionDesdeFormulario();
    Usuario.registrarCampesinoDesdeFormulario();
    Usuario.crearUsuarioDesdeAdminFormulario();
    Usuario.crearTerrenoDesdeAdminFormulario();
    Usuario.asignarTerrenoDesdeAdminFormulario();

    Usuario.actualizarSelectAsignarTerreno();

    const showLoginBtn = document.getElementById("showLoginBtn");
    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", () => mostrarSeccion("loginSection"));
    }

    const showRegisterBtn = document.getElementById("showRegisterBtn");
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", () => mostrarSeccion("registerSection"));
    }

    const backToWelcomeFromLoginBtn = document.getElementById("backToWelcomeFromLogin");
    if (backToWelcomeFromLoginBtn) {
        backToWelcomeFromLoginBtn.addEventListener("click", () => mostrarSeccion("welcomeSection"));
    }

    const backToWelcomeFromRegisterBtn = document.getElementById("backToWelcomeFromRegister");
    if (backToWelcomeFromRegisterBtn) {
        backToWelcomeFromRegisterBtn.addEventListener("click", () => mostrarSeccion("welcomeSection"));
    }

    const logoutAdminBtn = document.getElementById("logoutAdminBtn");
    if (logoutAdminBtn) {
        logoutAdminBtn.addEventListener("click", () => Usuario.cerrarSesion());
    }

    const logoutCampesinoBtn = document.getElementById("logoutCampesinoBtn");
    if (logoutCampesinoBtn) {
        logoutCampesinoBtn.addEventListener("click", () => Usuario.cerrarSesion());
    }

    const btnEncenderAspersor = document.getElementById("btnEncenderAspersor");
    if (btnEncenderAspersor) {
        btnEncenderAspersor.addEventListener("click", () => {
            if (Usuario.usuarioActual instanceof Campesino) {
                Usuario.usuarioActual.encenderAspersor();
            }
        });
    }

    const btnApagarAspersor = document.getElementById("btnApagarAspersor");
    if (btnApagarAspersor) {
        btnApagarAspersor.addEventListener("click", () => {
            if (Usuario.usuarioActual instanceof Campesino) {
                Usuario.usuarioActual.apagarAspersor();
            }
        });
    }

    mostrarSeccion("welcomeSection");
});     
