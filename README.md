# Million Luxury AI Assistant
## Descripción del Proyecto
El Million Luxury AI Assistant es una solución avanzada desarrollada para Million Luxury, una empresa líder en bienes raíces con grandes proyectos en Miami. Este asistente virtual con avatar interactivo permite a los asesosre/clientes obtener información detallada sobre proyectos inmobiliarios a través de una interfaz de chat intuitiva y multimodal.

[![Ver en YouTube](https://img.youtube.com/vi/3lRa95pbT-0/0.jpg)](https://www.youtube.com/watch?v=3lRa95pbT-0)

## Características Principales

- **Avatar 3D Interactivo:** Representación visual del asistente con capacidad de habla sincronizada.
- **Interfaz de Chat:** Sistema de mensajería en tiempo real con formato markdown mejorado.
- **Procesamiento de Voz:** Capacidad para recibir consultas por audio y responder verbalmente.
- **Extracción de Datos de PDFs:** Procesamiento automático de documentos PDF para extraer información relevante.
- **Almacenamiento Vectorial:** Indexación eficiente para búsquedas semánticas y recuperación rápida de información.
- **Respuestas Contextuales:** Generación de respuestas precisas basadas en la documentación disponible.

## Stack Tecnológico

**Backend:**

Python (Flask framework principal)

**IA y Procesamiento del Lenguaje:**

OpenAI (procesamiento de lenguaje natural y LLM principal)
Google Cloud TTS (Text-to-Speech)
Google Cloud STT (Speech-to-Text)


**Frontend:**

HTML/CSS/JavaScript
Bootstrap (diseño responsive)
TalkingHead.js (renderizado y animación del avatar 3D)
JQuery (manipulación del DOM)


## Problema Resuelto
Million Luxury enfrentaba un desafío: la alta demanda de clientes saturaba a los equipos de asistencia, desviando su atención de tareas esenciales como la gestión de contratos y comunicaciones por correo electrónico. Este asistente virtual libera recursos humanos al:

- Responder automáticamente a consultas frecuentes sobre proyectos inmobiliarios
- Proporcionar información detallada sobre especificaciones, precios y disponibilidad
- Estar disponible 24/7 para atender consultas
- Procesar y extraer información de documentación PDF

## Instalación

**Prerrequisitos**

Python 3.10
Cuenta en Google Cloud Platform (para TTS y STT)
Clave API de OpenAI

**Pasos de Instalación**

Clonar el repositorio:

1. Clonar el repositorio:
   ```
   git clone https://github.com/andres-ss25/llm_app_millionluxury.git
   cd llm_app_millionluxury
   ```

2. Crear entorno virtual e instalar dependencias:
   ```
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configurar variables de entorno:
   ```
   cp .env_ .env
   ```
   Editar el archivo `.env` con tus claves API y configuraciones.


4. Iniciar la aplicación:
   ```
   python app.py
   ```

## Uso

1. Acceder a la aplicación web en `http://localhost:5055`
2. Interactuar con el asistente a través del chat de texto
3. Utilizar el botón de micrófono para consultas por voz
4. Las respuestas incluirán información estructurada extraída de los documentos PDF

## Arquitectura

```
                                ┌───────────────┐
                                │    Cliente    │
                                │    Browser    │
                                └───────┬───────┘
                                        │
                                        ▼
┌───────────────┐              ┌───────────────┐                ┌───────────────────┐
│  Google TTS   │◄────────────►│  API Backend  │◄──────────────►│    API-OpenAI     |
|               |              |               |                | - Assistant       |
|               |              |               |                | - VectorStorage   │
└───────────────┘              └───────────────┘                └───────────────────┘
                                      
```

## Características Adicionales

- **Formateo Markdown**: El asistente puede representar listas, encabezados y texto en negrita en sus respuestas.
- **Respuestas Multimodales**: Combinación de texto y voz para una experiencia más natural.
- **Memoria de Conversación**: El asistente mantiene el contexto de la conversación para proporcionar respuestas coherentes y cada conversación se mantiene en un hilo.

## Próximas Mejoras

- Integración con sistema CRM para gestión de leads
- Función de programación de visitas a propiedades
- Soporte para múltiples idiomas
- Dashboard para analíticas de interacciones