// Clase que encapsula los cálculos del sistema de microaspersión
class MicroAspersion {
    // El constructor ahora recibe una instancia de Terreno y el tiempo
    constructor(terreno, tiempo) { // Eliminamos 'altura' de los parámetros
        if (!(terreno instanceof Terreno)) {
            throw new Error("El primer argumento debe ser una instancia de la clase Terreno.");
        }
        this.terreno = terreno; // Almacenamos el objeto Terreno completo
        this.tiempo = tiempo;
        this.orificios = 26; // Número fijo de orificios por UN microaspersor
        this.radioOrificio = 0.8 / 1000; // Radio del orificio en metros (0.8 mm)
        this.g = 9.81;       // Aceleración gravitatoria (m/s²)
        this.rho = 1000;     // Densidad del agua (kg/m³)
    }

    // Acceder a la altura del depósito desde el objeto Terreno
    get altura() {
        return this.terreno.alturaDeposito;
    }

    // Cálculo de presión hidrostática
    calcularPresion() {
        return this.rho * this.g * this.altura; // Usa el getter de altura
    }

    // Velocidad de salida según Torricelli (basada en el orificio interno)
    calcularVelocidadSalida() {
        return Math.sqrt(2 * this.g * this.altura); // Usa el getter de altura
    }

    // Área de un orificio circular (basada en el orificio interno)
    calcularAreaOrificio() {
        return Math.PI * Math.pow(this.radioOrificio, 2);
    }

    // Caudal por orificio (m³/s)
    calcularCaudalPorOrificio() {
        return this.calcularAreaOrificio() * this.calcularVelocidadSalida();
    }

    // Caudal total de UN microaspersor (m³/s)
    calcularCaudalDeUnAspersor() {
        return this.calcularCaudalPorOrificio() * this.orificios;
    }

    // Volumen total de agua liberada por UN microaspersor en el tiempo dado (litros)
    calcularAguaTotalPorUnAspersor() {
        return this.calcularCaudalDeUnAspersor() * this.tiempo * 1000; // litros
    }

    // Nuevo método para calcular el radio de cobertura del aspersor
    calcularRadioCobertura() {
        const velocidadSalida = this.calcularVelocidadSalida();
        // Asumimos un lanzamiento horizontal desde la altura dada
        // Esto es una simplificación y puede no ser exacto para todos los tipos de aspersores
        return velocidadSalida * Math.sqrt((2 * this.altura) / this.g);
    }

    // Área de cobertura de UN microaspersor (m²) - Ahora usa el radio calculado
    calcularAreaCoberturaAspersor() {
        const radioCobertura = this.calcularRadioCobertura();
        return Math.PI * Math.pow(radioCobertura, 2);
    }

    // Número de microaspersores necesarios para cubrir el terreno (aproximado, sin solapamiento)
    calcularNumeroDeAspersores() {
        const areaCoberturaUnitario = this.calcularAreaCoberturaAspersor();
        if (areaCoberturaUnitario === 0) return Infinity; // Evitar división por cero
        // Accedemos al área del terreno a través de la instancia de Terreno
        return Math.ceil(this.terreno.area / areaCoberturaUnitario); 
    }

    // Caudal total para el terreno (L/s)
    calcularCaudalTotalTerreno() {
        return this.calcularCaudalDeUnAspersor() * this.calcularNumeroDeAspersores() * 1000;
    }

    // Volumen total de agua para todo el terreno (litros)
    calcularAguaTotalTerreno() {
        // FIX: Se eliminó la división innecesaria por 1000
        return this.calcularCaudalTotalTerreno() * this.tiempo;
    }

    // Distribución de agua por metro cuadrado para todo el terreno (L/m²)
    calcularDistribucionPorM2Terreno() {
         // Accedemos al área del terreno a través de la instancia de Terreno
         return this.calcularAguaTotalTerreno() / this.terreno.area;
    }

