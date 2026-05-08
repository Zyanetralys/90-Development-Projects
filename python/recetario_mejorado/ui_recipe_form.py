#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Formulario para crear y editar recetas
Interfaz elegante con pestañas y validación avanzada
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox, simpledialog
import os
from pathlib import Path
from datetime import datetime

from utils import TimeFormatter, NutritionCalculator, StringUtils
from image_engine import ImageEngine

class RecipeFormDialog:
    def __init__(self, parent, db, recipe_id=None, main_window=None):
        self.parent = parent
        self.db = db
        self.recipe_id = recipe_id
        self.main_window = main_window
        self.saved = False
        
        self.window = tk.Toplevel(parent)
        self.window.title("📝 Nueva receta" if not recipe_id else "✏️ Editar receta")
        self.window.geometry("900x750")
        self.window.configure(bg="#FFFDFB")
        self.window.transient(parent)
        self.window.grab_set()
        
        # Datos actuales
        self.current_image = None
        self.current_image_path = None
        self.ingredients_list = []
        self.categories_list = []
        self.tags_list = []
        self.custom_ratings_values = {}
        
        # Cargar datos si es edición
        if recipe_id:
            recipe_data = db.get_recipe_by_id(recipe_id)
            if recipe_
                self.recipe_data = recipe_data['recipe']
                self.ingredients_list = recipe_data['ingredients']
                self.categories_list = recipe_data['categories']
                self.tags_list = recipe_data['tags']
                self.custom_ratings = recipe_data['custom_ratings']
                self.current_image_path = self.recipe_data['image_path']
            else:
                self.recipe_data = {}
                self.custom_ratings = []
        else:
            self.recipe_data = {}
            self.custom_ratings = self.db.get_all_rating_criteria()
        
        self.create_ui()
        if recipe_id:
            self.load_existing_data()
    
    def create_ui(self):
        """Crea interfaz del formulario"""
        # Canvas con scroll para formulario largo
        canvas = tk.Canvas(self.window, bg="#FFFDFB", highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.window, orient='vertical', command=canvas.yview)
        scroll_frame = ttk.Frame(canvas, style='TFrame')
        
        scroll_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scroll_frame, anchor='nw')
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side='left', fill='both', expand=True, padx=25, pady=25)
        scrollbar.pack(side='right', fill='y')
        
        # Título formulario
        title = "📝 Nueva receta" if not self.recipe_id else f"✏️ Editar receta: {self.recipe_data.get('title', '')}"
        ttk.Label(
            scroll_frame,
            text=title,
            font=('Helvetica', 18, 'bold'),
            foreground="#8B4513",
            padding=(0, 0, 0, 20)
        ).pack(fill='x')
        
        # Notebook para pestañas
        notebook = ttk.Notebook(scroll_frame)
        notebook.pack(fill='both', expand=True)
        
        # Pestaña 1: Básico
        basic_frame = ttk.Frame(notebook, padding=20)
        notebook.add(basic_frame, text=" Básico ")
        
        self.create_basic_tab(basic_frame)
        
        # Pestaña 2: Ingredientes
        ing_frame = ttk.Frame(notebook, padding=20)
        notebook.add(ing_frame, text=" Ingredientes ")
        
        self.create_ingredients_tab(ing_frame)
        
        # Pestaña 3: Detalles
        details_frame = ttk.Frame(notebook, padding=20)
        notebook.add(details_frame, text=" Detalles ")
        
        self.create_details_tab(details_frame)
        
        # Pestaña 4: Nutrición
        nutrition_frame = ttk.Frame(notebook, padding=20)
        notebook.add(nutrition_frame, text=" Nutrición ")
        
        self.create_nutrition_tab(nutrition_frame)
        
        # Botones guardar/cancelar
        btn_frame = ttk.Frame(scroll_frame, padding=(0, 20, 0, 0))
        btn_frame.pack(fill='x')
        
        ttk.Button(btn_frame, text="Cancelar", 
                  command=self.window.destroy, width=12).pack(side='right', padx=5)
        
        ttk.Button(btn_frame, text="Guardar receta", 
                  command=self.save_recipe, style='TButton', width=15).pack(side='right', padx=5)
    
    def create_basic_tab(self, parent):
        """Crea pestaña de información básica"""
        # Foto
        photo_frame = ttk.LabelFrame(parent, text="Foto de la receta", padding=15)
        photo_frame.pack(fill='x', pady=(0, 20))
        
        self.photo_display = tk.Label(
            photo_frame,
            text="Arrastra una foto o haz clic aquí\n(Se optimizará automáticamente)",
            font=('Helvetica', 11),
            fg="#888888",
            bg="#F9F5F0",
            width=40,
            height=12,
            relief='solid',
            borderwidth=2,
            cursor='hand2'
        )
        self.photo_display.pack(padx=10, pady=10)
        self.photo_display.bind('<Button-1>', self.select_image)
        
        # Título
        title_frame = ttk.LabelFrame(parent, text="Título *", padding=10)
        title_frame.pack(fill='x', pady=(0, 15))
        
        self.title_var = tk.StringVar()
        title_entry = ttk.Entry(title_frame, textvariable=self.title_var, 
                              font=('Helvetica', 12), width=60)
        title_entry.pack(fill='x')
        title_entry.bind('<KeyRelease>', self.auto_capitalize_title)
        
        # Descripción
        desc_frame = ttk.LabelFrame(parent, text="Descripción breve", padding=10)
        desc_frame.pack(fill='x', pady=(0, 15))
        
        self.desc_var = tk.StringVar()
        ttk.Entry(desc_frame, textvariable=self.desc_var, 
                font=('Helvetica', 11), width=60).pack(fill='x')
        
        # Instrucciones
        instr_frame = ttk.LabelFrame(parent, text="Instrucciones *", padding=10)
        instr_frame.pack(fill='x', pady=(0, 15))
        
        self.instr_text = tk.Text(instr_frame, height=8, font=('Helvetica', 11), 
                                wrap='word', padx=10, pady=10)
        self.instr_text.pack(fill='x')
        
        # Origen
        origin_frame = ttk.LabelFrame(parent, text="Origen geográfico", padding=10)
        origin_frame.pack(fill='x', pady=(0, 15))
        
        origins = ["", "España", "México", "Italia", "China", "Japón", "India", "Tailandia", 
                  "Perú", "Argentina", "Francia", "Grecia", "Marruecos", "Otros"]
        self.origin_var = tk.StringVar()
        origin_combo = ttk.Combobox(origin_frame, textvariable=self.origin_var, 
                                  values=origins, state='readonly', width=30)
        origin_combo.pack(side='left')
        origin_combo.set("")
    
    def create_ingredients_tab(self, parent):
        """Crea pestaña de ingredientes"""
        # Búsqueda y añadir
        search_frame = ttk.Frame(parent)
        search_frame.pack(fill='x', pady=(0, 15))
        
        ttk.Label(search_frame, text="Buscar ingrediente:", 
                font=('Helvetica', 10, 'bold')).pack(side='left')
        
        self.ing_search_var = tk.StringVar()
        self.ing_search_var.trace('w', self.on_ingredient_search)
        search_entry = ttk.Entry(search_frame, textvariable=self.ing_search_var, 
                               font=('Helvetica', 11), width=30)
        search_entry.pack(side='left', padx=10)
        search_entry.bind('<Return>', self.add_ingredient_from_search)
        
        ttk.Button(search_frame, text="➕ Añadir", 
                  command=self.add_ingredient_from_search).pack(side='left')
        
        # Lista de ingredientes
        list_frame = ttk.LabelFrame(parent, text="Ingredientes de la receta", padding=10)
        list_frame.pack(fill='both', expand=True, pady=(0, 15))
        
        # Treeview para ingredientes
        columns = ('quantity', 'unit', 'name', 'notes')
        self.ing_tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=10)
        self.ing_tree.heading('quantity', text='Cantidad')
        self.ing_tree.heading('unit', text='Unidad')
        self.ing_tree.heading('name', text='Ingrediente')
        self.ing_tree.heading('notes', text='Notas')
        
        self.ing_tree.column('quantity', width=80, anchor='center')
        self.ing_tree.column('unit', width=80, anchor='center')
        self.ing_tree.column('name', width=200)
        self.ing_tree.column('notes', width=200)
        
        self.ing_tree.pack(fill='both', expand=True, pady=(0, 10))
        
        # Botones de acción
        btn_frame = ttk.Frame(list_frame)
        btn_frame.pack(fill='x')
        
        ttk.Button(btn_frame, text="✏️ Editar", 
                  command=self.edit_selected_ingredient).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="❌ Eliminar", 
                  command=self.remove_selected_ingredient).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="↑ Subir", 
                  command=lambda: self.move_ingredient(-1)).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="↓ Bajar", 
                  command=lambda: self.move_ingredient(1)).pack(side='left', padx=5)
    
    def create_details_tab(self, parent):
        """Crea pestaña de detalles avanzados"""
        # Tiempos y raciones
        time_frame = ttk.LabelFrame(parent, text="Tiempos y raciones", padding=15)
        time_frame.pack(fill='x', pady=(0, 20))
        
        # Preparación
        prep_frame = ttk.Frame(time_frame)
        prep_frame.pack(side='left', padx=(0, 25))
        ttk.Label(prep_frame, text="Preparación", font=('Helvetica', 10, 'bold')).pack(anchor='w')
        self.prep_var = tk.StringVar()
        ttk.Entry(prep_frame, textvariable=self.prep_var, width=12, 
                font=('Helvetica', 11)).pack()
        ttk.Label(prep_frame, text="minutos").pack(anchor='w')
        
        # Cocción
        cook_frame = ttk.Frame(time_frame)
        cook_frame.pack(side='left', padx=(0, 25))
        ttk.Label(cook_frame, text="Cocción", font=('Helvetica', 10, 'bold')).pack(anchor='w')
        self.cook_var = tk.StringVar()
        ttk.Entry(cook_frame, textvariable=self.cook_var, width=12, 
                font=('Helvetica', 11)).pack()
        ttk.Label(cook_frame, text="minutos").pack(anchor='w')
        
        # Raciones
        serv_frame = ttk.Frame(time_frame)
        serv_frame.pack(side='left')
        ttk.Label(serv_frame, text="Raciones", font=('Helvetica', 10, 'bold')).pack(anchor='w')
        self.serv_var = tk.StringVar(value="4")
        ttk.Entry(serv_frame, textvariable=self.serv_var, width=12, 
                font=('Helvetica', 11)).pack()
        ttk.Label(serv_frame, text="personas").pack(anchor='w')
        
        # Dificultad
        diff_frame = ttk.LabelFrame(parent, text="Dificultad", padding=15)
        diff_frame.pack(fill='x', pady=(0, 20))
        
        self.diff_var = tk.StringVar(value="intermedio")
        difficulties = [
            ("👶 Principiante", "principiante"),
            ("👨‍🍳 Intermedio", "intermedio"),
            ("👨‍🍳👨‍🍳 Experto", "experto")
        ]
        
        for text, value in difficulties:
            ttk.Radiobutton(diff_frame, text=text, variable=self.diff_var, 
                          value=value).pack(side='left', padx=15)
        
        # Categorías
        cat_frame = ttk.LabelFrame(parent, text="Categorías", padding=15)
        cat_frame.pack(fill='x', pady=(0, 20))
        
        self.cat_vars = {}
        categories = self.db.get_all_categories()
        
        # Grid de 4 columnas
        grid_frame = ttk.Frame(cat_frame)
        grid_frame.pack(fill='x')
        
        for i, cat in enumerate(categories):
            row = i // 4
            col = i % 4
            var = tk.BooleanVar()
            self.cat_vars[cat['id']] = var
            
            cb = ttk.Checkbutton(
                grid_frame,
                text=cat['name'],
                variable=var
            )
            cb.grid(row=row, column=col, sticky='w', padx=10, pady=5)
        
        # Tags
        tag_frame = ttk.LabelFrame(parent, text="Etiquetas (tags)", padding=15)
        tag_frame.pack(fill='x', pady=(0, 20))
        
        tag_top = ttk.Frame(tag_frame)
        tag_top.pack(fill='x', pady=(0, 10))
        
        ttk.Label(tag_top, text="Añadir tag:", font=('Helvetica', 10)).pack(side='left')
        self.new_tag_var = tk.StringVar()
        tag_entry = ttk.Entry(tag_top, textvariable=self.new_tag_var, width=25)
        tag_entry.pack(side='left', padx=10)
        tag_entry.bind('<Return>', lambda e: self.add_new_tag())
        
        ttk.Button(tag_top, text="➕", command=self.add_new_tag).pack(side='left')
        
        # Lista de tags seleccionados
        self.tags_listbox = tk.Listbox(tag_frame, height=4, font=('Helvetica', 10), 
                                     selectmode='extended')
        self.tags_listbox.pack(fill='x', pady=(5, 0))
        
        # Ratings personalizados
        rating_frame = ttk.LabelFrame(parent, text="Valoraciones", padding=15)
        rating_frame.pack(fill='x', pady=(0, 20))
        
        # Ratings predefinidos
        predef_frame = ttk.Frame(rating_frame)
        predef_frame.pack(fill='x', pady=(0, 15))
        
        ttk.Label(predef_frame, text="Sabor (1-10):", font=('Helvetica', 10, 'bold')).pack(side='left')
        self.taste_var = tk.IntVar()
        ttk.Spinbox(predef_frame, from_=0, to=10, textvariable=self.taste_var, 
                  width=5).pack(side='left', padx=10)
        
        ttk.Label(predef_frame, text="Facilidad (1-10):", font=('Helvetica', 10, 'bold')).pack(side='left', padx=(20, 0))
        self.ease_var = tk.IntVar()
        ttk.Spinbox(predef_frame, from_=0, to=10, textvariable=self.ease_var, 
                  width=5).pack(side='left', padx=10)
        
        ttk.Label(predef_frame, text="Coste (1=barato, 10=caro):", font=('Helvetica', 10, 'bold')).pack(side='left', padx=(20, 0))
        self.cost_var = tk.IntVar()
        ttk.Spinbox(predef_frame, from_=0, to=10, textvariable=self.cost_var, 
                  width=5).pack(side='left', padx=10)
        
        # Ratings personalizados
        custom_frame = ttk.Frame(rating_frame)
        custom_frame.pack(fill='x')
        
        ttk.Label(custom_frame, text="Otros criterios:", 
                font=('Helvetica', 10, 'bold')).pack(anchor='w', pady=(0, 5))
        
        self.custom_ratings_frame = ttk.Frame(custom_frame)
        self.custom_ratings_frame.pack(fill='x')
        
        self.update_custom_ratings_ui()
    
    def create_nutrition_tab(self, parent):
        """Crea pestaña de información nutricional"""
        info_label = ttk.Label(
            parent,
            text="💡 Los valores nutricionales se calculan automáticamente\n"
                 "según los ingredientes. Puedes ajustarlos manualmente si lo deseas.",
            font=('Helvetica', 10, 'italic'),
            foreground="#666666",
            padding=(0, 0, 0, 15)
        )
        info_label.pack(anchor='w')
        
        # Campos nutricionales
        fields_frame = ttk.Frame(parent)
        fields_frame.pack(fill='x')
        
        # Kcal
        kcal_frame = ttk.Frame(fields_frame)
        kcal_frame.pack(fill='x', pady=5)
        ttk.Label(kcal_frame, text="Energía (kcal por ración):", 
                font=('Helvetica', 10)).pack(side='left', width=250)
        self.kcal_var = tk.StringVar()
        ttk.Entry(kcal_frame, textvariable=self.kcal_var, width=10).pack(side='left')
        
        # Proteínas
        prot_frame = ttk.Frame(fields_frame)
        prot_frame.pack(fill='x', pady=5)
        ttk.Label(prot_frame, text="Proteínas (g por ración):", 
                font=('Helvetica', 10)).pack(side='left', width=250)
        self.prot_var = tk.StringVar()
        ttk.Entry(prot_frame, textvariable=self.prot_var, width=10).pack(side='left')
        
        # Carbohidratos
        carbs_frame = ttk.Frame(fields_frame)
        carbs_frame.pack(fill='x', pady=5)
        ttk.Label(carbs_frame, text="Carbohidratos (g por ración):", 
                font=('Helvetica', 10)).pack(side='left', width=250)
        self.carbs_var = tk.StringVar()
        ttk.Entry(carbs_frame, textvariable=self.carbs_var, width=10).pack(side='left')
        
        # Grasas
        fat_frame = ttk.Frame(fields_frame)
        fat_frame.pack(fill='x', pady=5)
        ttk.Label(fat_frame, text="Grasas (g por ración):", 
                font=('Helvetica', 10)).pack(side='left', width=250)
        self.fat_var = tk.StringVar()
        ttk.Entry(fat_frame, textvariable=self.fat_var, width=10).pack(side='left')
        
        # Botón calcular automáticamente
        calc_frame = ttk.Frame(parent, padding=(0, 20, 0, 0))
        calc_frame.pack(fill='x')
        
        ttk.Button(calc_frame, text="🧮 Calcular automáticamente", 
                  command=self.calculate_nutrition).pack(side='left')
        
        ttk.Label(calc_frame, text="  (basado en ingredientes)", 
                font=('Helvetica', 9), foreground="#888888").pack(side='left')
    
    def auto_capitalize_title(self, event=None):
        """Capitaliza automáticamente el título"""
        current = self.title_var.get()
        if current:
            self.title_var.set(StringUtils.capitalize_words(current))
    
    def select_image(self, event=None):
        """Selecciona imagen desde archivo"""
        path = filedialog.askopenfilename(
            title="Seleccionar foto",
            filetypes=[("Imágenes", "*.jpg *.jpeg *.png *.gif *.bmp")]
        )
        if path:
            self.load_image_preview(path)
    
    def load_image_preview(self, path):
        """Carga vista previa de imagen optimizada"""
        try:
            # Optimizar imagen
            output_path = Path("media/photos") / f"recipe_{hash(path)}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            result_path, (width, height) = ImageEngine.smart_resize(path, 800, 800, output_path)
            
            if result_path:
                self.current_image_path = str(output_path)
                
                # Crear miniatura para preview
                thumb_path = Path("media/thumbnails") / f"thumb_{output_path.name}"
                ImageEngine.create_thumbnail(str(output_path), 150, thumb_path)
                
                # Mostrar en UI (simulado - en producción usar PIL)
                self.photo_display.config(
                    text=f"✓ Foto cargada\n{Path(path).name}\n{width}x{height}px",
                    fg="#2E5D4F",
                    bg="#E8F5E9"
                )
            else:
                raise Exception("No se pudo procesar la imagen")
                
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo cargar la imagen:\n{str(e)}")
    
    def on_ingredient_search(self, *args):
        """Busca ingredientes al escribir"""
        query = self.ing_search_var.get().strip()
        if len(query) < 2:
            return
        
        results = self.db.search_ingredients(query)
        # En implementación completa: mostrar dropdown con resultados
    
    def add_ingredient_from_search(self, event=None):
        """Añade ingrediente desde búsqueda"""
        name = self.ing_search_var.get().strip()
        if not name:
            return
        
        # Diálogo para cantidad y detalles
        dialog = tk.Toplevel(self.window)
        dialog.title("Detalles del ingrediente")
        dialog.geometry("450x300")
        dialog.transient(self.window)
        dialog.grab_set()
        
        main_frame = ttk.Frame(dialog, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text=f"Ingrediente: {name}", 
                font=('Helvetica', 12, 'bold')).pack(pady=(0, 15))
        
        # Cantidad
        qty_frame = ttk.Frame(main_frame)
        qty_frame.pack(fill='x', pady=5)
        ttk.Label(qty_frame, text="Cantidad:").pack(side='left')
        qty_var = tk.StringVar(value="100")
        ttk.Entry(qty_frame, textvariable=qty_var, width=15).pack(side='left', padx=10)
        
        # Unidad
        unit_frame = ttk.Frame(main_frame)
        unit_frame.pack(fill='x', pady=5)
        ttk.Label(unit_frame, text="Unidad:").pack(side='left')
        unit_var = tk.StringVar(value="g")
        units = ["g", "ml", "unidad", "taza", "cucharada", "cucharadita", "pizca", "al gusto"]
        ttk.Combobox(unit_frame, textvariable=unit_var, values=units, 
                   state='readonly', width=15).pack(side='left', padx=10)
        
        # Notas
        ttk.Label(main_frame, text="Notas (opcional):").pack(anchor='w', pady=(15, 5))
        notes_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=notes_var, width=50).pack(fill='x')
        
        # Tipo de ingrediente
        type_frame = ttk.Frame(main_frame)
        type_frame.pack(fill='x', pady=(15, 0))
        ttk.Label(type_frame, text="Tipo:").pack(side='left')
        type_var = tk.StringVar(value="otro")
        types = ["otro", "vegetal", "lácteo", "carne", "pescado", "cereal", "condimento", "especia", "hierba"]
        ttk.Combobox(type_frame, textvariable=type_var, values=types, 
                   state='readonly', width=15).pack(side='left', padx=10)
        
        # Alergénos
        allergen_var = tk.BooleanVar()
        allergen_type_var = tk.StringVar(value="gluten")
        allergen_frame = ttk.Frame(main_frame)
        allergen_frame.pack(fill='x', pady=(10, 0))
        ttk.Checkbutton(allergen_frame, text="Contiene alergénos", 
                      variable=allergen_var).pack(side='left')
        
        allergen_type_combo = ttk.Combobox(allergen_frame, textvariable=allergen_type_var,
                                         values=["gluten", "lactosa", "huevo", "frutos_secos", 
                                                "marisco", "soja", "apio", "mostaza"],
                                         state='disabled', width=15)
        allergen_type_combo.pack(side='left', padx=10)
        
        def toggle_allergen_type():
            allergen_type_combo.config(state='readonly' if allergen_var.get() else 'disabled')
        
        allergen_var.trace('w', lambda *args: toggle_allergen_type())
        
        def add():
            try:
                qty = float(qty_var.get())
            except:
                qty = 100.0
            
            # Añadir a lista
            ingredient = {
                'name': name,
                'quantity': qty,
                'unit': unit_var.get(),
                'notes': notes_var.get().strip(),
                'type': type_var.get(),
                'is_allergen': allergen_var.get(),
                'allergen_type': allergen_type_var.get() if allergen_var.get() else None,
                'position': len(self.ingredients_list)
            }
            
            # Guardar en BD si es nuevo
            self.db.add_ingredient(
                name, 
                type_var.get(), 
                unit_var.get(),
                1 if allergen_var.get() else 0,
                allergen_type_var.get() if allergen_var.get() else None
            )
            
            self.ingredients_list.append(ingredient)
            self.update_ingredients_list()
            dialog.destroy()
            self.ing_search_var.set("")
        
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(pady=20, anchor='e')
        
        ttk.Button(btn_frame, text="Cancelar", command=dialog.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Añadir ingrediente", 
                  command=add, style='TButton').pack(side='left', padx=5)
    
    def update_ingredients_list(self):
        """Actualiza lista de ingredientes en Treeview"""
        # Limpiar
        for item in self.ing_tree.get_children():
            self.ing_tree.delete(item)
        
        # Añadir ingredientes
        for i, ing in enumerate(self.ingredients_list):
            self.ing_tree.insert('', 'end', values=(
                f"{ing['quantity']:g}" if ing['quantity'] % 1 != 0 else str(int(ing['quantity'])),
                ing['unit'],
                ing['name'],
                ing['notes']
            ))
    
    def update_custom_ratings_ui(self):
        """Actualiza UI de ratings personalizados"""
        # Limpiar frame
        for widget in self.custom_ratings_frame.winfo_children():
            widget.destroy()
        
        # Obtener criterios activos
        criteria = self.db.get_all_rating_criteria()
        
        for crit in criteria:
            frame = ttk.Frame(self.custom_ratings_frame)
            frame.pack(fill='x', pady=5)
            
            ttk.Label(frame, text=f"{crit['name']} ({crit['scale_min']}-{crit['scale_max']}):", 
                    font=('Helvetica', 10)).pack(side='left', width=200)
            
            value_var = tk.IntVar()
            self.custom_ratings_values[crit['id']] = value_var
            
            # Buscar valor existente si es edición
            if self.recipe_id:
                for cr in self.custom_ratings:
                    if cr['id'] == crit['id']:
                        value_var.set(cr['value'] or 0)
                        break
            
            ttk.Spinbox(frame, from_=0, to=crit['scale_max'], textvariable=value_var, 
                      width=5).pack(side='left')
    
    def calculate_nutrition(self):
        """Calcula nutrición automáticamente basado en ingredientes"""
        if not self.ingredients_list:
            messagebox.showinfo("Información", "Añade ingredientes primero para calcular nutrición")
            return
        
        nutrition = NutritionCalculator.estimate_nutrition(self.ingredients_list)
        
        # Ajustar por raciones
        try:
            servings = int(self.serv_var.get())
        except:
            servings = 4
        
        if servings > 0:
            for key in nutrition:
                if nutrition[key]:
                    nutrition[key] = nutrition[key] / servings
        
        self.kcal_var.set(f"{nutrition['kcal']:.0f}" if nutrition['kcal'] else "")
        self.prot_var.set(f"{nutrition['protein']:.1f}" if nutrition['protein'] else "")
        self.carbs_var.set(f"{nutrition['carbs']:.1f}" if nutrition['carbs'] else "")
        self.fat_var.set(f"{nutrition['fat']:.1f}" if nutrition['fat'] else "")
        
        messagebox.showinfo("Éxito", "Valores nutricionales calculados automáticamente")
    
    def load_existing_data(self):
        """Carga datos existentes en formulario (edición)"""
        if not self.recipe_data:
            return
        
        self.title_var.set(self.recipe_data.get('title', ''))
        self.desc_var.set(self.recipe_data.get('description', ''))
        self.instr_text.insert('1.0', self.recipe_data.get('instructions', ''))
        self.origin_var.set(self.recipe_data.get('origin', ''))
        self.prep_var.set(self.recipe_data.get('prep_time', '') or '')
        self.cook_var.set(self.recipe_data.get('cook_time', '') or '')
        self.serv_var.set(self.recipe_data.get('servings', '4') or '4')
        self.diff_var.set(self.recipe_data.get('difficulty', 'intermedio'))
        self.taste_var.set(self.recipe_data.get('rating_taste', 0) or 0)
        self.ease_var.set(self.recipe_data.get('rating_ease', 0) or 0)
        self.cost_var.set(self.recipe_data.get('rating_cost', 0) or 0)
        self.kcal_var.set(self.recipe_data.get('nutrition_kcal', '') or '')
        self.prot_var.set(self.recipe_data.get('nutrition_protein', '') or '')
        self.carbs_var.set(self.recipe_data.get('nutrition_carbs', '') or '')
        self.fat_var.set(self.recipe_data.get('nutrition_fat', '') or '')
        
        # Cargar imagen existente
        if self.current_image_path and Path(self.current_image_path).exists():
            self.photo_display.config(
                text=f"✓ Foto existente\n{Path(self.current_image_path).name}",
                fg="#2E5D4F",
                bg="#E8F5E9"
            )
        
        # Marcar categorías existentes
        for cat in self.categories_list:
            if cat['id'] in self.cat_vars:
                self.cat_vars[cat['id']].set(True)
        
        # Cargar tags
        for tag in self.tags_list:
            self.tags_listbox.insert('end', tag['name'])
    
    def save_recipe(self):
        """Guarda receta en base de datos"""
        # Validación mínima
        if not self.title_var.get().strip():
            messagebox.showerror("Error", "El título es obligatorio")
            return
        
        if not self.instr_text.get('1.0', 'end').strip():
            messagebox.showerror("Error", "Las instrucciones son obligatorias")
            return
        
        # Preparar datos
        recipe_data = {
            'title': self.title_var.get().strip(),
            'description': self.desc_var.get().strip(),
            'instructions': self.instr_text.get('1.0', 'end').strip(),
            'prep_time': TimeFormatter.parse_time_input(self.prep_var.get()),
            'cook_time': TimeFormatter.parse_time_input(self.cook_var.get()),
            'servings': int(self.serv_var.get()) if self.serv_var.get().isdigit() else 4,
            'difficulty': self.diff_var.get(),
            'origin': self.origin_var.get().strip(),
            'rating_taste': self.taste_var.get() if self.taste_var.get() > 0 else None,
            'rating_ease': self.ease_var.get() if self.ease_var.get() > 0 else None,
            'rating_cost': self.cost_var.get() if self.cost_var.get() > 0 else None,
            'is_favorite': False,
            'image_path': self.current_image_path,
            'nutrition_kcal': float(self.kcal_var.get()) if self.kcal_var.get().replace('.', '', 1).isdigit() else None,
            'nutrition_protein': float(self.prot_var.get()) if self.prot_var.get().replace('.', '', 1).isdigit() else None,
            'nutrition_carbs': float(self.carbs_var.get()) if self.carbs_var.get().replace('.', '', 1).isdigit() else None,
            'nutrition_fat': float(self.fat_var.get()) if self.fat_var.get().replace('.', '', 1).isdigit() else None,
            'version_notes': '',
            'base_recipe_id': None
        }
        
        # Categorías seleccionadas
        selected_cats = [str(cat_id) for cat_id, var in self.cat_vars.items() if var.get()]
        
        # Tags seleccionados (simulado)
        selected_tags = []
        
        # Guardar en base de datos
        try:
            if self.recipe_id:
                self.db.update_recipe(
                    self.recipe_id, 
                    recipe_data, 
                    selected_cats, 
                    self.ingredients_list, 
                    selected_tags,
                    self.custom_ratings_values
                )
            else:
                self.db.add_recipe(
                    recipe_data, 
                    selected_cats, 
                    self.ingredients_list, 
                    selected_tags,
                    self.custom_ratings_values
                )
            
            self.saved = True
            action = "actualizada" if self.recipe_id else "creada"
            messagebox.showinfo("Éxito", f"Receta {action} correctamente")
            self.window.destroy()
            
            # Recalcular nutrición si es nueva
            if not self.recipe_id and not (self.kcal_var.get() or self.prot_var.get()):
                self.calculate_nutrition()
                
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo guardar la receta:\n{str(e)}")