#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Diálogo de búsqueda avanzada con filtros múltiples y combinados
"""

import tkinter as tk
from tkinter import ttk, messagebox

class AdvancedSearchDialog:
    def __init__(self, parent, db, main_window):
        self.parent = parent
        self.db = db
        self.main_window = main_window
        self.applied_filters = None
        
        self.window = tk.Toplevel(parent)
        self.window.title("🔍 Búsqueda avanzada")
        self.window.geometry("850x700")
        self.window.configure(bg="#FFFDFB")
        self.window.transient(parent)
        self.window.grab_set()
        
        self.create_ui()
    
    def create_ui(self):
        main_frame = ttk.Frame(self.window, padding=25)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text="🔍 Búsqueda Avanzada", 
                 font=('Helvetica', 18, 'bold'), foreground="#8B4513").pack(pady=(0, 25))
        
        # Notebook para organizar filtros
        notebook = ttk.Notebook(main_frame)
        notebook.pack(fill='both', expand=True)
        
        # Pestaña 1: Texto e ingredientes
        tab1 = ttk.Frame(notebook, padding=15)
        notebook.add(tab1, text=" Texto e Ingredientes ")
        self.create_text_ingredient_tab(tab1)
        
        # Pestaña 2: Categorías y tags
        tab2 = ttk.Frame(notebook, padding=15)
        notebook.add(tab2, text=" Categorías y Etiquetas ")
        self.create_category_tag_tab(tab2)
        
        # Pestaña 3: Rating y nutrición
        tab3 = ttk.Frame(notebook, padding=15)
        notebook.add(tab3, text=" Rating y Nutrición ")
        self.create_rating_nutrition_tab(tab3)
        
        # Pestaña 4: Tiempo y dificultad
        tab4 = ttk.Frame(notebook, padding=15)
        notebook.add(tab4, text=" Tiempo y Dificultad ")
        self.create_time_difficulty_tab(tab4)
        
        # Botones
        btn_frame = ttk.Frame(main_frame, padding=(0, 20, 0, 0))
        btn_frame.pack(fill='x')
        
        ttk.Button(btn_frame, text="Cancelar", 
                  command=self.window.destroy, width=12).pack(side='right', padx=5)
        ttk.Button(btn_frame, text="Limpiar filtros", 
                  command=self.clear_filters, width=15).pack(side='right', padx=5)
        ttk.Button(btn_frame, text="Buscar recetas", 
                  command=self.apply_filters, style='TButton', width=15).pack(side='right', padx=5)
    
    def create_text_ingredient_tab(self, parent):
        # Búsqueda por texto
        text_frame = ttk.LabelFrame(parent, text="Buscar en título, descripción o instrucciones", padding=15)
        text_frame.pack(fill='x', pady=(0, 20))
        
        self.text_var = tk.StringVar()
        ttk.Entry(text_frame, textvariable=self.text_var, 
                font=('Helvetica', 12), width=60).pack(fill='x')
        
        # Búsqueda por ingredientes
        ing_frame = ttk.LabelFrame(parent, text="Ingredientes", padding=15)
        ing_frame.pack(fill='x', pady=(0, 20))
        
        # Modo de búsqueda
        mode_frame = ttk.Frame(ing_frame)
        mode_frame.pack(fill='x', pady=(0, 15))
        
        self.ing_mode = tk.StringVar(value="any")
        ttk.Radiobutton(mode_frame, text="Recetas con AL MENOS UNO de estos ingredientes", 
                       variable=self.ing_mode, value="any").pack(anchor='w')
        ttk.Radiobutton(mode_frame, text="Recetas con TODOS estos ingredientes", 
                       variable=self.ing_mode, value="all").pack(anchor='w', pady=(8, 0))
        ttk.Radiobutton(mode_frame, text="Recetas con EXACTAMENTE estos ingredientes (nada más)", 
                       variable=self.ing_mode, value="exact").pack(anchor='w', pady=(8, 0))
        
        # Lista de ingredientes
        list_frame = ttk.Frame(ing_frame)
        list_frame.pack(fill='x')
        
        ttk.Label(list_frame, text="Selecciona ingredientes:", 
                font=('Helvetica', 10, 'bold')).pack(anchor='w', pady=(0, 10))
        
        # Treeview con ingredientes
        columns = ('name', 'type')
        self.ing_tree = ttk.Treeview(list_frame, columns=columns, show='headings', 
                                   height=8, selectmode='extended')
        self.ing_tree.heading('name', text='Ingrediente')
        self.ing_tree.heading('type', text='Tipo')
        self.ing_tree.column('name', width=250)
        self.ing_tree.column('type', width=150)
        
        # Cargar ingredientes
        ingredients = self.db.get_all_ingredients()
        for ing in ingredients[:50]:  # Primeros 50 para ejemplo
            self.ing_tree.insert('', 'end', values=(ing['name'], ing['type']))
        
        self.ing_tree.pack(side='left', fill='both', expand=True)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(list_frame, orient='vertical', command=self.ing_tree.yview)
        scrollbar.pack(side='right', fill='y')
        self.ing_tree.configure(yscrollcommand=scrollbar.set)
    
    def create_category_tag_tab(self, parent):
        # Categorías
        cat_frame = ttk.LabelFrame(parent, text="Categorías", padding=15)
        cat_frame.pack(fill='x', pady=(0, 20))
        
        self.cat_vars = {}
        categories = self.db.get_all_categories()
        
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
        tag_frame = ttk.LabelFrame(parent, text="Etiquetas (Tags)", padding=15)
        tag_frame.pack(fill='x')
        
        self.tag_vars = {}
        tags = self.db.get_all_tags()
        
        tag_grid = ttk.Frame(tag_frame)
        tag_grid.pack(fill='x')
        
        for i, tag in enumerate(tags[:20]):  # Primeros 20 tags
            row = i // 5
            col = i % 5
            var = tk.BooleanVar()
            self.tag_vars[tag['id']] = var
            
            cb = ttk.Checkbutton(
                tag_grid,
                text=tag['name'],
                variable=var
            )
            cb.grid(row=row, column=col, sticky='w', padx=8, pady=3)
    
    def create_rating_nutrition_tab(self, parent):
        # Rating
        rating_frame = ttk.LabelFrame(parent, text="Valoraciones", padding=15)
        rating_frame.pack(fill='x', pady=(0, 20))
        
        # Sabor
        taste_frame = ttk.Frame(rating_frame)
        taste_frame.pack(fill='x', pady=5)
        ttk.Label(taste_frame, text="Sabor mínimo:", width=15).pack(side='left')
        self.min_taste = tk.IntVar(value=0)
        ttk.Spinbox(taste_frame, from_=0, to=10, textvariable=self.min_taste, width=5).pack(side='left')
        
        # Facilidad
        ease_frame = ttk.Frame(rating_frame)
        ease_frame.pack(fill='x', pady=5)
        ttk.Label(ease_frame, text="Facilidad mínima:", width=15).pack(side='left')
        self.min_ease = tk.IntVar(value=0)
        ttk.Spinbox(ease_frame, from_=0, to=10, textvariable=self.min_ease, width=5).pack(side='left')
        
        # Coste
        cost_frame = ttk.Frame(rating_frame)
        cost_frame.pack(fill='x', pady=5)
        ttk.Label(cost_frame, text="Coste máximo (1=barato):", width=25).pack(side='left')
        self.max_cost = tk.IntVar(value=10)
        ttk.Spinbox(cost_frame, from_=1, to=10, textvariable=self.max_cost, width=5).pack(side='left')
        
        # Nutrición
        nut_frame = ttk.LabelFrame(parent, text="Nutrición (por ración)", padding=15)
        nut_frame.pack(fill='x')
        
        # Kcal
        kcal_frame = ttk.Frame(nut_frame)
        kcal_frame.pack(fill='x', pady=5)
        ttk.Label(kcal_frame, text="Máximo kcal:", width=15).pack(side='left')
        self.max_kcal = tk.StringVar()
        ttk.Entry(kcal_frame, textvariable=self.max_kcal, width=10).pack(side='left')
        
        # Proteínas
        prot_frame = ttk.Frame(nut_frame)
        prot_frame.pack(fill='x', pady=5)
        ttk.Label(prot_frame, text="Mínimo proteínas (g):", width=20).pack(side='left')
        self.min_prot = tk.StringVar()
        ttk.Entry(prot_frame, textvariable=self.min_prot, width=10).pack(side='left')
    
    def create_time_difficulty_tab(self, parent):
        # Tiempo total
        time_frame = ttk.LabelFrame(parent, text="Tiempo total (preparación + cocción)", padding=15)
        time_frame.pack(fill='x', pady=(0, 20))
        
        ttk.Label(time_frame, text="Máximo tiempo:", font=('Helvetica', 10, 'bold')).pack(anchor='w')
        self.max_time = tk.IntVar(value=180)
        time_scale = ttk.Scale(time_frame, from_=15, to=300, variable=self.max_time, 
                             orient='horizontal', length=300)
        time_scale.pack(pady=10)
        
        self.time_label = ttk.Label(time_frame, text="180 minutos")
        self.time_label.pack()
        self.max_time.trace('w', lambda *args: self.time_label.config(text=f"{self.max_time.get()} minutos"))
        
        # Dificultad
        diff_frame = ttk.LabelFrame(parent, text="Dificultad", padding=15)
        diff_frame.pack(fill='x')
        
        self.difficulty_var = tk.StringVar(value="any")
        difficulties = [
            ("Cualquiera", "any"),
            ("👶 Solo principiantes", "principiante"),
            ("👨‍🍳 Intermedio o experto", "intermedio,experto"),
            ("👨‍🍳👨‍🍳 Solo expertos", "experto")
        ]
        
        for text, value in difficulties:
            ttk.Radiobutton(diff_frame, text=text, variable=self.difficulty_var, 
                          value=value).pack(anchor='w', pady=5)
        
        # Favoritos
        fav_frame = ttk.Frame(parent, padding=(0, 20, 0, 0))
        fav_frame.pack(fill='x')
        
        self.fav_var = tk.BooleanVar()
        ttk.Checkbutton(fav_frame, text="Mostrar solo favoritas", 
                      variable=self.fav_var, style='TCheckbutton').pack(anchor='w')
    
    def clear_filters(self):
        """Limpia todos los filtros"""
        self.text_var.set("")
        self.min_taste.set(0)
        self.min_ease.set(0)
        self.max_cost.set(10)
        self.max_kcal.set("")
        self.min_prot.set("")
        self.max_time.set(180)
        self.difficulty_var.set("any")
        self.fav_var.set(False)
        self.ing_mode.set("any")
        
        # Desmarcar categorías
        for var in self.cat_vars.values():
            var.set(False)
        
        # Desmarcar tags
        for var in self.tag_vars.values():
            var.set(False)
        
        # Limpiar selección de ingredientes
        for item in self.ing_tree.selection():
            self.ing_tree.selection_remove(item)
    
    def apply_filters(self):
        """Aplica filtros y cierra diálogo"""
        filters = {}
        
        # Texto
        text = self.text_var.get().strip()
        if text:
            filters['search_text'] = text
        
        # Ingredientes
        selected_ings = []
        for item in self.ing_tree.selection():
            values = self.ing_tree.item(item)['values']
            ing_name = values[0]
            # Buscar ID del ingrediente
            ings = self.db.search_ingredients(ing_name)
            if ings:
                selected_ings.append(str(ings[0]['id']))
        
        if selected_ings:
            mode = self.ing_mode.get()
            if mode == "any":
                filters['ingredients_any'] = selected_ings
            elif mode == "all":
                filters['ingredients_all'] = selected_ings
            # Modo "exact" requiere lógica más compleja (no implementada en este ejemplo simplificado)
        
        # Categorías
        selected_cats = [str(cat_id) for cat_id, var in self.cat_vars.items() if var.get()]
        if selected_cats:
            filters['categories'] = selected_cats
        
        # Tags
        selected_tags = [str(tag_id) for tag_id, var in self.tag_vars.items() if var.get()]
        if selected_tags:
            filters['tags'] = selected_tags
        
        # Rating
        if self.min_taste.get() > 0:
            filters['min_rating_taste'] = self.min_taste.get()
        if self.min_ease.get() > 0:
            filters['min_rating_ease'] = self.min_ease.get()
        if self.max_cost.get() < 10:
            filters['min_rating_cost'] = self.max_cost.get()  # Coste bajo = valor bajo
        
        # Nutrición
        if self.max_kcal.get().isdigit():
            filters['max_kcal'] = int(self.max_kcal.get())
        if self.min_prot.get().isdigit():
            filters['min_protein'] = int(self.min_prot.get())
        
        # Tiempo
        if self.max_time.get() < 300:
            filters['max_time'] = self.max_time.get()
        
        # Dificultad
        diff_val = self.difficulty_var.get()
        if diff_val != "any":
            filters['difficulty'] = diff_val.split(',')[0]  # Tomar primer valor
        
        # Favoritos
        if self.fav_var.get():
            filters['favorites_only'] = True
        
        self.applied_filters = filters
        self.window.destroy()