    // Genera una cadena HTML con todos los resultados
    mostrarResultados() {
        const P = this.calcularPresion();
        const P_bar = P / 100000;
        const v = this.calcularVelocidadSalida();
        const A_orificio = this.calcularAreaOrificio();
        const Q_orificio = this.calcularCaudalPorOrificio();
        const Q_un_aspersor = this.calcularCaudalDeUnAspersor();
        const agua_un_aspersor_L = this.calcularAguaTotalPorUnAspersor();
        const radio_cobertura_calculado = this.calcularRadioCobertura(); 
        const area_cobertura_aspersor = this.calcularAreaCoberturaAspersor();
        const num_aspersores = this.calcularNumeroDeAspersores();
        const Q_total_terreno = this.calcularCaudalTotalTerreno();
        const agua_total_terreno_L = this.calcularAguaTotalTerreno();
        const distribucion_m2_terreno = this.calcularDistribucionPorM2Terreno();

        return `
            <h2>Resultados de Simulación para Terreno ${this.terreno.id}</h2>
            <p><strong>Dimensiones del Terreno:</strong> ${this.terreno.ancho}m x ${this.terreno.largo}m</p>
            <p><strong>Área del Terreno:</strong> ${this.terreno.area} m²</p>
            <p><strong>Altura del Depósito de Agua:</strong> ${this.terreno.alturaDeposito} m</p>
            <hr>
            <strong>Presión hidrostática:</strong> ${P.toFixed(2)} Pa ≈ ${P_bar.toFixed(3)} bar<br>
            <strong>Velocidad de salida (orificio):</strong> ${v.toFixed(2)} m/s<br>
            <strong>Área por orificio (radio ${this.radioOrificio * 1000} mm):</strong> ${A_orificio.toExponential(2)} m²<br>
            <strong>Caudal por orificio:</strong> ${(Q_orificio * 1000).toFixed(4)} L/s<br>
            <hr>
            <h3>Resultados por Microaspersor Individual (con ${this.orificios} orificios)</h3>
            <strong>Caudal de UN microaspersor:</strong> ${(Q_un_aspersor * 1000).toFixed(4)} L/s<br>
            <strong>Volumen de agua por UN microaspersor en ${this.tiempo} s:</strong> ${agua_un_aspersor_L.toFixed(3)} L<br>
            <strong>Radio de cobertura de UN microaspersor (calculado):</strong> ${radio_cobertura_calculado.toFixed(2)} m<br>
            <strong>Área de cobertura de UN microaspersor:</strong> ${area_cobertura_aspersor.toFixed(2)} m²<br>
            <hr>
            <h3>Resultados para el Terreno Completo (${this.terreno.area} m²)</h3>
            <strong>Microaspersores Necesarios (aprox.):</strong> ${num_aspersores}<br>
            <strong>Caudal total para el terreno:</strong> ${Q_total_terreno.toFixed(4)} L/s<br>
            <strong>Volumen total de agua para el terreno en ${this.tiempo} s:</strong> ${agua_total_terreno_L.toFixed(3)} L<br>
            <strong>Distribución de agua por m² en el terreno:</strong> ${distribucion_m2_terreno.toFixed(5)} L/m²
        `;
    }
}

class Terreno {
    static ultimoId = 0;
    static PREFIJO = 'T-';
    static todosLosTerrenos = [];

    // Ahora el constructor de Terreno también acepta la altura del depósito
    constructor(ancho, largo, alturaDeposito) {
        if (ancho <= 0 || largo <= 0) {
            throw new Error("Las dimensiones del terreno deben ser positivas.");
        }
        if (alturaDeposito <= 0) {
            throw new Error("La altura del depósito de agua debe ser positiva.");
        }
        
        this.ancho = ancho;
        this.largo = largo;
        this.alturaDeposito = alturaDeposito; // Nueva propiedad
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
        alert(`Terreno ${this.id}\nDimensiones: ${this.ancho}m x ${this.largo}m\nÁrea: ${this.area} m²\nAltura del Depósito: ${this.alturaDeposito} m\nAspersor: ${this.aspersorActivo ? 'ACTIVO' : 'INACTIVO'}\nHumedad: ${this.humedad}%\nAsignado a: ${this.asignadoA ? this.asignadoA : 'Ninguno'}`);
    }

    toggleAspersor() {
        this.aspersorActivo = !this.aspersorActivo;
        alert(`Aspersor del terreno ${this.id} ahora está ${this.aspersorActivo ? 'ACTIVO' : 'INACTIVO'}.`);
    }

