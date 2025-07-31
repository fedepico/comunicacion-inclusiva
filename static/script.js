let textoCompleto = "";
let seguirDictando = true;

// Activar cámara
const video = document.getElementById("video");
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(stream => { video.srcObject = stream; })
  .catch(err => console.error("Error cámara:", err));

// Iniciar la app
window.onload = () => {
  hablar("Bienvenido. Puedes hablar durante un minuto. Luego te preguntaré si deseas continuar.");
  setTimeout(() => grabarCiclo(), 4000);
};

// Hablar por voz
function hablar(texto) {
  const synth = window.speechSynthesis;
  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang = "es-ES";
  synth.speak(msg);
}

function grabarCiclo() {
  if (!seguirDictando) return;

  fetch("/voz-a-texto", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      let texto = data.texto || "[No se entendió el mensaje]";
      texto = texto.trim();

      // Detener si la persona dice "parar" o "detener"
      if (/\\b(parar|detener)\\b/.test(texto.toLowerCase())) {
        hablar("Has indicado que deseas terminar.");
        seguirDictando = false;
        document.getElementById("formulario").style.display = "block";
        return;
      }

      // Capitalizar la primera letra y después de cada punto
      texto = texto.charAt(0).toUpperCase() + texto.slice(1);
      texto = texto.replace(/\\.\\s*(\\w)/g, (m, p1) => ". " + p1.toUpperCase());

      textoCompleto += texto + ". ";
      document.getElementById("mensajeEditable").value = textoCompleto;

      setTimeout(() => {
        hablar("¿Deseas continuar dictando? Responde: sí o no.");
        esperarRespuestaSiONo();
      }, 1500);
    })
    .catch(err => {
      console.error("Error transcripción:", err);
      hablar("Ocurrió un error. ¿Deseas intentar de nuevo?");
      esperarRespuestaSiONo();
    });
}

// Capturar la respuesta sí o no
function esperarRespuestaSiONo() {
  fetch("/voz-a-texto", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      const respuesta = (data.texto || "").toLowerCase().trim();

      if (respuesta.includes("si") || respuesta.includes("sí") || respuesta.includes("sii") || respuesta.includes("sí, claro")) {
        hablar("Muy bien, continúa hablando.");
        setTimeout(() => grabarCiclo(), 2500);
      } else if (respuesta.includes("no") || respuesta.includes("no gracias")) {
        hablar("Has finalizado. Revisa el mensaje y presiona enviar.");
        seguirDictando = false;
        document.getElementById("formulario").style.display = "block";
      } else {
        hablar("No entendí. Por favor responde con sí o no.");
        setTimeout(() => esperarRespuestaSiONo(), 2000);
      }
    });
  }

// Mostrar formulario manualmente (si hiciera falta)
function mostrarFormulario() {
  document.getElementById("formulario").style.display = "block";
}

// Enviar los datos
function enviarFormulario() {
  const mensaje = document.getElementById("mensajeEditable").value;
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;

  const datos = { mensaje, nombre, telefono, email };

  fetch("/enviar-correo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
    .then(res => res.json())
    .then(data => {
      hablar("Mensaje enviado correctamente.");
      alert(data.mensaje || "Mensaje enviado.");
    })
    .catch(err => {
      hablar("Error al enviar el mensaje.");
      alert("Error al enviar.");
    });
}
