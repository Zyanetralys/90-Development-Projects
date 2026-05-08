#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
COCINANDO CON PAPI - Versión 2.0 Profesional
Marca: Jose Antonio Martinez Rubio
Punto de entrada principal - 100% offline, sin dependencias externas
"""

import sys
import os
import tkinter as tk
from tkinter import ttk, messagebox
from pathlib import Path
import sqlite3
import json
import datetime
import shutil
import base64
import zlib
import math

# Importar módulos locales
from database import Database
from ui_main import MainWindow

def setup_app_dirs():
    """Crea estructura completa de carpetas necesarias"""
    dirs = [
        'media/photos',
        'media/thumbnails',
        'media/temp',
        'exports',
        'backups'
    ]
    
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
    
    # Crear archivo de configuración si no existe
    config_file = Path('config.json')
    if not config_file.exists():
        default_config = {
            "app_name": "Cocinando con Papi",
            "author": "Jose Antonio Martinez Rubio",
            "version": "2.0",
            "theme": "elegant",
            "last_backup": None,
            "auto_backup": True,
            "max_backups": 7,
            "default_servings": 4,
            "enable_nutrition": True,
            "enable_allergens": True
        }
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, indent=2)

def check_python_version():
    """Verifica versión mínima de Python"""
    if sys.version_info < (3, 8):
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror(
            "Versión de Python no compatible",
            "Esta aplicación requiere Python 3.8 o superior.\n"
            f"Versión actual: {sys.version}"
        )
        sys.exit(1)

def setup_dpi_awareness():
    """Configura DPI awareness para mejor renderizado en Windows"""
    if sys.platform == 'win32':
        try:
            from ctypes import windll
            windll.shcore.SetProcessDpiAwareness(1)
        except:
            pass

def handle_exception(exc_type, exc_value, exc_traceback):
    """Manejador global de excepciones"""
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    
    error_msg = f"""
    Error inesperado en la aplicación:

    Tipo: {exc_type.__name__}
    Mensaje: {exc_value}

    Por favor, reinicie la aplicación.
    Si el error persiste, contacte con soporte.
    """
    
    try:
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror("Error", error_msg)
        root.destroy()
    except:
        print(error_msg)

def main():
    """Función principal de la aplicación"""
    # Configuración inicial
    check_python_version()
    setup_dpi_awareness()
    setup_app_dirs()
    
    # Configurar manejador de excepciones
    sys.excepthook = handle_exception
    
    # Crear ventana principal
    root = tk.Tk()
    
    # Configurar ventana
    root.title("🥘 Cocinando con Papi")
    root.geometry("1200x750")
    root.minsize(900, 600)
    
    # Centrar ventana en pantalla
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f'{width}x{height}+{x}+{y}')
    
    # Configurar cierre de ventana
    def on_closing():
        if messagebox.askokcancel("Salir", 
                                 "¿Seguro que quieres salir de Cocinando con Papi?\n"
                                 "Todos tus datos están guardados automáticamente."):
            root.destroy()
    
    root.protocol("WM_DELETE_WINDOW", on_closing)
    
    # Mostrar splash screen
    show_splash(root)
    
    # Iniciar aplicación principal
    try:
        app = MainWindow(root)
        root.mainloop()
    except Exception as e:
        messagebox.showerror("Error Fatal", f"Error al iniciar la aplicación:\n{str(e)}")
        sys.exit(1)

def show_splash(root):
    """Muestra pantalla de bienvenida"""
    splash = tk.Toplevel(root)
    splash.title("")
    splash.geometry("500x350")
    splash.resizable(False, False)
    
    # Centrar splash
    splash.update_idletasks()
    w = splash.winfo_width()
    h = splash.winfo_height()
    x = (splash.winfo_screenwidth() // 2) - (w // 2)
    y = (splash.winfo_screenheight() // 2) - (h // 2)
    splash.geometry(f'{w}x{h}+{x}+{y}')
    
    # Quitar bordes
    splash.overrideredirect(True)
    
    # Fondo elegante
    bg_color = "#FFFDFB"
    splash.configure(bg=bg_color)
    
    # Logo grande
    logo_label = tk.Label(
        splash,
        text="🥘",
        font=('Helvetica', 80, 'bold'),
        bg=bg_color,
        fg="#8B4513"
    )
    logo_label.pack(pady=40)
    
    # Título
    title_label = tk.Label(
        splash,
        text="COCINANDO CON PAPI",
        font=('Helvetica', 24, 'bold'),
        bg=bg_color,
        fg="#8B4513"
    )
    title_label.pack(pady=10)
    
    # Subtítulo
    subtitle_label = tk.Label(
        splash,
        text="Tu asistente culinario personal",
        font=('Helvetica', 12),
        bg=bg_color,
        fg="#666666"
    )
    subtitle_label.pack(pady=5)
    
    # Versión
    version_label = tk.Label(
        splash,
        text="Versión 2.0 Profesional",
        font=('Helvetica', 10),
        bg=bg_color,
        fg="#999999"
    )
    version_label.pack(pady=20)
    
    # Marca
    brand_label = tk.Label(
        splash,
        text="© Jose Antonio Martinez Rubio",
        font=('Helvetica', 9, 'italic'),
        bg=bg_color,
        fg="#8B4513"
    )
    brand_label.pack(pady=10)
    
    # Cargar base de datos
    status_label = tk.Label(
        splash,
        text="Iniciando base de datos...",
        font=('Helvetica', 10),
        bg=bg_color,
        fg="#666666"
    )
    status_label.pack(pady=20)
    
    # Forzar actualización
    splash.update()
    
    # Simular carga (en realidad inicializa BD)
    try:
        db = Database()
        status_label.config(text="Cargando recetas...")
        splash.update()
        
        # Pequeña pausa para UX
        root.after(800)
    except Exception as e:
        status_label.config(text=f"Error: {str(e)}", fg="#C41E3A")
        splash.update()
        root.after(1500)
    
    # Cerrar splash
    splash.destroy()

if __name__ == "__main__":
    main()