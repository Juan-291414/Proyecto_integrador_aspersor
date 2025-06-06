        // Clase que encapsula los cálculos del sistema de microaspersión
        class MicroAspersion {
            constructor(area, altura, tiempo, radioCobertura) { // Añadimos radioCobertura
                this.area = area;
                this.altura = altura;
                this.tiempo = tiempo;
                this.radioCobertura = radioCobertura; // Nuevo parámetro: radio de cobertura del aspersor

                // Valores fijos del orificio del microaspersor (parte interna)
                this.orificios = 26; // Número fijo de orificios por UN microaspersor
                this.radioOrificio = 0.8 / 1000; // Radio del orificio en metros (0.8 mm)

                // Constantes físicas
                this.g = 9.81;       // Aceleración gravitatoria (m/s²)
                this.rho = 1000;     // Densidad del agua (kg/m³)
            }

            // Cálculo de presión hidrostática
            calcularPresion() {
                return this.rho * this.g * this.altura;
            }

            // Velocidad de salida según Torricelli (basada en el orificio interno)
            calcularVelocidadSalida() {
                return Math.sqrt(2 * this.g * this.altura);
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

            // Área de cobertura de UN microaspersor (m²)
            calcularAreaCoberturaAspersor() {
                return Math.PI * Math.pow(this.radioCobertura, 2);
            }

            // Número de microaspersores necesarios para cubrir el terreno (aproximado, sin solapamiento)
            calcularNumeroDeAspersores() {
                const areaCoberturaUnitario = this.calcularAreaCoberturaAspersor();
                if (areaCoberturaUnitario === 0) return Infinity; // Evitar división por cero
                return Math.ceil(this.area / areaCoberturaUnitario); // Redondea hacia arriba para asegurar cobertura
            }

            // Caudal total para el terreno (L/s)
            calcularCaudalTotalTerreno() {
                return this.calcularCaudalDeUnAspersor() * this.calcularNumeroDeAspersores() * 1000;
            }

            // Volumen total de agua para todo el terreno (litros)
            calcularAguaTotalTerreno() {
                return this.calcularCaudalTotalTerreno() * this.tiempo / 1000; // Convertir L/s a L, ya que calcularCaudalTotalTerreno ya está en L/s
            }

            // Distribución de agua por metro cuadrado para todo el terreno (L/m²)
            calcularDistribucionPorM2Terreno() {
                 return this.calcularAguaTotalTerreno() / this.area;
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
                const area_cobertura_aspersor = this.calcularAreaCoberturaAspersor();
                const num_aspersores = this.calcularNumeroDeAspersores();
                const Q_total_terreno = this.calcularCaudalTotalTerreno();
                const agua_total_terreno_L = this.calcularAguaTotalTerreno();
                const distribucion_m2_terreno = this.calcularDistribucionPorM2Terreno();

                return `
                    <h2>Resultados para el Terreno</h2>
                    <strong>Presión hidrostática:</strong> ${P.toFixed(2)} Pa ≈ ${P_bar.toFixed(3)} bar<br>
                    <strong>Velocidad de salida (orificio):</strong> ${v.toFixed(2)} m/s<br>
                    <strong>Área por orificio (radio ${this.radioOrificio * 1000} mm):</strong> ${A_orificio.toExponential(2)} m²<br>
                    <strong>Caudal por orificio:</strong> ${(Q_orificio * 1000).toFixed(4)} L/s<br>
                    <hr>
                    <h3>Resultados por Microaspersor Individual (con ${this.orificios} orificios)</h3>
                    <strong>Caudal de UN microaspersor:</strong> ${(Q_un_aspersor * 1000).toFixed(4)} L/s<br>
                    <strong>Volumen de agua por UN microaspersor en ${this.tiempo} s:</strong> ${agua_un_aspersor_L.toFixed(3)} L<br>
                    <strong>Área de cobertura de UN microaspersor (radio ${this.radioCobertura} m):</strong> ${area_cobertura_aspersor.toFixed(2)} m²<br>
                    <hr>
                    <h3>Resultados para el Terreno Completo (${this.area} m²)</h3>
                    <strong>Microaspersores Necesarios (aprox.):</strong> ${num_aspersores}<br>
                    <strong>Caudal total para el terreno:</strong> ${Q_total_terreno.toFixed(4)} L/s<br>
                    <strong>Volumen total de agua para el terreno en ${this.tiempo} s:</strong> ${agua_total_terreno_L.toFixed(3)} L<br>
                    <strong>Distribución de agua por m² en el terreno:</strong> ${distribucion_m2_terreno.toFixed(5)} L/m²
                `;
            }
        }

        // Evento que maneja el envío del formulario
        document.getElementById("formSimulador").addEventListener("submit", function (e) {
            e.preventDefault(); // Prevenir recarga

            // Obtener datos del formulario
            const area = parseFloat(document.getElementById("area").value);
            const altura = parseFloat(document.getElementById("altura").value);
            const tiempo = parseFloat(document.getElementById("tiempo").value);
            const radioCobertura = parseFloat(document.getElementById("radioCobertura").value); // Nuevo input

            // Validación básica
            if (isNaN(area) || isNaN(altura) || isNaN(tiempo) || isNaN(radioCobertura) ||
                area <= 0 || altura <= 0 || tiempo <= 0 || radioCobertura <= 0) {
                document.getElementById("resultados").innerHTML = "Por favor, introduce valores válidos y mayores que cero para todos los campos.";
                return;
            }

            // Crear instancia del sistema con los valores del formulario
            const sistema = new MicroAspersion(area, altura, tiempo, radioCobertura);

            // Mostrar resultados en HTML
            document.getElementById("resultados").innerHTML = sistema.mostrarResultados();

            // Guardar los datos en localStorage
            localStorage.setItem("simuladorData", JSON.stringify({
                area,
                altura,
                tiempo,
                radioCobertura // Guardar el nuevo campo
            }));
        });

        // Al cargar la página, restaurar valores desde localStorage
        window.addEventListener("DOMContentLoaded", () => {
            const data = JSON.parse(localStorage.getItem("simuladorData"));
            if (data) {
                document.getElementById("area").value = data.area;
                document.getElementById("altura").value = data.altura;
                document.getElementById("tiempo").value = data.tiempo;
                document.getElementById("radioCobertura").value = data.radioCobertura; // Restaurar el nuevo campo
            }
        });
