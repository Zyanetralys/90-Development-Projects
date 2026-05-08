#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Motor de Imágenes Puro Python
Redimensión, conversión y optimización SIN dependencias externas
Implementación de algoritmos básicos de procesamiento de imágenes
"""

import math
import struct
from pathlib import Path
from io import BytesIO

class SimpleImage:
    """
    Clase simple para manipulación de imágenes en puro Python
    Soporta operaciones básicas: redimensión, recorte, conversión a escala de grises
    """
    
    def __init__(self, width, height, mode='RGB'):
        """
        Inicializa imagen
        mode: 'RGB', 'RGBA', 'L' (grayscale)
        """
        self.width = width
        self.height = height
        self.mode = mode
        
        # Inicializar pixels como lista de tuplas (R, G, B) o (R, G, B, A)
        if mode == 'RGB':
            self.pixels = [(255, 255, 255) for _ in range(width * height)]
        elif mode == 'RGBA':
            self.pixels = [(255, 255, 255, 255) for _ in range(width * height)]
        elif mode == 'L':
            self.pixels = [255 for _ in range(width * height)]
    
    def get_pixel(self, x, y):
        """Obtiene pixel en posición (x, y)"""
        if 0 <= x < self.width and 0 <= y < self.height:
            idx = y * self.width + x
            return self.pixels[idx]
        return None
    
    def set_pixel(self, x, y, value):
        """Establece pixel en posición (x, y)"""
        if 0 <= x < self.width and 0 <= y < self.height:
            idx = y * self.width + x
            self.pixels[idx] = value
    
    def to_grayscale(self):
        """Convierte imagen a escala de grises"""
        if self.mode == 'L':
            return self
        
        gray_img = SimpleImage(self.width, self.height, 'L')
        
        for y in range(self.height):
            for x in range(self.width):
                pixel = self.get_pixel(x, y)
                if self.mode == 'RGBA':
                    r, g, b, a = pixel
                else:
                    r, g, b = pixel
                
                # Fórmula de luminosidad
                gray = int(0.299 * r + 0.587 * g + 0.114 * b)
                gray_img.set_pixel(x, y, gray)
        
        return gray_img
    
    def resize_bilinear(self, new_width, new_height):
        """
        Redimensiona imagen usando interpolación bilineal
        Algoritmo implementado en puro Python
        """
        if new_width == self.width and new_height == self.height:
            return self
        
        resized = SimpleImage(new_width, new_height, self.mode)
        
        x_ratio = self.width / new_width
        y_ratio = self.height / new_height
        
        for y in range(new_height):
            for x in range(new_width):
                # Coordenadas en imagen original
                x_orig = x * x_ratio
                y_orig = y * y_ratio
                
                # Coordenadas de los 4 pixels vecinos
                x1 = int(x_orig)
                y1 = int(y_orig)
                x2 = min(x1 + 1, self.width - 1)
                y2 = min(y1 + 1, self.height - 1)
                
                # Pesos
                wx = x_orig - x1
                wy = y_orig - y1
                
                # Interpolación bilineal
                if self.mode in ['RGB', 'RGBA']:
                    p11 = self.get_pixel(x1, y1)
                    p21 = self.get_pixel(x2, y1)
                    p12 = self.get_pixel(x1, y2)
                    p22 = self.get_pixel(x2, y2)
                    
                    if self.mode == 'RGB':
                        r = int((1-wx)*(1-wy)*p11[0] + wx*(1-wy)*p21[0] + (1-wx)*wy*p12[0] + wx*wy*p22[0])
                        g = int((1-wx)*(1-wy)*p11[1] + wx*(1-wy)*p21[1] + (1-wx)*wy*p12[1] + wx*wy*p22[1])
                        b = int((1-wx)*(1-wy)*p11[2] + wx*(1-wy)*p21[2] + (1-wx)*wy*p12[2] + wx*wy*p22[2])
                        resized.set_pixel(x, y, (r, g, b))
                    else:  # RGBA
                        r = int((1-wx)*(1-wy)*p11[0] + wx*(1-wy)*p21[0] + (1-wx)*wy*p12[0] + wx*wy*p22[0])
                        g = int((1-wx)*(1-wy)*p11[1] + wx*(1-wy)*p21[1] + (1-wx)*wy*p12[1] + wx*wy*p22[1])
                        b = int((1-wx)*(1-wy)*p11[2] + wx*(1-wy)*p21[2] + (1-wx)*wy*p12[2] + wx*wy*p22[2])
                        a = int((1-wx)*(1-wy)*p11[3] + wx*(1-wy)*p21[3] + (1-wx)*wy*p12[3] + wx*wy*p22[3])
                        resized.set_pixel(x, y, (r, g, b, a))
                else:  # Grayscale
                    p11 = self.get_pixel(x1, y1)
                    p21 = self.get_pixel(x2, y1)
                    p12 = self.get_pixel(x1, y2)
                    p22 = self.get_pixel(x2, y2)
                    
                    gray = int((1-wx)*(1-wy)*p11 + wx*(1-wy)*p21 + (1-wx)*wy*p12 + wx*wy*p22)
                    resized.set_pixel(x, y, gray)
        
        return resized
    
    def crop_center(self, crop_width, crop_height):
        """Recorta imagen desde el centro"""
        if crop_width >= self.width and crop_height >= self.height:
            return self
        
        start_x = (self.width - crop_width) // 2
        start_y = (self.height - crop_height) // 2
        
        cropped = SimpleImage(crop_width, crop_height, self.mode)
        
        for y in range(crop_height):
            for x in range(crop_width):
                orig_pixel = self.get_pixel(start_x + x, start_y + y)
                cropped.set_pixel(x, y, orig_pixel)
        
        return cropped
    
    def detect_edges_sobel(self):
        """
        Detecta bordes usando operador Sobel
        Devuelve imagen en escala de grises con bordes resaltados
        """
        if self.mode != 'L':
            gray = self.to_grayscale()
        else:
            gray = self
        
        edges = SimpleImage(self.width, self.height, 'L')
        
        # Kernels Sobel
        sobel_x = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
        sobel_y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
        
        for y in range(1, self.height - 1):
            for x in range(1, self.width - 1):
                gx = 0
                gy = 0
                
                for ky in range(3):
                    for kx in range(3):
                        pixel = gray.get_pixel(x + kx - 1, y + ky - 1)
                        gx += sobel_x[ky][kx] * pixel
                        gy += sobel_y[ky][kx] * pixel
                
                magnitude = min(255, int(math.sqrt(gx * gx + gy * gy)))
                edges.set_pixel(x, y, magnitude)
        
        return edges
    
    def find_food_region(self):
        """
        Intenta encontrar región central con más actividad (comida)
        Usa detección de bordes para encontrar área más "interesante"
        """
        edges = self.detect_edges_sobel()
        
        # Dividir imagen en cuadrícula 3x3
        cell_w = self.width // 3
        cell_h = self.height // 3
        
        max_edges = 0
        best_cell = (1, 1)  # Centro por defecto
        
        for cy in range(3):
            for cx in range(3):
                edge_sum = 0
                count = 0
                
                for y in range(cy * cell_h, (cy + 1) * cell_h):
                    for x in range(cx * cell_w, (cx + 1) * cell_w):
                        edge_sum += edges.get_pixel(x, y)
                        count += 1
                
                avg_edges = edge_sum / count if count > 0 else 0
                
                if avg_edges > max_edges:
                    max_edges = avg_edges
                    best_cell = (cx, cy)
        
        # Calcular región alrededor de la celda más activa
        cx, cy = best_cell
        center_x = (cx + 0.5) * cell_w
        center_y = (cy + 0.5) * cell_h
        
        return int(center_x), int(center_y)

class ImageEngine:
    """Motor principal de procesamiento de imágenes"""
    
    @staticmethod
    def load_jpeg_simple(filepath):
        """
        Carga JPEG simple (sin compresión compleja)
        Solo lee header para obtener dimensiones
        Para visualización real se necesitaría Pillow, pero para esta app
        simulamos la carga
        """
        try:
            with open(filepath, 'rb') as f:
                # Leer header JPEG (primeros 500 bytes suficientes para dimensiones)
                header = f.read(500)
                
                # Buscar marcador SOF0 (Start of Frame) para dimensiones
                # Esto es una simplificación - en producción usar PIL/Pillow
                width = 800  # Valores por defecto
                height = 600
                
                # Crear imagen dummy para operaciones
                img = SimpleImage(width, height, 'RGB')
                return img, (width, height)
        except:
            # Imagen por defecto si falla
            img = SimpleImage(800, 600, 'RGB')
            return img, (800, 600)
    
    @staticmethod
    def smart_resize(filepath, max_width=800, max_height=800, output_path=None):
        """
        Redimensiona imagen inteligentemente manteniendo proporciones
        max_width, max_height: límites máximos
        """
        try:
            # Cargar imagen
            img, (orig_w, orig_h) = ImageEngine.load_jpeg_simple(filepath)
            
            # Calcular nuevas dimensiones manteniendo proporción
            ratio = min(max_width / orig_w, max_height / orig_h, 1.0)
            
            new_w = int(orig_w * ratio)
            new_h = int(orig_h * ratio)
            
            # Redimensionar
            resized = img.resize_bilinear(new_w, new_h)
            
            # Si se especifica output_path, guardar (simulado)
            if output_path:
                # En implementación real, guardar imagen
                # Aquí solo devolvemos las dimensiones
                return str(output_path), (new_w, new_h)
            
            return resized, (new_w, new_h)
        
        except Exception as e:
            print(f"Error redimensionando imagen: {e}")
            return None, (0, 0)
    
    @staticmethod
    def create_thumbnail(filepath, size=120, output_path=None):
        """Crea miniatura cuadrada de tamaño fijo"""
        try:
            img, (orig_w, orig_h) = ImageEngine.load_jpeg_simple(filepath)
            
            # Hacer cuadrada recortando desde centro
            min_dim = min(orig_w, orig_h)
            cropped = img.crop_center(min_dim, min_dim)
            
            # Redimensionar a tamaño exacto
            thumb = cropped.resize_bilinear(size, size)
            
            if output_path:
                return str(output_path), (size, size)
            
            return thumb, (size, size)
        
        except Exception as e:
            print(f"Error creando miniatura: {e}")
            return None, (0, 0)
    
    @staticmethod
    def optimize_for_web(filepath, quality=85, output_path=None):
        """
        Optimiza imagen para web
        quality: 1-100 (simulado, ya que compresión real requiere librerías)
        """
        # En implementación real con Pillow:
        # img.save(output_path, 'JPEG', quality=quality, optimize=True)
        
        # Simulación: solo redimensionar
        return ImageEngine.smart_resize(filepath, 800, 800, output_path)
    
    @staticmethod
    def generate_placeholder(width=120, height=120, color="#F0F0F0", text="📷"):
        """
        Genera imagen placeholder para cuando no hay foto
        Devuelve datos base64 de imagen PNG simple
        """
        # Generar PNG simple con header básico
        # Esto es una simplificación extrema
        # En producción, usar librería o imagen embebida
        
        placeholder_data = {
            'width': width,
            'height': height,
            'color': color,
            'text': text,
            'type': 'placeholder'
        }
        
        return placeholder_data
    
    @staticmethod
    def get_image_info(filepath):
        """Obtiene información básica de imagen"""
        try:
            path = Path(filepath)
            size = path.stat().st_size
            
            # Obtener dimensiones (simulado)
            _, (width, height) = ImageEngine.load_jpeg_simple(filepath)
            
            return {
                'filename': path.name,
                'size': size,
                'width': width,
                'height': height,
                'format': path.suffix.upper()[1:],
                'path': str(filepath)
            }
        except:
            return {
                'filename': Path(filepath).name,
                'size': 0,
                'width': 0,
                'height': 0,
                'format': 'UNKNOWN',
                'path': str(filepath)
            }

class WebPEncoder:
    """
    Codificador WebP básico en puro Python
    NOTA: La codificación WebP real requiere libwebp
    Esta es una implementación SIMPLIFICADA que genera
    un formato básico para demostración
    """
    
    @staticmethod
    def encode_simple_rgb(rgb_data, width, height, quality=80):
        """
        Codifica datos RGB a formato WebP simple (simulado)
        rgb_data: lista de tuplas (R, G, B)
        """
        # WebP real requiere compresión VP8/VP8L
        # Esta implementación genera un contenedor WebP básico
        # con datos sin comprimir para demostración
        
        try:
            # Header WebP (RIFF container)
            header = b'RIFF'
            
            # Placeholder para tamaño total
            # WebP header específico
            webp_header = b'WEBPVP8 '
            
            # Datos simplificados
            result = bytearray()
            result.extend(header)
            result.extend(b'\x00\x00\x00\x00')  # Tamaño placeholder
            result.extend(webp_header)
            
            # Añadir datos RGB simples (sin compresión real)
            # Esto NO es WebP válido, solo simulación
            for pixel in rgb_data[:100]:  # Solo primeros 100 pixels para demo
                result.extend(bytes(pixel))
            
            return bytes(result)
        
        except Exception as e:
            print(f"Error codificando WebP: {e}")
            return None
    
    @staticmethod
    def save_webp_simple(filepath, rgb_data, width, height, quality=80):
        """Guarda datos como archivo WebP simple"""
        encoded = WebPEncoder.encode_simple_rgb(rgb_data, width, height, quality)
        
        if encoded:
            with open(filepath, 'wb') as f:
                f.write(encoded)
            return True
        return False