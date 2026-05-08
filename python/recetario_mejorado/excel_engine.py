#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exportador Excel/CSV en Puro Python
Genera archivos XLSX y CSV sin dependencias externas
Implementación del formato Office Open XML (XLSX)
"""

import zipfile
import xml.etree.ElementTree as ET
from xml.dom import minidom
import json
from pathlib import Path
from datetime import datetime
import csv

class CSVEngine:
    """Motor de exportación CSV"""
    
    @staticmethod
    def export_recipes(recipes, output_path, encoding='utf-8-sig'):
        """
        Exporta recetas a CSV
        encoding='utf-8-sig' para compatibilidad con Excel
        """
        if not recipes:
            return None
        
        # Definir campos
        fieldnames = [
            'ID', 'Título', 'Descripción', 'Tiempo preparación (min)',
            'Tiempo cocción (min)', 'Total tiempo (min)', 'Raciones',
            'Dificultad', 'Origen', 'Rating Sabor', 'Rating Facilidad',
            'Rating Coste', 'Favorito', 'Categorías', 'Ingredientes',
            'Tags', 'Kcal', 'Proteínas (g)', 'Carbohidratos (g)',
            'Grasas (g)', 'Instrucciones', 'Notas', 'Variante',
            'Creado', 'Modificado'
        ]
        
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', newline='', encoding=encoding) as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for recipe in recipes:
                row = {
                    'ID': recipe.get('id', ''),
                    'Título': recipe.get('title', ''),
                    'Descripción': recipe.get('description', ''),
                    'Tiempo preparación (min)': recipe.get('prep_time', ''),
                    'Tiempo cocción (min)': recipe.get('cook_time', ''),
                    'Total tiempo (min)': (recipe.get('prep_time', 0) or 0) + (recipe.get('cook_time', 0) or 0),
                    'Raciones': recipe.get('servings', ''),
                    'Dificultad': recipe.get('difficulty', ''),
                    'Origen': recipe.get('origin', ''),
                    'Rating Sabor': recipe.get('rating_taste', ''),
                    'Rating Facilidad': recipe.get('rating_ease', ''),
                    'Rating Coste': recipe.get('rating_cost', ''),
                    'Favorito': 'Sí' if recipe.get('is_favorite') else 'No',
                    'Categorías': recipe.get('categories', '').replace(',', '; ') if recipe.get('categories') else '',
                    'Ingredientes': recipe.get('ingredients_list', '').replace(',', '; ') if recipe.get('ingredients_list') else '',
                    'Tags': recipe.get('tags_list', '').replace(',', '; ') if recipe.get('tags_list') else '',
                    'Kcal': recipe.get('nutrition_kcal', ''),
                    'Proteínas (g)': recipe.get('nutrition_protein', ''),
                    'Carbohidratos (g)': recipe.get('nutrition_carbs', ''),
                    'Grasas (g)': recipe.get('nutrition_fat', ''),
                    'Instrucciones': recipe.get('instructions', '').replace('\n', ' | ') if recipe.get('instructions') else '',
                    'Notas': recipe.get('notes', ''),
                    'Variante': recipe.get('alternative_recipe', ''),
                    'Creado': recipe.get('created_at', ''),
                    'Modificado': recipe.get('updated_at', '')
                }
                writer.writerow(row)
        
        return output_path
    
    @staticmethod
    def export_shopping_list(items, output_path, encoding='utf-8-sig'):
        """Exporta lista de la compra a CSV"""
        if not items:
            return None
        
        fieldnames = ['Categoría', 'Ingrediente', 'Cantidad', 'Unidad', 'Notas', 'Comprado']
        
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', newline='', encoding=encoding) as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in items:
                row = {
                    'Categoría': item.get('category', ''),
                    'Ingrediente': item.get('name', ''),
                    'Cantidad': item.get('quantity', ''),
                    'Unidad': item.get('unit', ''),
                    'Notas': item.get('notes', ''),
                    'Comprado': 'Sí' if item.get('bought', False) else 'No'
                }
                writer.writerow(row)
        
        return output_path

class XLSEngine:
    """
    Motor de exportación XLSX
    Implementación básica del formato Office Open XML
    Crea archivos .xlsx válidos sin librerías externas
    """
    
    @staticmethod
    def export_recipes(recipes, output_path):
        """
        Exporta recetas a XLSX con múltiples hojas
        """
        if not recipes:
            return None
        
        # Crear directorio temporal para archivos XML
        temp_dir = Path(output_path).parent / "temp_xlsx"
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        try:
            # Crear estructura XLSX
            XLSEngine._create_xlsx_structure(recipes, temp_dir)
            
            # Comprimir a ZIP con extensión .xlsx
            XLSEngine._zip_to_xlsx(temp_dir, output_path)
            
            return output_path
        
        finally:
            # Limpiar directorio temporal
            import shutil
            if temp_dir.exists():
                shutil.rmtree(temp_dir)
    
    @staticmethod
    def _create_xlsx_structure(recipes, temp_dir):
        """Crea estructura de archivos XML para XLSX"""
        
        # Crear directorios necesarios
        (temp_dir / "xl" / "worksheets").mkdir(parents=True)
        (temp_dir / "xl" / "theme").mkdir(parents=True)
        (temp_dir / "xl" / "_rels").mkdir(parents=True)
        
        # 1. Crear hojas de cálculo
        XLSEngine._create_recipes_sheet(recipes, temp_dir / "xl" / "worksheets" / "sheet1.xml")
        XLSEngine._create_ingredients_sheet(recipes, temp_dir / "xl" / "worksheets" / "sheet2.xml")
        XLSEngine._create_categories_sheet(recipes, temp_dir / "xl" / "worksheets" / "sheet3.xml")
        
        # 2. Crear workbook.xml
        XLSEngine._create_workbook(temp_dir / "xl" / "workbook.xml")
        
        # 3. Crear styles.xml
        XLSEngine._create_styles(temp_dir / "xl" / "styles.xml")
        
        # 4. Crear theme
        XLSEngine._create_theme(temp_dir / "xl" / "theme" / "theme1.xml")
        
        # 5. Crear archivos de relaciones
        XLSEngine._create_root_rels(temp_dir / "_rels" / ".rels")
        XLSEngine._create_xl_rels(temp_dir / "xl" / "_rels" / "workbook.xml.rels")
        
        # 6. Crear [Content_Types].xml
        XLSEngine._create_content_types(temp_dir / "[Content_Types].xml")
    
    @staticmethod
    def _create_recipes_sheet(recipes, filepath):
        """Crea hoja de recetas"""
        
        # Crear XML
        worksheet = ET.Element('worksheet', xmlns='http://schemas.openxmlformats.org/spreadsheetml/2006/main')
        
        # Dimensiones
        dimension = ET.SubElement(worksheet, 'dimension', ref=f'A1:W{len(recipes) + 1}')
        
        # Sheet views
        sheet_views = ET.SubElement(worksheet, 'sheetViews')
        sheet_view = ET.SubElement(sheet_views, 'sheetView', workbookViewId="0")
        
        # Sheet format
        sheet_format = ET.SubElement(worksheet, 'sheetFormatPr', defaultRowHeight="15")
        
        # Columnas con anchos personalizados
        cols = ET.SubElement(worksheet, 'cols')
        col_widths = [5, 30, 40, 10, 10, 10, 10, 15, 20, 10, 10, 10, 10, 20, 30, 20, 10, 10, 10, 10, 50, 30, 30, 20, 20]
        for i, width in enumerate(col_widths, 1):
            ET.SubElement(cols, 'col', min=str(i), max=str(i), width=str(width), customWidth="1")
        
        # Sheet data
        sheet_data = ET.SubElement(worksheet, 'sheetData')
        
        # Fila de encabezados
        header_row = ET.SubElement(sheet_data, 'row', r="1")
        
        headers = [
            'ID', 'Título', 'Descripción', 'Prep (min)', 'Cocción (min)', 
            'Total (min)', 'Raciones', 'Dificultad', 'Origen', 'Sabor', 
            'Facilidad', 'Coste', 'Favorito', 'Categorías', 'Ingredientes', 
            'Tags', 'Kcal', 'Proteínas', 'Carbs', 'Grasas', 
            'Instrucciones', 'Notas', 'Variante', 'Creado', 'Modificado'
        ]
        
        for i, header in enumerate(headers, 1):
            cell = ET.SubElement(header_row, 'c', r=f"{chr(64 + i) if i <= 26 else chr(64 + (i-1)//26) + chr(65 + (i-1)%26)}1", t="s")
            ET.SubElement(cell, 'v').text = str(i - 1)
        
        # Filas de datos
        for row_idx, recipe in enumerate(recipes, 2):
            row = ET.SubElement(sheet_data, 'row', r=str(row_idx))
            
            data = [
                str(recipe.get('id', '')),
                recipe.get('title', ''),
                recipe.get('description', ''),
                str(recipe.get('prep_time', '')),
                str(recipe.get('cook_time', '')),
                str((recipe.get('prep_time', 0) or 0) + (recipe.get('cook_time', 0) or 0)),
                str(recipe.get('servings', '')),
                recipe.get('difficulty', ''),
                recipe.get('origin', ''),
                str(recipe.get('rating_taste', '')),
                str(recipe.get('rating_ease', '')),
                str(recipe.get('rating_cost', '')),
                'Sí' if recipe.get('is_favorite') else 'No',
                recipe.get('categories', '').replace(',', '; ') if recipe.get('categories') else '',
                recipe.get('ingredients_list', '').replace(',', '; ') if recipe.get('ingredients_list') else '',
                recipe.get('tags_list', '').replace(',', '; ') if recipe.get('tags_list') else '',
                str(recipe.get('nutrition_kcal', '')),
                str(recipe.get('nutrition_protein', '')),
                str(recipe.get('nutrition_carbs', '')),
                str(recipe.get('nutrition_fat', '')),
                recipe.get('instructions', '').replace('\n', ' | ') if recipe.get('instructions') else '',
                recipe.get('notes', ''),
                recipe.get('alternative_recipe', ''),
                recipe.get('created_at', ''),
                recipe.get('updated_at', '')
            ]
            
            for col_idx, value in enumerate(data, 1):
                col_letter = chr(64 + col_idx) if col_idx <= 26 else chr(64 + (col_idx-1)//26) + chr(65 + (col_idx-1)%26)
                cell = ET.SubElement(row, 'c', r=f"{col_letter}{row_idx}", t="inlineStr" if value else None)
                if value:
                    is_elem = ET.SubElement(cell, 'is')
                    t_elem = ET.SubElement(is_elem, 't')
                    t_elem.text = value
        
        # Escribir XML formateado
        XLSEngine._write_xml(filepath, worksheet)
    
    @staticmethod
    def _create_ingredients_sheet(recipes, filepath):
        """Crea hoja de ingredientes"""
        worksheet = ET.Element('worksheet', xmlns='http://schemas.openxmlformats.org/spreadsheetml/2006/main')
        ET.SubElement(worksheet, 'dimension', ref='A1:F1000')
        ET.SubElement(worksheet, 'sheetViews').append(ET.Element('sheetView', workbookViewId="0"))
        ET.SubElement(worksheet, 'sheetFormatPr', defaultRowHeight="15")
        
        sheet_data = ET.SubElement(worksheet, 'sheetData')
        
        # Encabezados
        header_row = ET.SubElement(sheet_data, 'row', r="1")
        headers = ['Receta ID', 'Receta', 'Ingrediente', 'Cantidad', 'Unidad', 'Notas']
        for i, header in enumerate(headers, 1):
            cell = ET.SubElement(header_row, 'c', r=f"{chr(64 + i)}1", t="s")
            ET.SubElement(cell, 'v').text = str(i - 1)
        
        # Escribir XML
        XLSEngine._write_xml(filepath, worksheet)
    
    @staticmethod
    def _create_categories_sheet(recipes, filepath):
        """Crea hoja de categorías"""
        worksheet = ET.Element('worksheet', xmlns='http://schemas.openxmlformats.org/spreadsheetml/2006/main')
        ET.SubElement(worksheet, 'dimension', ref='A1:C100')
        ET.SubElement(worksheet, 'sheetViews').append(ET.Element('sheetView', workbookViewId="0"))
        ET.SubElement(worksheet, 'sheetFormatPr', defaultRowHeight="15")
        
        sheet_data = ET.SubElement(worksheet, 'sheetData')
        
        # Encabezados
        header_row = ET.SubElement(sheet_data, 'row', r="1")
        headers = ['Receta ID', 'Receta', 'Categoría']
        for i, header in enumerate(headers, 1):
            cell = ET.SubElement(header_row, 'c', r=f"{chr(64 + i)}1", t="s")
            ET.SubElement(cell, 'v').text = str(i - 1)
        
        # Escribir XML
        XLSEngine._write_xml(filepath, worksheet)
    
    @staticmethod
    def _create_workbook(filepath):
        """Crea workbook.xml"""
        workbook = ET.Element('workbook', 
            xmlns='http://schemas.openxmlformats.org/spreadsheetml/2006/main',
            xmlns_r='http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        
        ET.SubElement(workbook, 'fileVersion', appName="xl", lastEdited="7")
        ET.SubElement(workbook, 'workbookPr', defaultThemeVersion="166925")
        
        book_views = ET.SubElement(workbook, 'bookViews')
        ET.SubElement(book_views, 'workbookView', xWindow="0", yWindow="0", windowWidth="28800", windowHeight="17895")
        
        sheets = ET.SubElement(workbook, 'sheets')
        ET.SubElement(sheets, 'sheet', name="Recetas", sheetId="1", r_id="rId1")
        ET.SubElement(sheets, 'sheet', name="Ingredientes", sheetId="2", r_id="rId2")
        ET.SubElement(sheets, 'sheet', name="Categorías", sheetId="3", r_id="rId3")
        
        XLSEngine._write_xml(filepath, workbook)
    
    @staticmethod
    def _create_styles(filepath):
        """Crea styles.xml con formato básico"""
        styles = ET.Element('styleSheet',
            xmlns='http://schemas.openxmlformats.org/spreadsheetml/2006/main')
        
        # Bordes
        borders = ET.SubElement(styles, 'borders', count="1")
        border = ET.SubElement(borders, 'border')
        ET.SubElement(border, 'left')
        ET.SubElement(border, 'right')
        ET.SubElement(border, 'top')
        ET.SubElement(border, 'bottom', style="thin")
        ET.SubElement(border, 'diagonal')
        
        # Fondos
        fills = ET.SubElement(styles, 'fills', count="2")
        ET.SubElement(fills, 'fill').append(ET.Element('patternFill', patternType="none"))
        fill2 = ET.SubElement(fills, 'fill')
        ET.SubElement(fill2, 'patternFill', patternType="gray125")
        
        # Fuentes
        fonts = ET.SubElement(styles, 'fonts', count="2")
        font1 = ET.SubElement(fonts, 'font')
        ET.SubElement(font1, 'sz', val="11")
        ET.SubElement(font1, 'color', theme="1")
        ET.SubElement(font1, 'name', val="Calibri")
        ET.SubElement(font1, 'family', val="2")
        ET.SubElement(font1, 'scheme', val="minor")
        
        font2 = ET.SubElement(fonts, 'font')
        ET.SubElement(font2, 'b')
        ET.SubElement(font2, 'sz', val="11")
        ET.SubElement(font2, 'color', theme="1")
        ET.SubElement(font2, 'name', val="Calibri")
        ET.SubElement(font2, 'family', val="2")
        ET.SubElement(font2, 'scheme', val="minor")
        
        # Estilos de celda
        cell_style_xfs = ET.SubElement(styles, 'cellStyleXfs', count="1")
        xf1 = ET.SubElement(cell_style_xfs, 'xf', numFmtId="0", fontId="0", fillId="0", borderId="0")
        
        cell_xfs = ET.SubElement(styles, 'cellXfs', count="2")
        xf2 = ET.SubElement(cell_xfs, 'xf', numFmtId="0", fontId="0", fillId="0", borderId="0", xfId="0")
        xf3 = ET.SubElement(cell_xfs, 'xf', numFmtId="0", fontId="1", fillId="0", borderId="0", xfId="0", applyFont="1")
        
        XLSEngine._write_xml(filepath, styles)
    
    @staticmethod
    def _create_theme(filepath):
        """Crea archivo de tema"""
        theme = ET.Element('a:theme', 
            xmlns_a='http://schemas.openxmlformats.org/drawingml/2006/main',
            name='Office Theme')
        
        XLSEngine._write_xml(filepath, theme)
    
    @staticmethod
    def _create_root_rels(filepath):
        """Crea relaciones raíz"""
        rels = ET.Element('Relationships',
            xmlns='http://schemas.openxmlformats.org/package/2006/relationships')
        
        ET.SubElement(rels, 'Relationship', 
            Id='rId1',
            Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument',
            Target='xl/workbook.xml')
        
        XLSEngine._write_xml(filepath, rels)
    
    @staticmethod
    def _create_xl_rels(filepath):
        """Crea relaciones del workbook"""
        rels = ET.Element('Relationships',
            xmlns='http://schemas.openxmlformats.org/package/2006/relationships')
        
        ET.SubElement(rels, 'Relationship',
            Id='rId1',
            Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet',
            Target='worksheets/sheet1.xml')
        
        ET.SubElement(rels, 'Relationship',
            Id='rId2',
            Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet',
            Target='worksheets/sheet2.xml')
        
        ET.SubElement(rels, 'Relationship',
            Id='rId3',
            Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet',
            Target='worksheets/sheet3.xml')
        
        ET.SubElement(rels, 'Relationship',
            Id='rId4',
            Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles',
            Target='styles.xml')
        
        ET.SubElement(rels, 'Relationship',
            Id='rId5',
            Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme',
            Target='theme/theme1.xml')
        
        XLSEngine._write_xml(filepath, rels)
    
    @staticmethod
    def _create_content_types(filepath):
        """Crea [Content_Types].xml"""
        types = ET.Element('Types',
            xmlns='http://schemas.openxmlformats.org/package/2006/content-types')
        
        ET.SubElement(types, 'Default', Extension='xml', ContentType='application/xml')
        ET.SubElement(types, 'Default', Extension='rels', ContentType='application/vnd.openxmlformats-package.relationships+xml')
        ET.SubElement(types, 'Override', PartName='/xl/workbook.xml', ContentType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml')
        ET.SubElement(types, 'Override', PartName='/xl/worksheets/sheet1.xml', ContentType='application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml')
        ET.SubElement(types, 'Override', PartName='/xl/styles.xml', ContentType='application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml')
        
        XLSEngine._write_xml(filepath, types)
    
    @staticmethod
    def _write_xml(filepath, element):
        """Escribe XML formateado a archivo"""
        xml_str = ET.tostring(element, encoding='utf-8')
        parsed = minidom.parseString(xml_str)
        pretty_xml = parsed.toprettyxml(indent="  ")
        
        # Eliminar líneas vacías
        lines = [line for line in pretty_xml.split('\n') if line.strip()]
        pretty_xml = '\n'.join(lines)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(pretty_xml)
    
    @staticmethod
    def _zip_to_xlsx(temp_dir, output_path):
        """Comprime directorio temporal a archivo .xlsx"""
        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(temp_dir)
                    zipf.write(file_path, arcname)

def export_recipes_to_excel(recipes, output_path="exports/recetas.xlsx"):
    """Función helper para exportar recetas a Excel"""
    return XLSEngine.export_recipes(recipes, output_path)

def export_recipes_to_csv(recipes, output_path="exports/recetas.csv"):
    """Función helper para exportar recetas a CSV"""
    return CSVEngine.export_recipes(recipes, output_path)