let mediaRecorder;
let audioChunks = [];

function hablar(texto) {
  const synth = window.speechSynthesis;
  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = "es-CO";
  synth.speak(mensaje);
}

function iniciarGrabacion() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "grabacion.webm");

        fetch("/voz-a-texto", {
          method: "POST",
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          const texto = data.texto || "[No se entendió el mensaje]";
          const textoFormateado = texto.trim().charAt(0).toUpperCase() + texto.trim().slice(1) + ". ";
          const textarea = document.getElementById("mensajeEditable");
          textarea.value += textoFormateado;
          hablar(textoFormateado);
        })
        .catch(error => {
          console.error("Error:", error);
          alert("Hubo un problema al transcribir el audio.");
        });
      };

      mediaRecorder.start();
      hablar("Comienza a hablar ahora.");
    })
    .catch(err => {
      console.error("No se pudo acceder al micrófono:", err);
      alert("Error al acceder al micrófono.");
    });
}

function detenerGrabacion() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    hablar("Grabación detenida.");
  }
}

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
      hablar("El mensaje ha sido enviado correctamente.");
      alert(data.mensaje || "Mensaje enviado.");
    })
    .catch(err => {
      hablar("Hubo un problema al enviar el mensaje.");
      alert("Error al enviar.");
      console.error(err);
    });
}
