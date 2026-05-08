#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Utilidades y Helpers Universales
Funciones comunes usadas en toda la aplicación
"""

import os
import re
from pathlib import Path
from datetime import datetime, timedelta
import json
import base64
import hashlib

class TimeFormatter:
    """Formateador de tiempos"""
    
    @staticmethod
    def format_minutes(minutes):
        """Formatea minutos a string legible"""
        if minutes is None or minutes == 0:
            return "—"
        elif minutes < 60:
            return f"{minutes} min"
        else:
            h = minutes // 60
            m = minutes % 60
            if m == 0:
                return f"{h}h"
            return f"{h}h {m}min"
    
    @staticmethod
    def parse_time_input(text):
        """Convierte '1h 30min' o '90' a minutos"""
        if not text:
            return 0
        
        text = str(text).strip().lower()
        
        # Si es solo número
        if text.isdigit():
            return int(text)
        
        # Parsear formato "1h 30min"
        total = 0
        
        # Buscar horas
        h_match = re.search(r'(\d+)\s*h', text)
        if h_match:
            total += int(h_match.group(1)) * 60
        
        # Buscar minutos
        min_match = re.search(r'(\d+)\s*min', text)
        if min_match:
            total += int(min_match.group(1))
        
        # Si no encontró nada, intentar parsear como número simple
        if total == 0 and text.replace(' ', '').isdigit():
            return int(text.replace(' ', ''))
        
        return total
    
    @staticmethod
    def get_time_emoji(minutes):
        """Devuelve emoji según tiempo"""
        if minutes <= 15:
            return "⚡"
        elif minutes <= 30:
            return "⏱️"
        elif minutes <= 60:
            return "🕐"
        else:
            return "🕜"

class ExportHelper:
    """Helpers para exportación"""
    
    @staticmethod
    def sanitize_filename(title):
        """Crea nombre de archivo seguro desde título"""
        # Reemplazar caracteres inválidos
        invalid = '<>:"/\\|?*'
        for char in invalid:
            title = title.replace(char, '_')
        
        # Eliminar espacios al inicio y final
        title = title.strip()
        
        # Limitar longitud
        return title[:50] or "receta_sin_titulo"
    
    @staticmethod
    def format_date(date_str, format_type="short"):
        """Formatea fecha a string legible"""
        if not date_str:
            return "—"
        
        try:
            if isinstance(date_str, str):
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            else:
                dt = date_str
            
            if format_type == "short":
                return dt.strftime("%d/%m/%Y")
            elif format_type == "long":
                return dt.strftime("%d de %B de %Y")
            elif format_type == "datetime":
                return dt.strftime("%d/%m/%Y %H:%M")
            else:
                return dt.strftime("%Y-%m-%d")
        except:
            return str(date_str)
    
    @staticmethod
    def generate_recipe_id(title, created_at=None):
        """Genera ID único para receta"""
        if not created_at:
            created_at = datetime.now().isoformat()
        
        seed = f"{title}_{created_at}"
        hash_obj = hashlib.md5(seed.encode())
        return hash_obj.hexdigest()[:8]

class NutritionCalculator:
    """Calculador de valores nutricionales estimados"""
    
    # Base de datos aproximada de valores nutricionales por 100g
    NUTRITION_DB = {
        # Vegetales
        "tomate": {"kcal": 18, "protein": 0.9, "carbs": 3.9, "fat": 0.2},
        "cebolla": {"kcal": 40, "protein": 1.1, "carbs": 9.3, "fat": 0.1},
        "ajo": {"kcal": 149, "protein": 6.4, "carbs": 33.1, "fat": 0.5},
        "pimiento": {"kcal": 31, "protein": 1.0, "carbs": 6.0, "fat": 0.3},
        "zanahoria": {"kcal": 41, "protein": 0.9, "carbs": 9.6, "fat": 0.2},
        "patata": {"kcal": 77, "protein": 2.0, "carbs": 17.5, "fat": 0.1},
        "cilantro": {"kcal": 23, "protein": 2.1, "carbs": 3.7, "fat": 0.5},
        
        # Carnes
        "pollo": {"kcal": 165, "protein": 31.0, "carbs": 0.0, "fat": 3.6},
        "ternera": {"kcal": 250, "protein": 26.0, "carbs": 0.0, "fat": 15.0},
        "cerdo": {"kcal": 242, "protein": 27.0, "carbs": 0.0, "fat": 14.0},
        "pavo": {"kcal": 189, "protein": 29.0, "carbs": 0.0, "fat": 7.0},
        
        # Lácteos
        "leche": {"kcal": 42, "protein": 3.4, "carbs": 5.0, "fat": 1.0},
        "queso": {"kcal": 402, "protein": 25.0, "carbs": 1.3, "fat": 32.0},
        "mantequilla": {"kcal": 717, "protein": 0.9, "carbs": 0.1, "fat": 81.0},
        "yogur": {"kcal": 59, "protein": 3.5, "carbs": 5.0, "fat": 3.3},
        
        # Cereales
        "arroz": {"kcal": 130, "protein": 2.7, "carbs": 28.0, "fat": 0.3},
        "harina": {"kcal": 364, "protein": 10.0, "carbs": 76.0, "fat": 1.0},
        "pan": {"kcal": 265, "protein": 9.0, "carbs": 49.0, "fat": 3.5},
        "pasta": {"kcal": 131, "protein": 5.0, "carbs": 25.0, "fat": 1.0},
        
        # Condimentos y grasas
        "aceite de oliva": {"kcal": 884, "protein": 0.0, "carbs": 0.0, "fat": 100.0},
        "azúcar": {"kcal": 387, "protein": 0.0, "carbs": 100.0, "fat": 0.0},
        "sal": {"kcal": 0, "protein": 0.0, "carbs": 0.0, "fat": 0.0},
        "miel": {"kcal": 304, "protein": 0.3, "carbs": 82.0, "fat": 0.0},
        
        # Frutos secos
        "almendra": {"kcal": 579, "protein": 21.0, "carbs": 21.7, "fat": 49.9},
        "nuez": {"kcal": 654, "protein": 15.0, "carbs": 13.7, "fat": 65.0},
        
        # Especias
        "comino": {"kcal": 375, "protein": 17.8, "carbs": 44.2, "fat": 22.3},
        "canela": {"kcal": 247, "protein": 4.0, "carbs": 80.0, "fat": 1.2},
        "pimienta": {"kcal": 251, "protein": 10.4, "carbs": 64.0, "fat": 3.3},
    }
    
    @classmethod
    def estimate_nutrition(cls, ingredients):
        """
        Estima valores nutricionales basados en ingredientes
        ingredients: lista de diccionarios con 'name', 'quantity', 'unit'
        """
        total_kcal = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0
        
        for ing in ingredients:
            name = ing['name'].lower()
            quantity = float(ing['quantity']) if ing['quantity'] else 0
            unit = ing['unit'].lower()
            
            # Normalizar cantidad a gramos
            qty_grams = cls._convert_to_grams(quantity, unit, name)
            
            # Buscar en base de datos
            for db_name, values in cls.NUTRITION_DB.items():
                if db_name in name:
                    # Calcular proporcionalmente
                    factor = qty_grams / 100.0
                    total_kcal += values['kcal'] * factor
                    total_protein += values['protein'] * factor
                    total_carbs += values['carbs'] * factor
                    total_fat += values['fat'] * factor
                    break
        
        return {
            'kcal': round(total_kcal, 1),
            'protein': round(total_protein, 1),
            'carbs': round(total_carbs, 1),
            'fat': round(total_fat, 1)
        }
    
    @staticmethod
    def _convert_to_grams(quantity, unit, ingredient_name=""):
        """Convierte cantidad a gramos según unidad"""
        # Factores de conversión aproximados
        conversion_factors = {
            'g': 1.0,
            'gramo': 1.0,
            'gramos': 1.0,
            'kg': 1000.0,
            'kilogramo': 1000.0,
            'mg': 0.001,
            
            'ml': 1.0,  # Asumir densidad similar al agua para líquidos
            'mililitro': 1.0,
            'litro': 1000.0,
            'l': 1000.0,
            
            'unidad': 100.0,  # Promedio aproximado
            'u': 100.0,
            'pieza': 100.0,
            
            'taza': 240.0,
            'cucharada': 15.0,
            'cda': 15.0,
            'cucharadita': 5.0,
            'cdita': 5.0,
            
            'chorreon': 5.0,
            'pizca': 0.5,
            'vaso': 200.0,
        }
        
        unit_lower = unit.lower()
        factor = conversion_factors.get(unit_lower, 100.0)  # Default 100g por unidad
        
        return quantity * factor
    
    @staticmethod
    def get_nutrition_label(nutrition_data, servings=1):
        """Genera etiqueta nutricional formateada"""
        if not nutrition_data:
            return "Sin información nutricional"
        
        per_serving = {}
        for key, value in nutrition_data.items():
            if value is not None:
                per_serving[key] = round(value / servings, 1) if servings > 0 else value
        
        lines = ["📊 VALOR NUTRICIONAL POR RACIÓN:"]
        if 'kcal' in per_serving:
            lines.append(f"  • Energía: {per_serving['kcal']} kcal")
        if 'protein' in per_serving:
            lines.append(f"  • Proteínas: {per_serving['protein']}g")
        if 'carbs' in per_serving:
            lines.append(f"  • Carbohidratos: {per_serving['carbs']}g")
        if 'fat' in per_serving:
            lines.append(f"  • Grasas: {per_serving['fat']}g")
        
        return "\n".join(lines)

class ConfigManager:
    """Gestor de configuración de la aplicación"""
    
    CONFIG_FILE = "config.json"
    
    @classmethod
    def load_config(cls):
        """Carga configuración desde archivo"""
        if not Path(cls.CONFIG_FILE).exists():
            return cls.get_default_config()
        
        try:
            with open(cls.CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return cls.get_default_config()
    
    @classmethod
    def save_config(cls, config):
        """Guarda configuración en archivo"""
        try:
            with open(cls.CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            return True
        except:
            return False
    
    @staticmethod
    def get_default_config():
        """Devuelve configuración por defecto"""
        return {
            "app_name": "Cocinando con Papi",
            "author": "Jose Antonio Martinez Rubio",
            "version": "2.0",
            "theme": "elegant",
            "last_backup": None,
            "auto_backup": True,
            "max_backups": 7,
            "default_servings": 4,
            "enable_nutrition": True,
            "enable_allergens": True,
            "language": "es",
            "first_run": True,
            "window_width": 1200,
            "window_height": 750,
        }

class StringUtils:
    """Utilidades para manipulación de strings"""
    
    @staticmethod
    def truncate(text, max_length=50, suffix="..."):
        """Trunca texto si excede longitud máxima"""
        if not text:
            return ""
        if len(text) <= max_length:
            return text
        return text[:max_length - len(suffix)] + suffix
    
    @staticmethod
    def capitalize_words(text):
        """Capitaliza palabras importantes"""
        if not text:
            return text
        
        # Palabras que NO se capitalizan (artículos, preposiciones cortas)
        no_capitalize = {'de', 'del', 'la', 'el', 'las', 'los', 'y', 'e', 'o', 'u', 'a', 'en', 'con', 'sin'}
        
        words = text.split()
        result = []
        
        for i, word in enumerate(words):
            if i == 0 or word.lower() not in no_capitalize:
                result.append(word.capitalize())
            else:
                result.append(word.lower())
        
        return ' '.join(result)
    
    @staticmethod
    def slugify(text):
        """Convierte texto a slug URL-friendly"""
        text = text.lower()
        text = re.sub(r'[áàäâ]', 'a', text)
        text = re.sub(r'[éèëê]', 'e', text)
        text = re.sub(r'[íìïî]', 'i', text)
        text = re.sub(r'[óòöô]', 'o', text)
        text = re.sub(r'[úùüû]', 'u', text)
        text = re.sub(r'ñ', 'n', text)
        text = re.sub(r'[^a-z0-9\s-]', '', text)
        text = re.sub(r'[\s-]+', '-', text)
        return text.strip('-')

class FileHelper:
    """Helpers para gestión de archivos"""
    
    @staticmethod
    def get_file_size(filepath):
        """Devuelve tamaño de archivo en formato legible"""
        try:
            size = Path(filepath).stat().st_size
            
            for unit in ['B', 'KB', 'MB', 'GB']:
                if size < 1024.0:
                    return f"{size:.1f} {unit}"
                size /= 1024.0
            return f"{size:.1f} TB"
        except:
            return "—"
    
    @staticmethod
    def ensure_dir(directory):
        """Asegura que un directorio exista"""
        Path(directory).mkdir(parents=True, exist_ok=True)
    
    @staticmethod
    def get_file_extension(filename):
        """Devuelve extensión de archivo"""
        return Path(filename).suffix.lower()
    
    @staticmethod
    def is_image_file(filepath):
        """Verifica si es archivo de imagen"""
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}
        return Path(filepath).suffix.lower() in image_extensions

class ColorUtils:
    """Utilidades para manejo de colores"""
    
    @staticmethod
    def hex_to_rgb(hex_color):
        """Convierte color HEX a RGB"""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    @staticmethod
    def rgb_to_hex(rgb):
        """Convierte RGB a HEX"""
        return '#{:02x}{:02x}{:02x}'.format(*rgb)
    
    @staticmethod
    def get_contrast_color(hex_color):
        """Devuelve color de contraste (blanco o negro) para texto"""
        r, g, b = ColorUtils.hex_to_rgb(hex_color)
        luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        
        return "#FFFFFF" if luminance < 0.5 else "#000000"
    
    @staticmethod
    def lighten_color(hex_color, factor=0.2):
        """Aclara un color"""
        r, g, b = ColorUtils.hex_to_rgb(hex_color)
        
        r = min(255, int(r + (255 - r) * factor))
        g = min(255, int(g + (255 - g) * factor))
        b = min(255, int(b + (255 - b) * factor))
        
        return ColorUtils.rgb_to_hex((r, g, b))
    
    @staticmethod
    def darken_color(hex_color, factor=0.2):
        """Oscurece un color"""
        r, g, b = ColorUtils.hex_to_rgb(hex_color)
        
        r = int(r * (1 - factor))
        g = int(g * (1 - factor))
        b = int(b * (1 - factor))
        
        return ColorUtils.rgb_to_hex((r, g, b))

class DateUtils:
    """Utilidades para fechas"""
    
    @staticmethod
    def get_week_dates(start_date=None):
        """Devuelve fechas de la semana actual o desde start_date"""
        if start_date is None:
            start_date = datetime.now()
        elif isinstance(start_date, str):
            start_date = datetime.fromisoformat(start_date)
        
        # Encontrar lunes de esta semana
        monday = start_date - timedelta(days=start_date.weekday())
        
        # Generar 7 días
        return [monday + timedelta(days=i) for i in range(7)]
    
    @staticmethod
    def get_month_name(month_num, language='es'):
        """Devuelve nombre del mes"""
        months_es = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]
        
        if 1 <= month_num <= 12:
            return months_es[month_num - 1]
        return str(month_num)
    
    @staticmethod
    def is_today(date_str):
        """Verifica si una fecha es hoy"""
        try:
            if isinstance(date_str, str):
                date = datetime.fromisoformat(date_str.split('T')[0])
            else:
                date = date_str
            
            today = datetime.now().date()
            return date.date() == today
        except:
            return False