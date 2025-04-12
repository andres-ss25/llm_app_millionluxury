import openai
import os
import time
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests
import re

load_dotenv()
openai.api_key = os.getenv('API_KEY_OPENAI')
ID_ASSISTANT = os.getenv('ID_ASSISTANT')
GOOGLE_CLOUD_API_KEY = os.getenv('GOOGLE_CLOUD_API_KEY')

app = Flask(__name__)

class OpenAIService:
    @staticmethod
    def create_thread():
        try:
            thread = openai.beta.threads.create()
            return thread.id
        except openai.error.OpenAIError as e:
            print(f"Error creating thread: {e}")
            return None

    @staticmethod
    def add_message(message, thread_id):
        try:
            return openai.beta.threads.messages.create(
                thread_id=thread_id,
                role="user",
                content=message
            )
        except openai.error.OpenAIError as e:
            print(f"Error adding message to thread: {e}")
            return None

    @staticmethod
    def run_assistant(thread_id, assistant_id):
        try:
            return openai.beta.threads.runs.create(
                thread_id=thread_id,
                assistant_id=assistant_id
            )
        except openai.error.OpenAIError as e:
            print(f"Error running assistant: {e}")
            return None

    @staticmethod
    def check_run_status(thread_id, run_id):
        try:
            return openai.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_id
            )
        except openai.error.OpenAIError as e:
            print(f"Error checking run status: {e}")
            return None

    @staticmethod
    def generate_response(message, thread_id, assistant_id):
        if thread_id is None:
            return "Error: No se pudo crear el hilo."

        OpenAIService.add_message(message, thread_id)
        run = OpenAIService.run_assistant(thread_id, assistant_id)
        if not run:
            return "Error: Falló la ejecución del asistente."

        while run.status not in ['completed', 'failed', 'cancelled']:
            time.sleep(0.1)
            run = OpenAIService.check_run_status(thread_id, run.id)

        if run and run.status == 'completed':
            messages = openai.beta.threads.messages.list(thread_id)
            if messages.data:
                for msg in reversed(messages.data):
                    if msg.role == "assistant":
                        print(msg.content)

                        return messages.data[0].content[0].text.value
            return "No se recibió respuesta del asistente."
        else:
            return "Lo siento, hubo un error al procesar tu mensaje."

thread_id = OpenAIService.create_thread()

def clean_text_for_tts(markdown_text):
    # Negrita o cursiva
    cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', markdown_text)
    cleaned = re.sub(r'\*(.*?)\*', r'\1', cleaned)
    
    # Encabezados
    cleaned = re.sub(r'^#+\s*', '', cleaned, flags=re.MULTILINE)

    # Listas numeradas
    cleaned = re.sub(r'^\d+\.\s+', '', cleaned, flags=re.MULTILINE)

    # Quitar otros caracteres especiales si lo deseas
    cleaned = re.sub(r'[`~_>]', '', cleaned)

    return cleaned.strip()


@app.route("/")
def index():
    return render_template('chat.html')
@app.route("/tts_proxy", methods=["POST"])
def tts_proxy():
    try:
        msg = request.form["msg"]
        print(f"{msg}", thread_id, ID_ASSISTANT)

        # Genera la respuesta de OpenAI
        response_text = OpenAIService.generate_response(msg, thread_id, ID_ASSISTANT)

        print(f"{response_text}")

        try:

            cleaned_text = clean_text_for_tts(response_text)

            tts_data = {
                "input": {"text": cleaned_text},
                "voice": {"languageCode": "es-US", "name": "es-US-Standard-A"},
                "audioConfig": {"audioEncoding": "MP3"}

            }
            tts_response = requests.post(
                f"https://texttospeech.googleapis.com/v1/text:synthesize?key={GOOGLE_CLOUD_API_KEY}",
                json=tts_data,
                headers={"Content-Type": "application/json"}
            )
            tts_response.raise_for_status()
            audio_content = tts_response.json()["audioContent"]

            return jsonify({"text": response_text, "audio": audio_content})

        except Exception as e:
            print(f"Error processing TTS: {str(e)}")
            return jsonify({"error": "Error al convertir texto a voz", "text": response_text}), 500

    except KeyError:
        return jsonify({"error": "El parámetro 'msg' no fue enviado correctamente"}), 400
    except Exception as e:
        print(f"Error en tts_proxy: {str(e)}")
        return jsonify({"error": "Error al procesar la solicitud"}), 500


@app.route("/transcribe_audio", methods=["POST"])
def transcribe_audio():
    audio_file = request.files["audio"]
    try:
        # Updated transcription code for OpenAI 1.45.1
        #client = openai.OpenAI()  # Create an OpenAI client instance

        # Create a new file object that wraps the uploaded file
        audio_data = audio_file.read()

        # Call the updated transcription endpoint
        response = openai.audio.transcriptions.create(
            model="whisper-1",
            file=("audio.wav", audio_data)  # Pass as a tuple with filename and data
        )

        # The response structure has changed - now it's a direct string
        if response.text:
            return jsonify({"text": response.text})
        else:
            return jsonify({"error": "No se pudo obtener una transcripción"}), 500

    except Exception as e:
        print(f"Error en la transcripción: {str(e)}")
        return jsonify({"error": "Error al transcribir el audio"}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5055)