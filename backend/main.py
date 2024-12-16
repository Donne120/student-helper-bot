import os
import sys
import shutil
import subprocess
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import speech_recognition as sr
import tempfile

# ... keep existing code (logging setup and Ollama executable finder)

# Add new imports for audio handling
import wave
import contextlib

# Pydantic models
class ChatRequest(BaseModel):
    message: str

# ... keep existing code (query_ollama function)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file and process with Llama2
    """
    try:
        # Create a temporary file to store the uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            # Write uploaded file content to temporary file
            content = await file.read()
            temp_audio.write(content)
            temp_audio_path = temp_audio.name

        # Initialize speech recognizer
        recognizer = sr.Recognizer()
        
        # Read the audio file
        with sr.AudioFile(temp_audio_path) as source:
            # Record audio from file
            audio = recognizer.record(source)
            
            # Perform speech recognition
            try:
                text = recognizer.recognize_google(audio)
                
                # Process transcribed text with Llama2
                model = "llama2"
                response = query_ollama(model, f"Process this transcribed text: {text}")
                
                return {
                    "response": response,
                    "transcription": text
                }
            except sr.UnknownValueError:
                raise HTTPException(
                    status_code=400,
                    detail="Could not understand audio"
                )
            except sr.RequestError as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Speech recognition error: {str(e)}"
                )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing audio: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if 'temp_audio_path' in locals():
            os.unlink(temp_audio_path)

# ... keep existing code (chat endpoint, health check, and startup event)