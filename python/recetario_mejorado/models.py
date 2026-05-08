#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Modelos de Datos - Estructuras de objetos principales
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from datetime import datetime

@dataclass
class Ingredient:
    """Modelo de Ingrediente"""
    id: Optional[int] = None
    name: str = ""
    type: str = "otro"  # vegetal, lácteo, carne, especia, cereal, condimento, hierba
    default_unit: str = "g"  # g, ml, unidad, taza, cucharada, cucharadita
    quantity: float = 0.0
    unit: str = "g"
    notes: str = ""
    is_allergen: bool = False
    allergen_type: Optional[str] = None  # gluten, lactosa, huevo, frutos_secos, marisco, etc.
    position: int = 0
    
    def get_display_name(self):
        """Devuelve nombre para mostrar con cantidad"""
        qty_str = f"{self.quantity:g}" if self.quantity % 1 != 0 else str(int(self.quantity))
        return f"{qty_str} {self.unit} {self.name}" + (f" ({self.notes})" if self.notes else "")

@dataclass
class Category:
    """Modelo de Categoría"""
    id: Optional[int] = None
    name: str = ""
    color: str = "#8B4513"
    is_system: bool = False
    
    def __str__(self):
        return self.name

@dataclass
class Tag:
    """Modelo de Etiqueta/Tag"""
    id: Optional[int] = None
    name: str = ""
    color: str = "#6C757D"
    
    def __str__(self):
        return self.name

@dataclass
class CustomRating:
    """Modelo de Criterio de Rating Personalizado"""
    id: Optional[int] = None
    name: str = ""
    description: str = ""
    scale_min: int = 1
    scale_max: int = 10
    value: Optional[int] = None
    is_active: bool = True

@dataclass
class Recipe:
    """Modelo de Receta - Principal"""
    id: Optional[int] = None
    title: str = ""
    description: str = ""
    instructions: str = ""
    prep_time: int = 0  # minutos
    cook_time: int = 0  # minutos
    servings: int = 4
    difficulty: str = "intermedio"  # principiante, intermedio, experto
    origin: str = ""  # país o región
    rating_taste: Optional[int] = None  # 1-10
    rating_ease: Optional[int] = None  # 1-10
    rating_cost: Optional[int] = None  # 1-10 (1=barato, 10=caro)
    is_favorite: bool = False
    image_path: str = ""
    nutrition_kcal: Optional[float] = None
    nutrition_protein: Optional[float] = None
    nutrition_carbs: Optional[float] = None
    nutrition_fat: Optional[float] = None
    version_notes: str = ""
    base_recipe_id: Optional[int] = None
    created_at: str = ""
    updated_at: str = ""
    
    # Relaciones
    ingredients: List[Ingredient] = field(default_factory=list)
    categories: List[Category] = field(default_factory=list)
    tags: List[Tag] = field(default_factory=list)
    custom_ratings: List[CustomRating] = field(default_factory=list)
    
    def get_total_time(self):
        """Devuelve tiempo total en minutos"""
        return self.prep_time + self.cook_time
    
    def get_display_time(self):
        """Devuelve tiempo formateado para mostrar"""
        total = self.get_total_time()
        if total == 0:
            return "Sin tiempo"
        elif total < 60:
            return f"{total} min"
        else:
            hours = total // 60
            mins = total % 60
            if mins == 0:
                return f"{hours}h"
            return f"{hours}h {mins}min"
    
    def get_difficulty_display(self):
        """Devuelve dificultad traducida"""
        diff_map = {
            'principiante': '👶 Principiante',
            'intermedio': '👨‍🍳 Intermedio',
            'experto': '👨‍🍳👨‍🍳 Experto'
        }
        return diff_map.get(self.difficulty, self.difficulty.capitalize())
    
    def get_nutrition_per_serving(self):
        """Devuelve nutrición por ración"""
        if not self.servings or self.servings == 0:
            return {}
        
        return {
            'kcal': round(self.nutrition_kcal / self.servings, 1) if self.nutrition_kcal else None,
            'protein': round(self.nutrition_protein / self.servings, 1) if self.nutrition_protein else None,
            'carbs': round(self.nutrition_carbs / self.servings, 1) if self.nutrition_carbs else None,
            'fat': round(self.nutrition_fat / self.servings, 1) if self.nutrition_fat else None
        }
    
    def has_allergens(self):
        """Devuelve True si la receta tiene alergénos"""
        return any(ing.is_allergen for ing in self.ingredients)
    
    def get_allergens_list(self):
        """Devuelve lista de tipos de alergénos"""
        allergens = set()
        for ing in self.ingredients:
            if ing.is_allergen and ing.allergen_type:
                allergens.add(ing.allergen_type)
        return list(allergens)
    
    def get_average_rating(self):
        """Calcula rating promedio de los ratings tradicionales"""
        ratings = [r for r in [self.rating_taste, self.rating_ease, self.rating_cost] if r is not None]
        if not ratings:
            return None
        return sum(ratings) / len(ratings)

@dataclass
class CookingHistory:
    """Modelo de Historial de Cocinado"""
    id: Optional[int] = None
    recipe_id: int = 0
    cooked_at: str = ""
    servings_made: Optional[int] = None
    notes: str = ""
    rating_taste: Optional[int] = None
    rating_ease: Optional[int] = None

@dataclass
class WeeklyPlan:
    """Modelo de Plan Semanal"""
    id: Optional[int] = None
    recipe_id: int = 0
    planned_date: str = ""
    servings_planned: int = 1
    meal_type: str = "cena"  # desayuno, almuerzo, cena, merienda
    notes: str = ""
    recipe_title: str = ""
    recipe_image: str = ""