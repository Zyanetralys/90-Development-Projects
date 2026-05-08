#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Motor de Base de Datos SQLite - 100% offline
Gestión completa de recetas, ingredientes, categorías, tags y más
"""

import sqlite3
import json
from pathlib import Path
from datetime import datetime
import shutil
import os

class Database:
    def __init__(self, db_path="cocinando_con_papi.db"):
        self.db_path = db_path
        self.init_database()
        self.create_backup_if_needed()
    
    def get_connection(self):
        """Obtiene conexión a la base de datos"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Inicializa la base de datos con todas las tablas"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Activar claves foráneas
        cursor.execute('PRAGMA foreign_keys = ON')
        
        # Tabla recipes (ampliada)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                instructions TEXT NOT NULL,
                prep_time INTEGER,
                cook_time INTEGER,
                servings INTEGER DEFAULT 4,
                difficulty TEXT CHECK(difficulty IN ('principiante', 'intermedio', 'experto')),
                origin TEXT,
                rating_taste INTEGER CHECK(rating_taste BETWEEN 1 AND 10),
                rating_ease INTEGER CHECK(rating_ease BETWEEN 1 AND 10),
                rating_cost INTEGER CHECK(rating_cost BETWEEN 1 AND 10),
                is_favorite BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                image_path TEXT,
                nutrition_kcal REAL,
                nutrition_protein REAL,
                nutrition_carbs REAL,
                nutrition_fat REAL,
                version_notes TEXT,
                base_recipe_id INTEGER,
                FOREIGN KEY(base_recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
            )
        ''')
        
        # Tabla custom_rating_criteria
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS custom_rating_criteria (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                description TEXT,
                scale_min INTEGER DEFAULT 1,
                scale_max INTEGER DEFAULT 10,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla recipe_custom_ratings
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipe_custom_ratings (
                recipe_id INTEGER NOT NULL,
                criterion_id INTEGER NOT NULL,
                value INTEGER NOT NULL,
                FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
                FOREIGN KEY(criterion_id) REFERENCES custom_rating_criteria(id) ON DELETE CASCADE,
                PRIMARY KEY (recipe_id, criterion_id)
            )
        ''')
        
        # Tabla categories
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                color TEXT DEFAULT '#8B4513',
                is_system BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla ingredients
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                type TEXT DEFAULT 'otro',
                default_unit TEXT,
                is_allergen BOOLEAN DEFAULT 0,
                allergen_type TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla tags
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                color TEXT DEFAULT '#6C757D',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tablas relación
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipe_categories (
                recipe_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                PRIMARY KEY (recipe_id, category_id),
                FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
                FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipe_ingredients (
                recipe_id INTEGER NOT NULL,
                ingredient_id INTEGER NOT NULL,
                quantity REAL NOT NULL,
                unit TEXT NOT NULL,
                notes TEXT,
                position INTEGER DEFAULT 0,
                FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
                FOREIGN KEY(ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
                PRIMARY KEY (recipe_id, ingredient_id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipe_tags (
                recipe_id INTEGER NOT NULL,
                tag_id INTEGER NOT NULL,
                PRIMARY KEY (recipe_id, tag_id),
                FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
                FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
        ''')
        
        # Tabla cooking_history
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cooking_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recipe_id INTEGER NOT NULL,
                cooked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                servings_made INTEGER,
                notes TEXT,
                rating_taste INTEGER CHECK(rating_taste BETWEEN 1 AND 10),
                rating_ease INTEGER CHECK(rating_ease BETWEEN 1 AND 10),
                FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            )
        ''')
        
        # Tabla weekly_plan
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weekly_plan (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recipe_id INTEGER NOT NULL,
                planned_date DATE NOT NULL,
                servings_planned INTEGER DEFAULT 1,
                meal_type TEXT CHECK(meal_type IN ('desayuno', 'almuerzo', 'cena', 'merienda')),
                notes TEXT,
                FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            )
        ''')
        
        # Índices para rendimiento
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_recipe_title ON recipes(title)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_recipe_favorite ON recipes(is_favorite)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_recipe_updated ON recipes(updated_at)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_ingredient_name ON ingredients(name)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_cooking_history ON cooking_history(recipe_id, cooked_at)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_weekly_plan_date ON weekly_plan(planned_date)')
        
        # Insertar categorías predefinidas SI NO EXISTEN
        default_categories = [
            ("Comida Hindú", "#E63946", 1),
            ("Comida China", "#F77F00", 1),
            ("Comida Latinoamericana", "#06AED5", 1),
            ("Comida Española", "#8B4513", 1),
            ("Comida Americana", "#003049", 1),
            ("Comida Europea", "#2E5D4F", 1),
            ("Postres", "#D4A798", 1),
            ("Vegetariano/Vegano", "#4A7C59", 1),
            ("Rápido (<30min)", "#B85C38", 1),
            ("Para niños", "#FFB703", 1),
            ("Sin gluten", "#8338EC", 1),
            ("Sin lactosa", "#FB5607", 1),
        ]
        
        for name, color, is_system in default_categories:
            cursor.execute(
                "INSERT OR IGNORE INTO categories (name, color, is_system) VALUES (?, ?, ?)",
                (name, color, is_system)
            )
        
        # Insertar criterios de rating predefinidos
        default_criteria = [
            ("Sabor", "Escala de 1 a 10 según el gusto personal", 1, 10),
            ("Facilidad", "Escala de 1 (muy difícil) a 10 (muy fácil)", 1, 10),
            ("Coste", "Escala de 1 (muy barato) a 10 (muy caro)", 1, 10),
        ]
        
        for name, desc, min_s, max_s in default_criteria:
            cursor.execute(
                "INSERT OR IGNORE INTO custom_rating_criteria (name, description, scale_min, scale_max, is_active) VALUES (?, ?, ?, ?, 1)",
                (name, desc, min_s, max_s)
            )
        
        # Insertar ingredientes comunes básicos
        common_ingredients = [
            ("Tomate", "vegetal", "unidad", 0, None),
            ("Cebolla", "vegetal", "unidad", 0, None),
            ("Ajo", "vegetal", "diente", 0, None),
            ("Aceite de oliva", "condimento", "ml", 0, None),
            ("Sal", "condimento", "g", 0, None),
            ("Pimienta", "condimento", "g", 0, None),
            ("Arroz", "cereal", "g", 1, "gluten"),
            ("Pollo", "carne", "g", 0, None),
            ("Huevo", "lácteo", "unidad", 1, "huevo"),
            ("Leche", "lácteo", "ml", 1, "lactosa"),
            ("Azúcar", "condimento", "g", 0, None),
            ("Harina", "cereal", "g", 1, "gluten"),
            ("Mantequilla", "lácteo", "g", 1, "lactosa"),
            ("Queso", "lácteo", "g", 1, "lactosa"),
            ("Pimiento", "vegetal", "unidad", 0, None),
            ("Zanahoria", "vegetal", "unidad", 0, None),
            ("Patata", "vegetal", "unidad", 0, None),
            ("Cilantro", "hierba", "g", 0, None),
            ("Comino", "especia", "g", 0, None),
            ("Canela", "especia", "g", 0, None),
        ]
        
        for name, type_, unit, allergen, allergen_type in common_ingredients:
            cursor.execute(
                "INSERT OR IGNORE INTO ingredients (name, type, default_unit, is_allergen, allergen_type) VALUES (?, ?, ?, ?, ?)",
                (name, type_, unit, allergen, allergen_type)
            )
        
        conn.commit()
        conn.close()
    
    def create_backup_if_needed(self):
        """Crea backup automático si no existe hoy"""
        today = datetime.now().strftime("%Y%m%d")
        backup_path = Path(f"backups/backup_{today}.db")
        
        # Solo crear backup si no existe hoy
        if not backup_path.exists():
            try:
                shutil.copy2(self.db_path, backup_path)
                
                # Mantener solo últimos 7 backups
                backups = sorted(
                    Path("backups").glob("backup_*.db"), 
                    key=os.path.getmtime, 
                    reverse=True
                )
                for old_backup in backups[7:]:
                    old_backup.unlink(missing_ok=True)
                
                # Actualizar configuración
                config_file = Path('config.json')
                if config_file.exists():
                    with open(config_file, 'r', encoding='utf-8') as f:
                        config = json.load(f)
                    config['last_backup'] = datetime.now().isoformat()
                    with open(config_file, 'w', encoding='utf-8') as f:
                        json.dump(config, f, indent=2)
            except Exception as e:
                print(f"Error creando backup: {e}")
    
    # ===== RECETAS =====
    def add_recipe(self, recipe_data, categories=None, ingredients=None, tags=None, custom_ratings=None):
        """Añade una nueva receta a la base de datos"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO recipes 
            (title, description, instructions, prep_time, cook_time, servings, difficulty, origin,
             rating_taste, rating_ease, rating_cost, is_favorite, image_path,
             nutrition_kcal, nutrition_protein, nutrition_carbs, nutrition_fat,
             version_notes, base_recipe_id, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (
            recipe_data.get('title', ''),
            recipe_data.get('description', ''),
            recipe_data.get('instructions', ''),
            recipe_data.get('prep_time', 0),
            recipe_data.get('cook_time', 0),
            recipe_data.get('servings', 4),
            recipe_data.get('difficulty', 'intermedio'),
            recipe_data.get('origin', ''),
            recipe_data.get('rating_taste'),
            recipe_data.get('rating_ease'),
            recipe_data.get('rating_cost'),
            recipe_data.get('is_favorite', 0),
            recipe_data.get('image_path', ''),
            recipe_data.get('nutrition_kcal'),
            recipe_data.get('nutrition_protein'),
            recipe_data.get('nutrition_carbs'),
            recipe_data.get('nutrition_fat'),
            recipe_data.get('version_notes', ''),
            recipe_data.get('base_recipe_id')
        ))
        
        recipe_id = cursor.lastrowid
        
        # Guardar relaciones
        self._save_relations(cursor, recipe_id, categories, ingredients, tags)
        
        # Guardar ratings personalizados
        if custom_ratings:
            for crit_id, value in custom_ratings.items():
                if value is not None and value != '':
                    try:
                        cursor.execute('''
                            INSERT OR REPLACE INTO recipe_custom_ratings 
                            (recipe_id, criterion_id, value) VALUES (?, ?, ?)
                        ''', (recipe_id, crit_id, int(value)))
                    except ValueError:
                        pass  # Ignorar valores no numéricos
        
        conn.commit()
        conn.close()
        return recipe_id
    
    def _save_relations(self, cursor, recipe_id, categories, ingredients, tags):
        """Guarda las relaciones de una receta"""
        # Categorías
        if categories:
            cursor.execute("DELETE FROM recipe_categories WHERE recipe_id = ?", (recipe_id,))
            for cat_id in categories:
                cursor.execute(
                    "INSERT OR IGNORE INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)",
                    (recipe_id, cat_id)
                )
        
        # Ingredientes
        if ingredients:
            cursor.execute("DELETE FROM recipe_ingredients WHERE recipe_id = ?", (recipe_id,))
            for i, ing in enumerate(ingredients):
                # Crear ingrediente si no existe
                cursor.execute(
                    "INSERT OR IGNORE INTO ingredients (name, type, default_unit, is_allergen, allergen_type) VALUES (?, ?, ?, ?, ?)",
                    (ing['name'], ing.get('type', 'otro'), ing.get('default_unit', 'g'), 
                     ing.get('is_allergen', 0), ing.get('allergen_type'))
                )
                cursor.execute("SELECT id FROM ingredients WHERE name = ?", (ing['name'],))
                ing_id = cursor.fetchone()[0]
                
                cursor.execute('''
                    INSERT INTO recipe_ingredients 
                    (recipe_id, ingredient_id, quantity, unit, notes, position) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    recipe_id, ing_id, 
                    float(ing['quantity']) if ing['quantity'] else 0,
                    ing['unit'],
                    ing.get('notes', ''),
                    i
                ))
        
        # Tags
        if tags:
            cursor.execute("DELETE FROM recipe_tags WHERE recipe_id = ?", (recipe_id,))
            for tag_id in tags:
                cursor.execute(
                    "INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
                    (recipe_id, tag_id)
                )
    
    def update_recipe(self, recipe_id, recipe_data, categories=None, ingredients=None, tags=None, custom_ratings=None):
        """Actualiza una receta existente"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE recipes SET
                title = ?, description = ?, instructions = ?, prep_time = ?, cook_time = ?,
                servings = ?, difficulty = ?, origin = ?, rating_taste = ?, rating_ease = ?,
                rating_cost = ?, is_favorite = ?, image_path = ?, nutrition_kcal = ?,
                nutrition_protein = ?, nutrition_carbs = ?, nutrition_fat = ?,
                version_notes = ?, base_recipe_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            recipe_data.get('title', ''),
            recipe_data.get('description', ''),
            recipe_data.get('instructions', ''),
            recipe_data.get('prep_time', 0),
            recipe_data.get('cook_time', 0),
            recipe_data.get('servings', 4),
            recipe_data.get('difficulty', 'intermedio'),
            recipe_data.get('origin', ''),
            recipe_data.get('rating_taste'),
            recipe_data.get('rating_ease'),
            recipe_data.get('rating_cost'),
            recipe_data.get('is_favorite', 0),
            recipe_data.get('image_path', ''),
            recipe_data.get('nutrition_kcal'),
            recipe_data.get('nutrition_protein'),
            recipe_data.get('nutrition_carbs'),
            recipe_data.get('nutrition_fat'),
            recipe_data.get('version_notes', ''),
            recipe_data.get('base_recipe_id'),
            recipe_id
        ))
        
        # Guardar relaciones
        self._save_relations(cursor, recipe_id, categories, ingredients, tags)
        
        # Guardar ratings personalizados
        if custom_ratings:
            cursor.execute("DELETE FROM recipe_custom_ratings WHERE recipe_id = ?", (recipe_id,))
            for crit_id, value in custom_ratings.items():
                if value is not None and value != '':
                    try:
                        cursor.execute('''
                            INSERT INTO recipe_custom_ratings 
                            (recipe_id, criterion_id, value) VALUES (?, ?, ?)
                        ''', (recipe_id, crit_id, int(value)))
                    except ValueError:
                        pass
        
        conn.commit()
        conn.close()
    
    def get_all_recipes(self, order_by='updated_at DESC', filters=None):
        """Obtiene todas las recetas con filtros y ordenación"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        base_query = '''
            SELECT r.*, 
                   GROUP_CONCAT(DISTINCT c.name) as categories,
                   GROUP_CONCAT(DISTINCT c.color) as category_colors,
                   GROUP_CONCAT(DISTINCT i.name || ':' || ri.quantity || ':' || ri.unit) as ingredients_list,
                   GROUP_CONCAT(DISTINCT t.name) as tags_list
            FROM recipes r
            LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
            LEFT JOIN categories c ON rc.category_id = c.id
            LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            LEFT JOIN ingredients i ON ri.ingredient_id = i.id
            LEFT JOIN recipe_tags rt ON r.id = rt.recipe_id
            LEFT JOIN tags t ON rt.tag_id = t.id
            WHERE 1=1
        '''
        params = []
        
        # Aplicar filtros
        if filters:
            if filters.get('search_text'):
                base_query += " AND (r.title LIKE ? OR r.description LIKE ? OR r.instructions LIKE ? OR r.origin LIKE ?)"
                q = f"%{filters['search_text']}%"
                params.extend([q, q, q, q])
            
            if filters.get('categories'):
                base_query += " AND c.id IN ({})".format(','.join('?' * len(filters['categories'])))
                params.extend(filters['categories'])
            
            if filters.get('min_rating_taste') is not None:
                base_query += " AND r.rating_taste >= ?"
                params.append(filters['min_rating_taste'])
            
            if filters.get('max_rating_taste') is not None:
                base_query += " AND r.rating_taste <= ?"
                params.append(filters['max_rating_taste'])
            
            if filters.get('min_rating_ease') is not None:
                base_query += " AND r.rating_ease >= ?"
                params.append(filters['min_rating_ease'])
            
            if filters.get('min_rating_cost') is not None:
                base_query += " AND r.rating_cost >= ?"
                params.append(filters['min_rating_cost'])
            
            if filters.get('favorites_only'):
                base_query += " AND r.is_favorite = 1"
            
            if filters.get('difficulty'):
                base_query += " AND r.difficulty = ?"
                params.append(filters['difficulty'])
            
            if filters.get('max_time'):
                base_query += " AND (r.prep_time + r.cook_time) <= ?"
                params.append(filters['max_time'])
            
            if filters.get('min_kcal') is not None:
                base_query += " AND r.nutrition_kcal >= ?"
                params.append(filters['min_kcal'])
            
            if filters.get('max_kcal') is not None:
                base_query += " AND r.nutrition_kcal <= ?"
                params.append(filters['max_kcal'])
            
            if filters.get('tags'):
                base_query += " AND t.id IN ({})".format(','.join('?' * len(filters['tags'])))
                params.extend(filters['tags'])
            
            if filters.get('ingredients_any'):
                # Recetas que contienen AL MENOS UNO de los ingredientes
                base_query += " AND i.id IN ({})".format(','.join('?' * len(filters['ingredients_any'])))
                params.extend(filters['ingredients_any'])
            
            if filters.get('ingredients_all'):
                # Recetas que contienen TODOS los ingredientes especificados
                for ing_id in filters['ingredients_all']:
                    base_query += '''
                        AND r.id IN (
                            SELECT recipe_id FROM recipe_ingredients WHERE ingredient_id = ?
                        )
                    '''
                    params.append(ing_id)
        
        base_query += f" GROUP BY r.id ORDER BY {order_by}"
        
        cursor.execute(base_query, params)
        results = cursor.fetchall()
        conn.close()
        return [dict(row) for row in results]
    
    def get_recipe_by_id(self, recipe_id):
        """Obtiene una receta por ID con todos sus detalles"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Obtener receta
        cursor.execute('''
            SELECT r.*,
                   (SELECT GROUP_CONCAT(category_id) FROM recipe_categories WHERE recipe_id = r.id) as category_ids,
                   (SELECT GROUP_CONCAT(ingredient_id || ':' || quantity || ':' || unit || ':' || notes) 
                    FROM recipe_ingredients WHERE recipe_id = r.id) as ingredient_details,
                   (SELECT GROUP_CONCAT(tag_id) FROM recipe_tags WHERE recipe_id = r.id) as tag_ids
            FROM recipes r WHERE r.id = ?
        ''', (recipe_id,))
        
        recipe = cursor.fetchone()
        if not recipe:
            conn.close()
            return None
        
        # Obtener ingredientes detallados
        cursor.execute('''
            SELECT i.id, i.name, i.type, i.default_unit, i.is_allergen, i.allergen_type,
                   ri.quantity, ri.unit, ri.notes, ri.position
            FROM recipe_ingredients ri
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?
            ORDER BY ri.position
        ''', (recipe_id,))
        ingredients = cursor.fetchall()
        
        # Obtener categorías detalladas
        cursor.execute('''
            SELECT c.id, c.name, c.color, c.is_system
            FROM recipe_categories rc
            JOIN categories c ON rc.category_id = c.id
            WHERE rc.recipe_id = ?
        ''', (recipe_id,))
        categories = cursor.fetchall()
        
        # Obtener tags detallados
        cursor.execute('''
            SELECT t.id, t.name, t.color
            FROM recipe_tags rt
            JOIN tags t ON rt.tag_id = t.id
            WHERE rt.recipe_id = ?
        ''', (recipe_id,))
        tags = cursor.fetchall()
        
        # Obtener ratings personalizados
        cursor.execute('''
            SELECT c.id, c.name, c.description, c.scale_min, c.scale_max, rcr.value
            FROM custom_rating_criteria c
            LEFT JOIN recipe_custom_ratings rcr ON c.id = rcr.criterion_id AND rcr.recipe_id = ?
            WHERE c.is_active = 1
        ''', (recipe_id,))
        custom_ratings = cursor.fetchall()
        
        conn.close()
        
        return {
            'recipe': dict(recipe),
            'ingredients': [dict(ing) for ing in ingredients],
            'categories': [dict(cat) for cat in categories],
            'tags': [dict(tag) for tag in tags],
            'custom_ratings': [dict(cr) for cr in custom_ratings]
        }
    
    def delete_recipe(self, recipe_id):
        """Elimina una receta (CASCADE elimina relaciones automáticamente)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
        conn.commit()
        conn.close()
    
    def toggle_favorite(self, recipe_id):
        """Alterna el estado de favorito de una receta"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE recipes SET is_favorite = NOT is_favorite WHERE id = ?
        ''', (recipe_id,))
        conn.commit()
        conn.close()
    
    # ===== CATEGORÍAS =====
    def get_all_categories(self):
        """Obtiene todas las categorías"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories ORDER BY is_system DESC, name")
        cats = cursor.fetchall()
        conn.close()
        return [dict(cat) for cat in cats]
    
    def add_category(self, name, color="#8B4513", is_system=0):
        """Añade una nueva categoría"""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO categories (name, color, is_system) VALUES (?, ?, ?)",
                (name, color, is_system)
            )
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            conn.close()
            return None
        finally:
            conn.close()
    
    def delete_category(self, category_id):
        """Elimina una categoría (no las del sistema)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Verificar que no sea categoría del sistema
        cursor.execute("SELECT is_system FROM categories WHERE id = ?", (category_id,))
        result = cursor.fetchone()
        if result and result['is_system'] == 1:
            conn.close()
            return False
        
        cursor.execute("DELETE FROM categories WHERE id = ?", (category_id,))
        conn.commit()
        conn.close()
        return True
    
    # ===== INGREDIENTES =====
    def search_ingredients(self, query):
        """Busca ingredientes por nombre"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, type, default_unit, is_allergen, allergen_type FROM ingredients WHERE name LIKE ? ORDER BY name LIMIT 15",
            (f"%{query}%",)
        )
        results = cursor.fetchall()
        conn.close()
        return [dict(row) for row in results]
    
    def get_all_ingredients(self):
        """Obtiene todos los ingredientes"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, type, default_unit, is_allergen, allergen_type FROM ingredients ORDER BY name")
        results = cursor.fetchall()
        conn.close()
        return [dict(row) for row in results]
    
    def add_ingredient(self, name, type="otro", default_unit="g", is_allergen=0, allergen_type=None):
        """Añade un nuevo ingrediente"""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO ingredients (name, type, default_unit, is_allergen, allergen_type) VALUES (?, ?, ?, ?, ?)",
                (name, type, default_unit, is_allergen, allergen_type)
            )
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            conn.close()
            return None
        finally:
            conn.close()
    
    # ===== TAGS =====
    def get_all_tags(self):
        """Obtiene todos los tags"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tags ORDER BY name")
        tags = cursor.fetchall()
        conn.close()
        return [dict(tag) for tag in tags]
    
    def add_tag(self, name, color="#6C757D"):
        """Añade un nuevo tag"""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO tags (name, color) VALUES (?, ?)", (name, color))
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            conn.close()
            return None
        finally:
            conn.close()
    
    # ===== RATING CRITERIA =====
    def get_all_rating_criteria(self):
        """Obtiene todos los criterios de rating"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM custom_rating_criteria WHERE is_active = 1 ORDER BY created_at")
        criteria = cursor.fetchall()
        conn.close()
        return [dict(crit) for crit in criteria]
    
    def add_rating_criterion(self, name, description="", scale_min=1, scale_max=10):
        """Añade un nuevo criterio de rating"""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO custom_rating_criteria (name, description, scale_min, scale_max) VALUES (?, ?, ?, ?)",
                (name, description, scale_min, scale_max)
            )
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            conn.close()
            return None
        finally:
            conn.close()
    
    def delete_rating_criterion(self, criterion_id):
        """Elimina un criterio de rating (soft delete)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE custom_rating_criteria SET is_active = 0 WHERE id = ?", (criterion_id,))
        conn.commit()
        conn.close()
    
    # ===== COOKING HISTORY =====
    def add_cooking_record(self, recipe_id, servings_made=None, notes="", rating_taste=None, rating_ease=None):
        """Añade un registro al historial de cocinado"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO cooking_history (recipe_id, servings_made, notes, rating_taste, rating_ease) VALUES (?, ?, ?, ?, ?)",
            (recipe_id, servings_made, notes, rating_taste, rating_ease)
        )
        conn.commit()
        conn.close()
    
    def get_cooking_history(self, recipe_id, limit=10):
        """Obtiene el historial de cocinado de una receta"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM cooking_history WHERE recipe_id = ? ORDER BY cooked_at DESC LIMIT ?",
            (recipe_id, limit)
        )
        history = cursor.fetchall()
        conn.close()
        return [dict(h) for h in history]
    
    # ===== WEEKLY PLAN =====
    def add_to_weekly_plan(self, recipe_id, planned_date, servings_planned=1, meal_type="cena", notes=""):
        """Añade una receta al planificador semanal"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO weekly_plan (recipe_id, planned_date, servings_planned, meal_type, notes) VALUES (?, ?, ?, ?, ?)",
            (recipe_id, planned_date, servings_planned, meal_type, notes)
        )
        conn.commit()
        conn.close()
    
    def get_weekly_plan(self, start_date, end_date):
        """Obtiene el plan semanal entre dos fechas"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT wp.*, r.title, r.image_path 
               FROM weekly_plan wp
               JOIN recipes r ON wp.recipe_id = r.id
               WHERE wp.planned_date BETWEEN ? AND ?
               ORDER BY wp.planned_date, wp.meal_type""",
            (start_date, end_date)
        )
        plan = cursor.fetchall()
        conn.close()
        return [dict(p) for p in plan]
    
    # ===== ESTADÍSTICAS =====
    def get_stats(self):
        """Obtiene estadísticas generales"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as total FROM recipes")
        total = cursor.fetchone()['total']
        
        cursor.execute("SELECT COUNT(*) as favorites FROM recipes WHERE is_favorite = 1")
        favorites = cursor.fetchone()['favorites']
        
        cursor.execute("SELECT AVG(rating_taste) as avg_taste FROM recipes WHERE rating_taste IS NOT NULL")
        avg_taste = cursor.fetchone()['avg_taste'] or 0
        
        cursor.execute("SELECT COUNT(*) as categories FROM categories")
        categories = cursor.fetchone()['categories']
        
        cursor.execute("SELECT COUNT(*) as ingredients FROM ingredients")
        ingredients = cursor.fetchone()['ingredients']
        
        cursor.execute("SELECT COUNT(*) as cooked FROM cooking_history")
        cooked = cursor.fetchone()['cooked']
        
        conn.close()
        return {
            'total_recipes': total,
            'favorite_recipes': favorites,
            'average_taste': round(avg_taste, 1),
            'total_categories': categories,
            'total_ingredients': ingredients,
            'total_cooked': cooked
        }
    
    def get_most_cooked_recipes(self, limit=5):
        """Obtiene las recetas más cocinadas"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT r.id, r.title, r.image_path, COUNT(ch.id) as times_cooked
            FROM recipes r
            JOIN cooking_history ch ON r.id = ch.recipe_id
            GROUP BY r.id
            ORDER BY times_cooked DESC
            LIMIT ?
        ''', (limit,))
        results = cursor.fetchall()
        conn.close()
        return [dict(row) for row in results]