    setHumedad(newHumedad) {
        if (newHumedad >= 0 && newHumedad <= 100) {
            this.humedad = newHumedad;
            alert(`Humedad del terreno ${this.id} actualizada a ${this.humedad}%.`);
        } else {
            alert("La humedad debe ser un valor entre 0 y 100.");
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
        alert(`¡Bienvenido, ${this.nombre}! Has accedido.`);
        mostrarSeccion("inicioSection");
    }

    static crearUsuario(rol, nombre, password) {
        if (Usuario.usuarios.some(u => u.getNombreUsuario() === nombre)) {
            alert(`El usuario con el nombre '${nombre}' ya existe. No se puede crear.`);
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
                alert(`Rol desconocido: ${rol}. No se puede crear el usuario.`);
                return null;
        }
        Usuario.usuarios.push(nuevoUsuario);
        alert(`Usuario '${nombre}' con rol '${rol}' creado y añadido al sistema.`);
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

        if (!formLogin || !loginNombreInput || !loginContrasenaInput) {
            alert("Elementos del formulario de login no encontrados. La autenticación no se adjuntará.");
            return;
        }

        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = loginNombreInput.value;
            const password = loginContrasenaInput.value;

            const usuarioAutenticado = Usuario.autenticarUsuario(username, password);

            if (usuarioAutenticado) {
                alert(`Bienvenido, ${usuarioAutenticado.getNombreUsuario()} (${usuarioAutenticado.rol})`);
                usuarioAutenticado.accederPanel();
                formLogin.reset();
                actualizarNavbar();
            } else {
                alert("Nombre de usuario o contraseña inválidos");
            }
        });
    }

    static registrarCampesinoDesdeFormulario() {
        const formCrearUsuario = document.getElementById("formCrearUsuario");
        const nombreUsuarioInput = document.getElementById("nombreUsuario");
        const contrasenaUsuarioInput = document.getElementById("contrasenaUsuario");

        if (!formCrearUsuario || !nombreUsuarioInput || !contrasenaUsuarioInput) {
            alert("Elementos del formulario de registro no encontrados. El registro no se adjuntará.");
            return;
        }

        formCrearUsuario.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = nombreUsuarioInput.value;
            const contrasena = contrasenaUsuarioInput.value;

            const nuevoCampesino = Usuario.crearUsuario("campesino", nombre, contrasena);

            if (nuevoCampesino) {
                alert("Campesino registrado con éxito");
                formCrearUsuario.reset();
            } else {
                alert("Error al registrar el campesino (posiblemente ya existe).");
            }
        });
    }

    static crearUsuarioDesdeAdminFormulario() {
        const formAdminCrearUsuario = document.getElementById("formAdminCrearUsuario");
        const adminNombreUsuarioInput = document.getElementById("adminNombreUsuario");
        const adminContrasenaUsuarioInput = document.getElementById("adminContrasenaUsuario");
        const adminRolUsuarioSelect = document.getElementById("adminRolUsuario");

        if (!formAdminCrearUsuario || !adminNombreUsuarioInput || !adminContrasenaUsuarioInput || !adminRolUsuarioSelect) {
            alert("Elementos del formulario de administración para crear usuario no encontrados.");
            return;
        }

        formAdminCrearUsuario.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = adminNombreUsuarioInput.value;
            const contrasena = adminContrasenaUsuarioInput.value;
            const rol = adminRolUsuarioSelect.value;

            const nuevoUsuario = Usuario.crearUsuario(rol, nombre, contrasena);

            if (nuevoUsuario) {
                alert(`Usuario ${nombre} (${rol}) creado con éxito.`);
                formAdminCrearUsuario.reset();
                Usuario.actualizarListaUsuariosAdmin();
                Usuario.actualizarSelectAsignarTerreno();
            } else {
                alert("Error al crear el usuario (posiblemente ya existe).");
            }
        });
    }

    static crearTerrenoDesdeAdminFormulario() {
        const formAdminCrearTerreno = document.getElementById("formAdminCrearTerreno");
        const adminAnchoTerrenoInput = document.getElementById("adminAnchoTerreno");
        const adminLargoTerrenoInput = document.getElementById("adminLargoTerreno");
        const adminAlturaDepositoInput = document.getElementById("adminAlturaDeposito");

        if (!formAdminCrearTerreno || !adminAnchoTerrenoInput || !adminLargoTerrenoInput || !adminAlturaDepositoInput) {
            alert("Elementos del formulario de administración para crear terreno no encontrados.");
            return;
        }

        formAdminCrearTerreno.addEventListener("submit", (e) => {
            e.preventDefault();

            const ancho = parseFloat(adminAnchoTerrenoInput.value);
            const largo = parseFloat(adminLargoTerrenoInput.value);
            const alturaDeposito = parseFloat(adminAlturaDepositoInput.value);

            try {
                const nuevoTerreno = new Terreno(ancho, largo, alturaDeposito);
                alert(`Terreno ${nuevoTerreno.id} (Área: ${nuevoTerreno.area}m², Depósito: ${nuevoTerreno.alturaDeposito}m) creado con éxito.`);
                formAdminCrearTerreno.reset();
                Usuario.actualizarListaTerrenosAdmin();
                Usuario.actualizarSelectAsignarTerreno();
            } catch (error) {
                alert(`Error al crear el terreno: ${error.message}`);
            }
        });
    }

    static asignarTerrenoDesdeAdminFormulario() {
        const formAdminAsignarTerreno = document.getElementById("formAdminAsignarTerreno");
        const selectCampesino = document.getElementById("selectCampesinoAsignar");
        const selectTerreno = document.getElementById("selectTerrenoAsignar");

        if (!formAdminAsignarTerreno || !selectCampesino || !selectTerreno) {
            alert("Elementos del formulario de asignación de terreno no encontrados.");
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
                    alert(`El terreno ${terreno.id} ya está asignado a ${terreno.asignadoA}.`);
                    return;
                }
                if (campesino.terrenoAsignado) {
                    alert(`El campesino ${campesino.nombre} ya tiene asignado el terreno ${campesino.terrenoAsignado.id}.`);
                    return;
                }

                campesino.terrenoAsignado = terreno;
                terreno.asignadoA = campesino.nombre;
                alert(`Terreno ${terreno.id} asignado a ${campesino.nombre} con éxito.`);
                Usuario.actualizarListaTerrenosAdmin();
                Usuario.actualizarSelectAsignarTerreno();
            } else {
                alert("Error: Campesino o Terreno no encontrado.");
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
            Terreno.todosLosTerrenos.map(t => `<li>ID: ${t.id}, Ancho: ${t.ancho}m, Largo: ${t.largo}m, Área: ${t.area}m², Depósito: ${t.alturaDeposito}m ${t.asignadoA ? `(Asignado a: ${t.asignadoA})` : ''}</li>`).join('') +
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
            option.textContent = `${terreno.id} (Área: ${terreno.area}m², Depósito: ${terreno.alturaDeposito}m) ${terreno.asignadoA ? `(Asignado a: ${terreno.asignadoA})` : ''}`;
            selectTerreno.appendChild(option);
        });
    }

    static cerrarSesion() {
        Usuario.usuarioActual = null;
        mostrarSeccion("welcomeSection");
        actualizarNavbar();

        const formLogin = document.getElementById("formLogin");
        if (formLogin) formLogin.reset();

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
            alert(`El administrador ${this.nombre} ha accedido al panel de administración.`);
        } else {
            alert("Intento de acceder a panel de admin sin ser administrador.");
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
            const simulacionContainer = document.getElementById("simulacionContainer"); 
            const simulacionAlturaMostradaSpan = document.getElementById("simulacionAlturaMostrada");

            if (campesinoUsernameSpan) campesinoUsernameSpan.textContent = this.nombre;
            if (campesinoUserRoleSpan) campesinoUserRoleSpan.textContent = this.rol;

            if (infoTerrenoCampesinoSpan) {
                if (this.terrenoAsignado) {
                    infoTerrenoCampesinoSpan.textContent = `ID: ${this.terrenoAsignado.id}, Área: ${this.terrenoAsignado.area}m², Depósito: ${this.terrenoAsignado.alturaDeposito}m`;
                    this.aspersorEncendido = this.terrenoAsignado.aspersorActivo;
                    if (simulacionContainer) simulacionContainer.classList.remove('hidden');
                    if (simulacionAlturaMostradaSpan) {
                        simulacionAlturaMostradaSpan.textContent = this.terrenoAsignado.alturaDeposito.toFixed(2);
                    }
                } else {
                    infoTerrenoCampesinoSpan.textContent = "Ninguno asignado.";
                    this.aspersorEncendido = false;
                    if (simulacionContainer) simulacionContainer.classList.add('hidden');
                    if (simulacionAlturaMostradaSpan) {
                        simulacionAlturaMostradaSpan.textContent = "N/A";
                    }
                }
            }
            if (estadoAspersorCampesinoSpan) estadoAspersorCampesinoSpan.textContent = this.aspersorEncendido ? "ENCENDIDO" : "APAGADO";

            mostrarSeccion("campesinoSection");
            alert(`El campesino ${this.nombre} ha accedido al panel del campesino.`);
        } else {
            alert("Intento de acceder a panel de campesino sin ser campesino.");
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
        alert(`Sección con ID '${idSeccion}' no encontrada.`);
    }
}

