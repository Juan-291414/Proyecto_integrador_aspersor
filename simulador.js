// Clase que encapsula los cálculos del sistema de microaspersión
class MicroAspersion {
  constructor(area, altura, orificios, radio, tiempo) {
    this.area = area;
    this.altura = altura;
    this.orificios = 12;
    this.radio = 0,8; // milimetros 
    this.tiempo = tiempo;
    this.g = 9.81;       // Aceleración gravitatoria (m/s²)
    this.rho = 1000;     // Densidad del agua (kg/m³)
  }

  // Cálculo de presión hidrostática
  calcularPresion() {
    return this.rho * this.g * this.altura;
  }

  // Velocidad de salida según Torricelli
  calcularVelocidadSalida() {
    return Math.sqrt(2 * this.g * this.altura);
  }

  // Área de un orificio circular
  calcularAreaOrificio() {
    return Math.PI * Math.pow(this.radio, 2);
  }

  // Caudal por orificio (m³/s)
  calcularCaudalPorOrificio() {
    return this.calcularAreaOrificio() * this.calcularVelocidadSalida();
  }

  // Caudal total del sistema (m³/s)
  calcularCaudalTotal() {
    return this.calcularCaudalPorOrificio() * this.orificios;
  }

  // Volumen total de agua liberada (litros)
  calcularAguaTotal() {
    return this.calcularCaudalTotal() * this.tiempo * 1000; // litros
  }

  // Distribución de agua por metro cuadrado (L/m²)
  calcularDistribucionPorM2() {
    return this.calcularAguaTotal() / this.area;
  }

  // Genera una cadena HTML con todos los resultados
  mostrarResultados() {
    const P = this.calcularPresion();
    const P_bar = P / 100000;
    const v = this.calcularVelocidadSalida();
    const A = this.calcularAreaOrificio();
    const Q = this.calcularCaudalPorOrificio();
    const Q_total = this.calcularCaudalTotal();
    const agua_total_L = this.calcularAguaTotal();
    const agua_por_m2 = this.calcularDistribucionPorM2();

    return `
      <strong>Presión hidrostática:</strong> ${P.toFixed(2)} Pa ≈ ${P_bar.toFixed(3)} bar<br>
      <strong>Velocidad de salida:</strong> ${v.toFixed(2)} m/s<br>
      <strong>Área por orificio:</strong> ${A.toExponential(2)} m²<br>
      <strong>Caudal por orificio:</strong> ${(Q * 1000).toFixed(4)} L/s<br>
      <strong>Caudal total (${this.orificios} orificios):</strong> ${(Q_total * 1000).toFixed(4)} L/s<br>
      <strong>Agua acumulada en ${this.tiempo} s:</strong> ${agua_total_L.toFixed(3)} L<br>
      <strong>Distribución por m²:</strong> ${agua_por_m2.toFixed(5)} L/m²`;
  }
}



// Evento que maneja el envío del formulario
document.getElementById("formSimulador").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevenir recarga

  // Obtener datos del formulario
  const area = parseFloat(document.getElementById("area").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const orificios = parseInt(document.getElementById("orificios").value);
  const radio = parseFloat(document.getElementById("radio").value);
  const tiempo = parseFloat(document.getElementById("tiempo").value);

  // Validación básica
  if (isNaN(area) || isNaN(altura) || isNaN(orificios) || isNaN(radio) || isNaN(tiempo) ||
      area <= 0 || altura <= 0 || orificios <= 0 || radio <= 0 || tiempo <= 0) {
    document.getElementById("resultados").innerHTML = "Por favor, introduce valores válidos y mayores que cero.";
    return;
  }

  // Crear instancia del sistema con los valores
  const sistema = new MicroAspersion(area, altura, orificios, radio, tiempo);

  // Mostrar resultados en HTML
  document.getElementById("resultados").innerHTML = sistema.mostrarResultados();

  // Generar la gráfica
  generarGraficaTornillo(sistema);

  // Guardar los datos en localStorage
  localStorage.setItem("simuladorData", JSON.stringify({
    area,
    altura,
    orificios,
    radio,
    tiempo
  }));
});

// Al cargar la página, restaurar valores desde localStorage
window.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("simuladorData"));
  if (data) {
    document.getElementById("area").value = data.area;
    document.getElementById("altura").value = data.altura;
    document.getElementById("orificios").value = data.orificios;
    document.getElementById("radio").value = data.radio;
    document.getElementById("tiempo").value = data.tiempo;
  }
});
