#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de PDF en Puro Python
Crea archivos PDF válidos sin dependencias externas
Implementación básica del formato PDF 1.7
"""

import struct
import zlib
from pathlib import Path
from datetime import datetime
import math

class PDFObject:
    """Representa un objeto PDF"""
    
    def __init__(self, obj_id, data):
        self.obj_id = obj_id
        self.data = data
    
    def to_bytes(self):
        """Convierte objeto a bytes"""
        result = bytearray()
        result.extend(f"{self.obj_id} 0 obj\n".encode())
        result.extend(self.data)
        result.extend(b"\nendobj\n")
        return bytes(result)

class PDFEngine:
    """
    Generador de PDF básico
    Crea PDFs válidos con texto, imágenes básicas y formato
    """
    
    def __init__(self, author="Cocinando con Papi", title="Recetas"):
        self.objects = []
        self.current_obj_id = 1
        self.pages = []
        self.author = author
        self.title = title
        self.fonts = {}
        self.xref_offset = 0
    
    def add_object(self, data):
        """Añade objeto al PDF"""
        obj = PDFObject(self.current_obj_id, data)
        self.objects.append(obj)
        self.current_obj_id += 1
        return obj.obj_id
    
    def add_page(self, content_stream):
        """Añade página al PDF"""
        # Crear contenido de página
        content_id = self.add_object(content_stream)
        
        # Crear recursos (fuentes)
        resources = self._create_resources()
        
        # Crear página
        page_data = bytearray()
        page_data.extend(b"<<\n")
        page_data.extend(b"/Type /Page\n")
        page_data.extend(b"/Parent 2 0 R\n")
        page_data.extend(f"/Resources {resources}\n".encode())
        page_data.extend(f"/Contents {content_id} 0 R\n".encode())
        page_data.extend(b"/MediaBox [0 0 595 842]\n")  # A4
        page_data.extend(b">>")
        
        page_id = self.add_object(bytes(page_data))
        self.pages.append(page_id)
        return page_id
    
    def _create_resources(self):
        """Crea diccionario de recursos (fuentes)"""
        # Definir fuentes básicas
        if not self.fonts:
            # Fuente Helvetica
            font_data = bytearray()
            font_data.extend(b"<<\n")
            font_data.extend(b"/F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n")
            font_data.extend(b"/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\n")
            font_data.extend(b"/F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\n")
            font_data.extend(b">>")
            self.fonts = bytes(font_data)
        
        return b"3 0 R"  # Referencia al objeto de recursos
    
    def _create_content_stream(self, commands):
        """Crea stream de contenido comprimido"""
        stream_data = bytearray()
        
        # Operadores PDF básicos
        for cmd in commands:
            stream_data.extend(cmd.encode())
            stream_data.extend(b"\n")
        
        # Comprimir stream
        compressed = zlib.compress(stream_data)
        
        # Crear objeto stream
        stream_obj = bytearray()
        stream_obj.extend(b"<<\n")
        stream_obj.extend(b"/Length " + str(len(compressed)).encode() + b"\n")
        stream_obj.extend(b"/Filter /FlateDecode\n")
        stream_obj.extend(b">>\n")
        stream_obj.extend(b"stream\n")
        stream_obj.extend(compressed)
        stream_obj.extend(b"\nendstream")
        
        return bytes(stream_obj)
    
    def generate_recipe_book(self, recipes, output_path, include_photos=True):
        """
        Genera libro de recetas en PDF
        recipes: lista de diccionarios con datos de recetas
        """
        # Página de portada
        self._add_cover_page()
        
        # Páginas de recetas
        for recipe in recipes:
            self._add_recipe_page(recipe, include_photos)
        
        # Guardar PDF
        self._save_pdf(output_path)
    
    def _add_cover_page(self):
        """Añade página de portada"""
        commands = [
            "BT",  # Begin Text
            "/F2 36 Tf",  # Fuente Helvetica-Bold, 36pt
            "170 700 Td",  # Posición
            "(🥘 COCINANDO CON PAPI) Tj",
            "ET",
            
            "BT",
            "/F1 20 Tf",
            "180 650 Td",
            "(Tu libro de recetas personal) Tj",
            "ET",
            
            "BT",
            "/F1 14 Tf",
            "200 600 Td",
            "(© Jose Antonio Martinez Rubio) Tj",
            "ET",
            
            "BT",
            "/F1 12 Tf",
            "150 550 Td",
            f"({datetime.now().strftime('%d de %B de %Y')}) Tj",
            "ET",
            
            # Decoración
            "0.7 0.7 0.7 RG",  # Color gris
            "50 500 m",
            "545 500 l",
            "S",  # Stroke
        ]
        
        content = self._create_content_stream(commands)
        self.add_page(content)
    
    def _add_recipe_page(self, recipe, include_photos=True):
        """Añade página de receta"""
        commands = []
        
        y_pos = 750
        
        # Título
        commands.extend([
            "BT",
            "/F2 24 Tf",
            f"50 {y_pos} Td",
            f"({self._escape_text(recipe.get('title', 'Sin título'))}) Tj",
            "ET"
        ])
        y_pos -= 40
        
        # Metadatos
        meta_parts = []
        
        # Rating
        if recipe.get('rating_taste'):
            stars = "★" * recipe['rating_taste'] + "☆" * (10 - recipe['rating_taste'])
            meta_parts.append(f"{stars} {recipe['rating_taste']}/10")
        
        # Tiempo
        prep = recipe.get('prep_time', 0)
        cook = recipe.get('cook_time', 0)
        total = prep + cook
        if total > 0:
            meta_parts.append(f"⏱️ {total} min")
        
        # Raciones
        if recipe.get('servings'):
            meta_parts.append(f"👥 {recipe['servings']} pers")
        
        # Dificultad
        if recipe.get('difficulty'):
            diff_map = {
                'principiante': '👶',
                'intermedio': '👨‍🍳',
                'experto': '👨‍🍳👨‍🍳'
            }
            meta_parts.append(f"{diff_map.get(recipe['difficulty'], '')} {recipe['difficulty']}")
        
        if meta_parts:
            commands.extend([
                "BT",
                "/F1 12 Tf",
                f"50 {y_pos} Td",
                f"({' | '.join(meta_parts)}) Tj",
                "ET"
            ])
            y_pos -= 25
        
        # Categorías
        if recipe.get('categories'):
            cats = recipe['categories'].split(',')[:3]
            commands.extend([
                "BT",
                "/F3 11 Tf",
                f"50 {y_pos} Td",
                f"(🏷️ {', '.join(cats)}) Tj",
                "ET"
            ])
            y_pos -= 30
        
        # Ingredientes
        commands.extend([
            "BT",
            "/F2 16 Tf",
            f"50 {y_pos} Td",
            "(Ingredientes) Tj",
            "ET"
        ])
        y_pos -= 25
        
        if recipe.get('ingredients_list'):
            ingredients = recipe['ingredients_list'].split(',')[:10]
            for ing in ingredients:
                if y_pos < 100:  # Nueva página si no hay espacio
                    content = self._create_content_stream(commands)
                    self.add_page(content)
                    commands = []
                    y_pos = 750
                
                ing_parts = ing.split(':')
                name = ing_parts[0] if len(ing_parts) > 0 else ""
                qty = ing_parts[1] if len(ing_parts) > 1 else ""
                
                commands.extend([
                    "BT",
                    "/F1 11 Tf",
                    f"60 {y_pos} Td",
                    f"(• {qty} {name}) Tj",
                    "ET"
                ])
                y_pos -= 18
        
        y_pos -= 15
        
        # Instrucciones
        commands.extend([
            "BT",
            "/F2 16 Tf",
            f"50 {y_pos} Td",
            "(Instrucciones) Tj",
            "ET"
        ])
        y_pos -= 25
        
        instructions = recipe.get('instructions', '')
        if instructions:
            # Dividir en líneas
            words = instructions.split()
            line = ""
            lines = []
            
            for word in words:
                test_line = line + " " + word if line else word
                if len(test_line) > 80:
                    lines.append(line)
                    line = word
                else:
                    line = test_line
            if line:
                lines.append(line)
            
            for line_text in lines[:15]:  # Máximo 15 líneas
                if y_pos < 100:
                    break
                
                commands.extend([
                    "BT",
                    "/F1 11 Tf",
                    f"60 {y_pos} Td",
                    f"({self._escape_text(line_text)}) Tj",
                    "ET"
                ])
                y_pos -= 16
        
        # Notas
        if recipe.get('notes') or recipe.get('alternative_recipe'):
            y_pos -= 20
            commands.extend([
                "BT",
                "/F3 11 Tf",
                f"50 {y_pos} Td",
                "(Notas personales) Tj",
                "ET"
            ])
            y_pos -= 20
            
            if recipe.get('notes'):
                commands.extend([
                    "BT",
                    "/F1 10 Tf",
                    f"60 {y_pos} Td",
                    f"(📝 {self._escape_text(recipe['notes'][:100])}) Tj",
                    "ET"
                ])
                y_pos -= 15
            
            if recipe.get('alternative_recipe'):
                commands.extend([
                    "BT",
                    "/F1 10 Tf",
                    f"60 {y_pos} Td",
                    f"(✨ Variante: {self._escape_text(recipe['alternative_recipe'][:100])}) Tj",
                    "ET"
                ])
        
        # Separador de página
        commands.extend([
            "0.9 0.9 0.9 RG",
            "50 50 m",
            "545 50 l",
            "S"
        ])
        
        content = self._create_content_stream(commands)
        self.add_page(content)
    
    def _escape_text(self, text):
        """Escapa caracteres especiales PDF"""
        if not text:
            return ""
        
        # Reemplazar caracteres especiales
        text = text.replace('\\', '\\\\')
        text = text.replace('(', '\\(')
        text = text.replace(')', '\\)')
        text = text.replace('\n', ' ')
        text = text.replace('\r', ' ')
        
        # Limitar longitud
        return text[:200]
    
    def _save_pdf(self, output_path):
        """Guarda PDF en archivo"""
        pdf_data = bytearray()
        
        # Header PDF
        pdf_data.extend(b"%PDF-1.7\n")
        pdf_data.extend(b"%âãÏÓ\n\n")  # Caracteres binarios para identificar como binario
        
        # Guardar posición para xref
        self.xref_offset = len(pdf_data)
        
        # Escribir todos los objetos
        for obj in self.objects:
            pdf_data.extend(obj.to_bytes())
        
        # Cross-reference table
        xref_pos = len(pdf_data)
        pdf_data.extend(b"xref\n")
        pdf_data.extend(f"0 {len(self.objects) + 1}\n".encode())
        pdf_data.extend(b"0000000000 65535 f \n")
        
        for i in range(len(self.objects)):
            offset = pdf_data.find(f"{i + 1} 0 obj\n".encode())
            pdf_data.extend(f"{offset:010d} 00000 n \n".encode())
        
        # Trailer
        pdf_data.extend(b"trailer\n")
        pdf_data.extend(b"<<\n")
        pdf_data.extend(f"/Size {len(self.objects) + 1}\n".encode())
        pdf_data.extend(b"/Root 1 0 R\n")
        pdf_data.extend(f"/Info 2 0 R\n".encode())
        pdf_data.extend(b">>\n")
        
        pdf_data.extend(b"startxref\n")
        pdf_data.extend(f"{xref_pos}\n".encode())
        pdf_data.extend(b"%%EOF\n")
        
        # Crear objeto Root (Catalog)
        catalog = bytearray()
        catalog.extend(b"<<\n")
        catalog.extend(b"/Type /Catalog\n")
        catalog.extend(b"/Pages 2 0 R\n")
        catalog.extend(b">>")
        self.add_object(bytes(catalog))
        
        # Crear objeto Pages
        pages_data = bytearray()
        pages_data.extend(b"<<\n")
        pages_data.extend(b"/Type /Pages\n")
        pages_data.extend(f"/Kids [{' '.join([f'{pid} 0 R' for pid in self.pages])}]\n".encode())
        pages_data.extend(f"/Count {len(self.pages)}\n".encode())
        pages_data.extend(b">>")
        self.add_object(bytes(pages_data))
        
        # Crear objeto Info
        info_data = bytearray()
        info_data.extend(b"<<\n")
        info_data.extend(f"/Title ({self.title})\n".encode())
        info_data.extend(f"/Author ({self.author})\n".encode())
        info_data.extend(f"/Creator (Cocinando con Papi v2.0)\n".encode())
        info_data.extend(f"/Producer (Python PDF Engine)\n".encode())
        info_data.extend(f"/CreationDate (D:{datetime.now().strftime('%Y%m%d%H%M%S')})\n".encode())
        info_data.extend(b">>")
        self.add_object(bytes(info_data))
        
        # Crear objeto Resources (fuentes)
        self.add_object(self.fonts)
        
        # Escribir a archivo
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'wb') as f:
            f.write(pdf_data)
        
        return str(output_path)

def export_recipes_to_pdf(recipes, output_path="exports/recetas.pdf", include_photos=True):
    """
    Función helper para exportar recetas a PDF
    recipes: lista de diccionarios con datos de recetas
    """
    engine = PDFEngine(
        author="Cocinando con Papi",
        title=f"Recetas - {datetime.now().strftime('%d/%m/%Y')}"
    )
    
    engine.generate_recipe_book(recipes, output_path, include_photos)
    return output_path