function actualizarNavbar() {
    const navbar = document.getElementById("navbar");
    if (Usuario.usuarioActual) {
        navbar.classList.remove("hidden");
    } else {
        navbar.classList.add("hidden");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Crear usuarios iniciales
    Usuario.crearUsuario("campesino", "daniel", "1234");
    Usuario.crearUsuario("administrador", "Juan", "4321");

    // Inicializar manejadores de formularios
    Usuario.iniciarSesionDesdeFormulario();
    Usuario.registrarCampesinoDesdeFormulario();
    Usuario.crearUsuarioDesdeAdminFormulario();
    Usuario.crearTerrenoDesdeAdminFormulario();
    Usuario.asignarTerrenoDesdeAdminFormulario();

    // Actualizar selects para asignación de terrenos
    Usuario.actualizarSelectAsignarTerreno();

    // Manejar navegación principal
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

    // Manejar botones de cerrar sesión
    const logoutAdminBtn = document.getElementById("logoutAdminBtn");
    if (logoutAdminBtn) {
        logoutAdminBtn.addEventListener("click", () => Usuario.cerrarSesion());
    }

    const logoutCampesinoBtn = document.getElementById("logoutCampesinoBtn");
    if (logoutCampesinoBtn) {
        logoutCampesinoBtn.addEventListener("click", () => Usuario.cerrarSesion());
    }

    const logoutNavBtn = document.getElementById("logoutNavBtn");
    if (logoutNavBtn) {
        logoutNavBtn.addEventListener("click", () => Usuario.cerrarSesion());
    }

    // Manejar botones de encender/apagar aspersor para campesinos
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

    // Manejar navegación en el navbar
    const navLinks = document.querySelectorAll('#navbar a[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            mostrarSeccion(sectionId);
        });
    });

    // Definir sección de inicio para el navbar
    document.getElementById('navInicio').addEventListener('click', (e) => {
        e.preventDefault();
        if (Usuario.usuarioActual) {
            if (Usuario.usuarioActual.rol === "administrador") {
                mostrarSeccion("adminSection");
            } else if (Usuario.usuarioActual.rol === "campesino") {
                Usuario.usuarioActual.accederPanel(); 
            }
        }
    });

    // Lógica para el formulario de simulación en el panel del campesino
    const formSimuladorCampesino = document.getElementById("formSimuladorCampesino");
    if (formSimuladorCampesino) {
        formSimuladorCampesino.addEventListener("submit", function (e) {
            e.preventDefault();

            const tiempo = parseFloat(document.getElementById("simulacionTiempo").value);
            const resultadosSimulacionDiv = document.getElementById("resultadosSimulacion");

            if (isNaN(tiempo) || tiempo <= 0) {
                alert("Por favor, introduce un valor válido y mayor que cero para el Tiempo de aspersión.");
                return;
            }

            if (Usuario.usuarioActual instanceof Campesino && Usuario.usuarioActual.terrenoAsignado) {
                const sistema = new MicroAspersion(Usuario.usuarioActual.terrenoAsignado, tiempo);
                if (resultadosSimulacionDiv) {
                    resultadosSimulacionDiv.innerHTML = sistema.mostrarResultados();
                }
            } else {
                alert("No tienes un terreno asignado o no eres un Campesino para realizar la simulación.");
            }
        });
    }

    // Mostrar la sección de bienvenida al cargar la página
    mostrarSeccion("welcomeSection");
});
