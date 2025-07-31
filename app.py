from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from voz_a_texto import transcribir_audio
import smtplib
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)

# Configuración temporal para pruebas (esto debe ir en archivo editable luego)
CORREO_ORIGEN = "tucorreo@gmail.com"
CORREO_DESTINO = "tucorreo@gmail.com"
CLAVE_APP = "tu_clave_app"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/voz-a-texto", methods=["POST"])
def voz_a_texto():
    texto = transcribir_audio()
    return jsonify({"texto": texto})

@app.route("/enviar-correo", methods=["POST"])
def enviar_correo():
    data = request.get_json()
    mensaje = data.get("mensaje", "")
    nombre = data.get("nombre", "No especificado")
    telefono = data.get("telefono", "No especificado")
    email = data.get("email", "No especificado")

    cuerpo = f"""
    📢 Nuevo mensaje enviado desde la Estación Inclusiva

    👤 Nombre: {nombre}
    📞 Teléfono: {telefono}
    📧 Correo electrónico: {email}

    📝 Mensaje:
    {mensaje}
    """

    try:
        email_msg = EmailMessage()
        email_msg.set_content(cuerpo)
        email_msg["Subject"] = "Nuevo mensaje desde Estación Inclusiva"
        email_msg["From"] = CORREO_ORIGEN
        email_msg["To"] = CORREO_DESTINO

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(CORREO_ORIGEN, CLAVE_APP)
            smtp.send_message(email_msg)

        return jsonify({"mensaje": "Mensaje enviado correctamente a la Alcaldía."})
    except Exception as e:
        return jsonify({"mensaje": f"Error al enviar correo: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
