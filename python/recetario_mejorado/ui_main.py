#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Interfaz Principal de Cocinando con Papi
Diseño elegante con navegación lateral, tarjetas de recetas y controles avanzados
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog, simpledialog
import os
from pathlib import Path
from datetime import datetime, timedelta
import json

from database import Database
from models import Recipe, Ingredient, Category, Tag
from utils import TimeFormatter, ExportHelper, ConfigManager, ColorUtils, DateUtils
from ui_recipe_form import RecipeFormDialog
from ui_search import AdvancedSearchDialog
from ui_planner import WeeklyPlannerDialog
from ui_shopping import ShoppingListDialog
from pdf_engine import export_recipes_to_pdf
from excel_engine import export_recipes_to_excel, export_recipes_to_csv

class MainWindow:
    def __init__(self, root):
        self.root = root
        self.root.title("🥘 Cocinando con Papi")
        self.root.geometry("1200x750")
        self.root.minsize(900, 600)
        
        # Cargar configuración
        self.config = ConfigManager.load_config()
        
        # Restaurar tamaño ventana si existe en configuración
        if self.config.get('window_width') and self.config.get('window_height'):
            self.root.geometry(f"{self.config['window_width']}x{self.config['window_height']}")
        
        # Conexión base de datos
        self.db = Database()
        
        # Variables UI
        self.current_order = "updated_at DESC"
        self.current_filters = {}
        self.recipe_cards = []
        self.selected_recipes = set()
        
        # Configurar estilo elegante
        self.setup_styles()
        
        # Construir interfaz
        self.create_ui()
        self.load_recipes()
        self.update_stats()
        
        # Bind eventos ventana
        self.root.bind('<Configure>', self.on_window_resize)
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def setup_styles(self):
        """Configura estilos Tkinter personalizados"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Colores elegantes
        self.colors = {
            'primary': "#8B4513",        # Marrón cuero
            'secondary': "#D4A798",      # Rosa terracota
            'accent': "#2E5D4F",         # Verde oliva
            'bg_light': "#FFFDFB",       # Crema extra suave
            'text_dark': "#2D2D2D",      # Gris casi negro
            'favorite': "#C41E3A",       # Rojo vino
            'success': "#4CAF50",        # Verde suave
            'warning': "#FF9800",        # Naranja cálido
            'border': "#E0D6C9",         # Borde suave
            'hover': "#F5EFE7"           # Hover suave
        }
        
        bg = self.colors['bg_light']
        primary = self.colors['primary']
        accent = self.colors['accent']
        secondary = self.colors['secondary']
        favorite = self.colors['favorite']
        border = self.colors['border']
        hover = self.colors['hover']
        
        # Configurar colores globales
        style.configure('TFrame', background=bg)
        style.configure('TLabel', background=bg, foreground=self.colors['text_dark'])
        style.configure('TButton', background=primary, foreground='white', 
                       font=('Helvetica', 10, 'bold'), borderwidth=0)
        style.map('TButton', 
                 background=[('active', ColorUtils.darken_color(primary, 0.1))],
                 foreground=[('active', 'white')])
        
        # Estilo para sidebar
        style.configure('Sidebar.TFrame', background=primary)
        style.configure('Sidebar.TLabel', background=primary, foreground='white', 
                       font=('Helvetica', 11, 'bold'))
        style.configure('Sidebar.Accent.TLabel', background=primary, foreground=secondary,
                       font=('Helvetica', 11, 'bold'))
        style.configure('Sidebar.Sub.TLabel', background=primary, foreground='#E8D9C5',
                       font=('Helvetica', 9))
        
        # Estilo para tarjetas
        style.configure('Card.TFrame', background='white', relief='flat', 
                       borderwidth=1, bordercolor=border)
        style.configure('CardTitle.TLabel', background='white', foreground=primary,
                       font=('Helvetica', 13, 'bold'))
        style.configure('CardMeta.TLabel', background='white', foreground='#666666',
                       font=('Helvetica', 10))
        style.configure('CardIng.TLabel', background='white', foreground='#555555',
                       font=('Helvetica', 9))
        style.configure('CardTime.TLabel', background='white', foreground=accent,
                       font=('Helvetica', 10, 'bold'))
        
        # Estilo para favoritos
        style.configure('Favorite.Heart.TLabel', background='white', foreground=favorite,
                       font=('Helvetica', 14))
        
        # Estilo para búsqueda
        style.configure('Search.TEntry', 
                       foreground=self.colors['text_dark'],
                       fieldbackground='white',
                       insertcolor=self.colors['text_dark'],
                       bordercolor=border,
                       lightcolor=border,
                       darkcolor=border)
        
        # Treeview personalizado
        style.configure('Treeview', 
                       background='white',
                       foreground=self.colors['text_dark'],
                       rowheight=28,
                       fieldbackground='white',
                       font=('Helvetica', 10))
        style.map('Treeview', 
                 background=[('selected', hover)],
                 foreground=[('selected', primary)])
        
        # Scrollbar elegante
        style.configure('Vertical.TScrollbar', 
                       background=bg, 
                       troughcolor=bg,
                       bordercolor=bg,
                       arrowcolor=primary,
                       darkcolor=bg,
                       lightcolor=bg)
        style.map('Vertical.TScrollbar',
                 background=[('active', hover), ('pressed', primary)])
        
        # Combobox
        style.configure('TCombobox', 
                       fieldbackground='white',
                       background='white',
                       arrowcolor=primary,
                       bordercolor=border,
                       lightcolor=border,
                       darkcolor=border)
        style.map('TCombobox',
                 fieldbackground=[('readonly', 'white')],
                 selectbackground=[('focus', hover)],
                 selectforeground=[('focus', primary)])
        
        # Checkbutton
        style.configure('TCheckbutton',
                       background=bg,
                       foreground=self.colors['text_dark'],
                       font=('Helvetica', 10))
        style.map('TCheckbutton',
                 background=[('active', bg)],
                 foreground=[('active', primary)])
        
        # Radiobutton
        style.configure('TRadiobutton',
                       background=bg,
                       foreground=self.colors['text_dark'],
                       font=('Helvetica', 10))
        style.map('TRadiobutton',
                 background=[('active', bg)],
                 foreground=[('active', primary)])
        
        # Progressbar
        style.configure('TProgressbar',
                       background=accent,
                       troughcolor=hover,
                       bordercolor=border,
                       lightcolor=accent,
                       darkcolor=accent)
    
    def create_ui(self):
        """Construye toda la interfaz de usuario"""
        # Frame principal con grid
        self.main_frame = ttk.Frame(self.root)
        self.main_frame.pack(fill='both', expand=True)
        
        # ===== SIDEBAR IZQUIERDA =====
        self.create_sidebar()
        
        # ===== PANEL CENTRAL =====
        self.create_center_panel()
        
        # ===== BARRA INFERIOR =====
        self.create_bottom_bar()
    
    def create_sidebar(self):
        """Crea barra lateral de navegación"""
        self.sidebar = ttk.Frame(self.main_frame, style='Sidebar.TFrame', width=240)
        self.sidebar.pack(side='left', fill='y')
        self.sidebar.pack_propagate(False)
        
        # Logo/header sidebar
        header_frame = ttk.Frame(self.sidebar, style='Sidebar.TFrame', padding=15)
        header_frame.pack(fill='x')
        
        logo_label = ttk.Label(
            header_frame, 
            text="🥘 COCINANDO CON PAPI",
            style='Sidebar.Accent.TLabel',
            font=('Helvetica', 15, 'bold')
        )
        logo_label.pack(pady=(10, 5))
        
        chef_label = ttk.Label(
            header_frame,
            text="Tu asistente culinario personal",
            style='Sidebar.Sub.TLabel',
            font=('Helvetica', 9)
        )
        chef_label.pack()
        
        brand_label = ttk.Label(
            header_frame,
            text="© Jose Antonio Martinez Rubio",
            style='Sidebar.Sub.TLabel',
            font=('Helvetica', 8, 'italic')
        )
        brand_label.pack(pady=(5, 0))
        
        # Separador decorativo
        sep_frame = ttk.Frame(self.sidebar, style='Sidebar.TFrame', height=2)
        sep_frame.pack(fill='x', padx=20, pady=15)
        sep_frame.configure(height=2)
        sep_frame.pack_propagate(False)
        sep_inner = ttk.Frame(sep_frame, style='Sidebar.TFrame', height=2)
        sep_inner.configure(style='TFrame', background=secondary)
        sep_inner.pack(fill='x', padx=5)
        
        # Navegación principal
        nav_frame = ttk.Frame(self.sidebar, style='Sidebar.TFrame')
        nav_frame.pack(fill='x', padx=15)
        
        # Botones navegación principales
        nav_items = [
            ("📋 Todas las recetas", self.show_all_recipes, "📋"),
            ("❤️ Favoritas", self.show_favorites, "❤️"),
            ("📅 Planificador", self.open_weekly_planner, "📅"),
            ("🛒 Lista de la compra", self.open_shopping_list, "🛒"),
            ("🔍 Búsqueda avanzada", self.open_advanced_search, "🔍"),
            ("➕ Nueva receta", self.open_new_recipe, "➕")
        ]
        
        self.nav_buttons = {}
        for text, command, icon in nav_items:
            btn = self.create_sidebar_button(nav_frame, f"{icon}  {text}", command)
            self.nav_buttons[text] = btn
        
        # Separador
        sep_frame2 = ttk.Frame(self.sidebar, style='Sidebar.TFrame', height=2)
        sep_frame2.pack(fill='x', padx=20, pady=15)
        sep_frame2.configure(height=2)
        sep_frame2.pack_propagate(False)
        sep_inner2 = ttk.Frame(sep_frame2, style='Sidebar.TFrame', height=2)
        sep_inner2.configure(style='TFrame', background=secondary)
        sep_inner2.pack(fill='x', padx=5)
        
        # Categorías
        cat_header = ttk.Label(
            self.sidebar,
            text="  CATEGORÍAS",
            style='Sidebar.TLabel',
            font=('Helvetica', 10, 'bold'),
            image=tk.PhotoImage(width=1, height=1),  # Para alineación
            compound='left'
        )
        cat_header.pack(anchor='w', padx=15, pady=(10, 5))
        
        self.category_buttons = {}
        self.load_categories()
        
        # Botón nueva categoría
        add_cat_btn = tk.Button(
            self.sidebar,
            text="  ➕ Añadir categoría",
            command=self.add_new_category,
            bg='transparent',
            fg=secondary,
            font=('Helvetica', 10, 'italic'),
            relief='flat',
            anchor='w',
            padx=15,
            pady=6,
            cursor='hand2',
            bd=0,
            activebackground=ColorUtils.darken_color(self.colors['primary'], 0.1),
            activeforeground='white'
        )
        add_cat_btn.pack(fill='x', pady=(5, 15))
        self.sidebar.bind('<Configure>', lambda e: self.sidebar.update_idletasks())
    
    def create_sidebar_button(self, parent, text, command):
        """Crea botón elegante para sidebar"""
        btn = tk.Button(
            parent,
            text=text,
            command=command,
            bg='transparent',
            fg='white',
            font=('Helvetica', 11),
            relief='flat',
            anchor='w',
            padx=15,
            pady=10,
            cursor='hand2',
            bd=0,
            activebackground=ColorUtils.darken_color(self.colors['primary'], 0.1),
            activeforeground='white'
        )
        btn.pack(fill='x', pady=2)
        return btn
    
    def create_center_panel(self):
        """Crea panel central con área de contenido"""
        center_frame = ttk.Frame(self.main_frame)
        center_frame.pack(side='left', fill='both', expand=True)
        
        # Barra superior con búsqueda y controles
        top_bar = ttk.Frame(center_frame, padding=(20, 15, 20, 10))
        top_bar.pack(fill='x')
        
        # Título sección
        self.section_title = ttk.Label(
            top_bar,
            text="Todas las recetas",
            font=('Helvetica', 18, 'bold'),
            foreground=self.colors['primary']
        )
        self.section_title.pack(side='left')
        
        # Frame derecho para controles
        controls_frame = ttk.Frame(top_bar)
        controls_frame.pack(side='right')
        
        # Campo búsqueda rápida
        search_frame = ttk.Frame(controls_frame)
        search_frame.pack(side='left', padx=(0, 15))
        
        self.search_var = tk.StringVar()
        self.search_var.trace('w', lambda *args: self.on_search_change())
        
        search_entry = ttk.Entry(
            search_frame,
            textvariable=self.search_var,
            font=('Helvetica', 11),
            width=30,
            style='Search.TEntry'
        )
        search_entry.pack(side='left', ipady=4)
        
        # Placeholder management
        search_entry.insert(0, "Buscar recetas...")
        search_entry.bind('<FocusIn>', lambda e: self.on_search_focus_in(search_entry))
        search_entry.bind('<FocusOut>', lambda e: self.on_search_focus_out(search_entry))
        
        # Botón búsqueda avanzada
        adv_search_btn = tk.Button(
            controls_frame,
            text="🔍 Avanzada",
            command=self.open_advanced_search,
            bg=self.colors['accent'],
            fg='white',
            font=('Helvetica', 10, 'bold'),
            relief='flat',
            padx=12,
            pady=5,
            cursor='hand2',
            bd=0,
            activebackground=ColorUtils.darken_color(self.colors['accent'], 0.1)
        )
        adv_search_btn.pack(side='left', padx=(0, 15))
        
        # Controles de ordenación
        order_frame = ttk.Frame(controls_frame)
        order_frame.pack(side='left')
        
        order_label = ttk.Label(order_frame, text="Ordenar:", font=('Helvetica', 10))
        order_label.pack(side='left', padx=(0, 8))
        
        self.order_var = tk.StringVar(value="Recientes")
        order_options = [
            "Recientes", "Antiguas", "A-Z", "Z-A", 
            "Sabor ↑", "Sabor ↓", "Facilidad ↑", "Facilidad ↓",
            "Coste ↑", "Coste ↓", "Favoritos primero"
        ]
        order_menu = ttk.Combobox(
            order_frame,
            textvariable=self.order_var,
            values=order_options,
            state='readonly',
            width=14,
            font=('Helvetica', 10)
        )
        order_menu.pack(side='left')
        order_menu.bind('<<ComboboxSelected>>', lambda e: self.apply_order())
        
        # Área de tarjetas de recetas (scrollable)
        canvas_frame = ttk.Frame(center_frame)
        canvas_frame.pack(fill='both', expand=True, padx=20, pady=(0, 15))
        
        # Canvas con scrollbar
        self.canvas = tk.Canvas(canvas_frame, bg=self.colors['bg_light'], 
                               highlightthickness=0, borderwidth=0)
        scrollbar = ttk.Scrollbar(canvas_frame, orient='vertical', command=self.canvas.yview)
        self.scrollable_frame = ttk.Frame(self.canvas, style='TFrame')
        
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )
        
        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor='nw')
        self.canvas.configure(yscrollcommand=scrollbar.set)
        
        self.canvas.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')
        
        # Bind scroll con rueda ratón
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)
        self.canvas.bind_all("<Button-4>", self._on_mousewheel)  # Linux scroll up
        self.canvas.bind_all("<Button-5>", self._on_mousewheel)  # Linux scroll down
        
        # Bind teclas atajo
        self.root.bind('<Control-n>', lambda e: self.open_new_recipe())
        self.root.bind('<Control-f>', lambda e: search_entry.focus_set())
        self.root.bind('<Control-p>', lambda e: self.open_weekly_planner())
        self.root.bind('<Control-l>', lambda e: self.open_shopping_list())
    
    def create_bottom_bar(self):
        """Crea barra inferior con estadísticas y controles"""
        bottom_bar = ttk.Frame(self.root, style='Sidebar.TFrame')
        bottom_bar.pack(side='bottom', fill='x')
        
        # Frame izquierdo: estadísticas
        stats_frame = ttk.Frame(bottom_bar, style='Sidebar.TFrame')
        stats_frame.pack(side='left', padx=25, pady=10)
        
        self.stats_label = ttk.Label(
            stats_frame,
            text="Cargando...",
            style='Sidebar.TLabel',
            font=('Helvetica', 10)
        )
        self.stats_label.pack()
        
        # Frame derecho: controles
        controls_frame = ttk.Frame(bottom_bar, style='Sidebar.TFrame')
        controls_frame.pack(side='right', padx=25, pady=10)
        
        # Botón exportar
        export_btn = tk.Button(
            controls_frame,
            text="📤 Exportar",
            command=self.open_export_dialog,
            bg=self.colors['accent'],
            fg='white',
            font=('Helvetica', 10, 'bold'),
            relief='flat',
            padx=15,
            pady=6,
            cursor='hand2',
            bd=0,
            activebackground=ColorUtils.darken_color(self.colors['accent'], 0.1)
        )
        export_btn.pack(side='left', padx=(0, 15))
        
        # Botón backup
        backup_btn = tk.Button(
            controls_frame,
            text="💾 Backup",
            command=self.create_manual_backup,
            bg=self.colors['secondary'],
            fg=self.colors['primary'],
            font=('Helvetica', 10, 'bold'),
            relief='flat',
            padx=15,
            pady=6,
            cursor='hand2',
            bd=0,
            activebackground=ColorUtils.darken_color(self.colors['secondary'], 0.1)
        )
        backup_btn.pack(side='left')
    
    def _on_mousewheel(self, event):
        """Maneja scroll con rueda del ratón"""
        if event.num == 4:  # Linux scroll up
            self.canvas.yview_scroll(-1, "units")
        elif event.num == 5:  # Linux scroll down
            self.canvas.yview_scroll(1, "units")
        else:  # Windows/Mac
            self.canvas.yview_scroll(int(-1*(event.delta/120)), "units")
    
    def on_search_focus_in(self, entry):
        """Al hacer foco en búsqueda"""
        if entry.get() == "Buscar recetas...":
            entry.delete(0, tk.END)
            entry.config(foreground=self.colors['text_dark'])
    
    def on_search_focus_out(self, entry):
        """Al perder foco en búsqueda"""
        if not entry.get():
            entry.insert(0, "Buscar recetas...")
            entry.config(foreground='#999999')
    
    def on_search_change(self):
        """Al cambiar texto de búsqueda"""
        query = self.search_var.get().strip()
        if query == "Buscar recetas...":
            query = ""
        self.current_filters['search_text'] = query if query else None
        self.load_recipes()
    
    def apply_order(self):
        """Aplica ordenación seleccionada"""
        order_map = {
            "Recientes": "updated_at DESC",
            "Antiguas": "updated_at ASC",
            "A-Z": "title ASC",
            "Z-A": "title DESC",
            "Sabor ↑": "rating_taste ASC",
            "Sabor ↓": "rating_taste DESC",
            "Facilidad ↑": "rating_ease ASC",
            "Facilidad ↓": "rating_ease DESC",
            "Coste ↑": "rating_cost ASC",  # Barato a caro
            "Coste ↓": "rating_cost DESC",  # Caro a barato
            "Favoritos primero": "is_favorite DESC, updated_at DESC"
        }
        self.current_order = order_map.get(self.order_var.get(), "updated_at DESC")
        self.load_recipes()
    
    def load_categories(self):
        """Carga categorías en sidebar"""
        # Limpiar botones existentes de categorías (excepto los principales)
        for widget in self.sidebar.winfo_children():
            if isinstance(widget, tk.Button) and widget not in self.nav_buttons.values():
                widget_text = widget.cget('text')
                if "Añadir categoría" not in widget_text and "COCINANDO" not in widget_text:
                    widget.destroy()
        
        categories = self.db.get_all_categories()
        
        for cat in categories:
            # Saltar categorías del sistema que ya están en navegación principal
            if cat['is_system'] and cat['name'] in ["Favoritas", "Rápido (<30min)", "Para niños"]:
                continue
            
            btn = tk.Button(
                self.sidebar,
                text=f"  📌 {cat['name']}",
                command=lambda c=cat: self.filter_by_category(c['id']),
                bg='transparent',
                fg='white',
                font=('Helvetica', 10),
                relief='flat',
                anchor='w',
                padx=15,
                pady=6,
                cursor='hand2',
                bd=0,
                activebackground=ColorUtils.darken_color(self.colors['primary'], 0.1),
                activeforeground='white'
            )
            btn.pack(fill='x', pady=1)
            self.category_buttons[cat['id']] = btn
    
    def filter_by_category(self, category_id):
        """Filtra recetas por categoría"""
        self.current_filters = {'categories': [str(category_id)]}
        cat_name = next((c['name'] for c in self.db.get_all_categories() if c['id'] == category_id), "Categoría")
        self.section_title.config(text=f"Recetas: {cat_name}")
        self.load_recipes()
    
    def show_all_recipes(self):
        """Muestra todas las recetas"""
        self.current_filters = {}
        self.section_title.config(text="Todas las recetas")
        self.load_recipes()
    
    def show_favorites(self):
        """Muestra solo favoritas"""
        self.current_filters = {'favorites_only': True}
        self.section_title.config(text="❤️ Favoritas")
        self.load_recipes()
    
    def open_advanced_search(self):
        """Abre diálogo de búsqueda avanzada"""
        dialog = AdvancedSearchDialog(self.root, self.db, self)
        self.root.wait_window(dialog)
        if dialog.applied_filters:
            self.current_filters = dialog.applied_filters
            self.section_title.config(text="🔍 Resultados de búsqueda")
            self.load_recipes()
    
    def open_new_recipe(self):
        """Abre formulario para nueva receta"""
        dialog = RecipeFormDialog(self.root, self.db, None, self)
        self.root.wait_window(dialog)
        if dialog.saved:
            self.load_recipes()
            self.update_stats()
    
    def edit_recipe(self, recipe_id):
        """Abre formulario para editar receta"""
        dialog = RecipeFormDialog(self.root, self.db, recipe_id, self)
        self.root.wait_window(dialog)
        if dialog.saved:
            self.load_recipes()
    
    def toggle_favorite(self, recipe_id, event=None):
        """Alterna estado de favorito"""
        self.db.toggle_favorite(recipe_id)
        self.load_recipes()  # Recargar para actualizar UI
    
    def delete_recipe(self, recipe_id):
        """Elimina receta con confirmación"""
        if messagebox.askyesno("Confirmar eliminación", 
                             "¿Seguro que quieres eliminar esta receta?\n"
                             "Esta acción no se puede deshacer."):
            # Eliminar imagen si existe
            recipe = self.db.get_recipe_by_id(recipe_id)
            if recipe and recipe['recipe']['image_path']:
                img_path = Path(recipe['recipe']['image_path'])
                if img_path.exists():
                    try:
                        img_path.unlink()
                    except:
                        pass
            
            self.db.delete_recipe(recipe_id)
            self.load_recipes()
            self.update_stats()
            messagebox.showinfo("Éxito", "Receta eliminada correctamente")
    
    def load_recipes(self):
        """Carga y muestra recetas según filtros y orden"""
        # Limpiar tarjetas existentes
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()
        self.recipe_cards = []
        
        # Obtener recetas con filtros y orden
        recipes = self.db.get_all_recipes(
            order_by=self.current_order,
            filters=self.current_filters
        )
        
        if not recipes:
            empty_frame = ttk.Frame(self.scrollable_frame, style='TFrame')
            empty_frame.pack(pady=60)
            
            emoji_label = ttk.Label(
                empty_frame,
                text="😔",
                font=('Helvetica', 48),
                background=self.colors['bg_light']
            )
            emoji_label.pack(pady=(0, 15))
            
            empty_label = ttk.Label(
                empty_frame,
                text="No se encontraron recetas",
                font=('Helvetica', 16, 'bold'),
                foreground=self.colors['primary'],
                background=self.colors['bg_light']
            )
            empty_label.pack(pady=(0, 10))
            
            hint_label = ttk.Label(
                empty_frame,
                text="Prueba ajustando los filtros o añade una nueva receta",
                font=('Helvetica', 11),
                foreground='#888888',
                background=self.colors['bg_light']
            )
            hint_label.pack()
            return
        
        # Crear tarjetas en grid (responsive)
        window_width = self.root.winfo_width()
        cols = 3 if window_width > 1100 else (2 if window_width > 750 else 1)
        
        row = 0
        col = 0
        
        for recipe in recipes:
            card = self.create_recipe_card(dict(recipe))
            card.grid(row=row, column=col, padx=12, pady=12, sticky='nsew')
            
            col += 1
            if col >= cols:
                col = 0
                row += 1
        
        # Configurar grid weights
        for i in range(cols):
            self.scrollable_frame.columnconfigure(i, weight=1)
    
    def create_recipe_card(self, recipe):
        """Crea tarjeta visual para una receta"""
        card_frame = ttk.Frame(self.scrollable_frame, style='Card.TFrame', padding=15)
        
        # Efecto hover
        def on_enter(e):
            card_frame.configure(style='TFrame')
            card_frame.configure(highlightbackground=self.colors['accent'], 
                               highlightcolor=self.colors['accent'], 
                               highlightthickness=2)
        
        def on_leave(e):
            card_frame.configure(highlightthickness=0)
        
        card_frame.bind('<Enter>', on_enter)
        card_frame.bind('<Leave>', on_leave)
        
        # Contenedor principal
        content_frame = ttk.Frame(card_frame, style='Card.TFrame')
        content_frame.pack(fill='both', expand=True)
        
        # Foto miniatura
        img_frame = ttk.Frame(content_frame, width=100, height=100, style='Card.TFrame')
        img_frame.pack(side='left', padx=(0, 15))
        img_frame.pack_propagate(False)
        
        # Placeholder de imagen
        placeholder = ttk.Label(
            img_frame, 
            text="🥘" if not recipe.get('image_path') else "",
            font=('Helvetica', 28),
            background='#F9F5F0',
            foreground=self.colors['primary']
        )
        placeholder.place(relx=0.5, rely=0.5, anchor='center')
        
        # Contenido derecho
        right_frame = ttk.Frame(content_frame, style='Card.TFrame')
        right_frame.pack(side='left', fill='both', expand=True)
        
        # Título con favorito
        title_frame = ttk.Frame(right_frame, style='Card.TFrame')
        title_frame.pack(fill='x')
        
        # Botón favorito (corazón)
        fav_btn = tk.Label(
            title_frame,
            text="❤️" if recipe['is_favorite'] else "♡",
            font=('Helvetica', 16),
            fg=self.colors['favorite'] if recipe['is_favorite'] else '#cccccc',
            cursor='hand2',
            bg='white'
        )
        fav_btn.pack(side='left')
        fav_btn.bind('<Button-1>', lambda e, rid=recipe['id']: self.toggle_favorite(rid))
        
        # Título
        title_label = ttk.Label(
            title_frame,
            text=recipe['title'],
            style='CardTitle.TLabel',
            wraplength=350
        )
        title_label.pack(side='left', padx=(8, 0))
        
        # Rating y dificultad
        meta_frame = ttk.Frame(right_frame, style='Card.TFrame')
        meta_frame.pack(fill='x', pady=(6, 8))
        
        # Rating de sabor si existe
        if recipe['rating_taste']:
            stars = "★" * recipe['rating_taste'] + "☆" * (10 - recipe['rating_taste'])
            rating_label = ttk.Label(
                meta_frame,
                text=f"{stars} {recipe['rating_taste']}",
                style='CardMeta.TLabel',
                font=('Helvetica', 10, 'bold')
            )
            rating_label.pack(side='left', padx=(0, 15))
        
        # Dificultad
        if recipe['difficulty']:
            diff_map = {
                'principiante': ('👶', self.colors['success']),
                'intermedio': ('👨‍🍳', self.colors['warning']),
                'experto': ('👨‍🍳👨‍🍳', self.colors['favorite'])
            }
            icon, color = diff_map.get(recipe['difficulty'], ('❓', '#666666'))
            diff_label = ttk.Label(
                meta_frame,
                text=f"{icon} {recipe['difficulty']}",
                style='CardMeta.TLabel',
                foreground=color
            )
            diff_label.pack(side='left', padx=(0, 15))
        
        # Tiempo total
        total_time = (recipe['prep_time'] or 0) + (recipe['cook_time'] or 0)
        if total_time:
            time_emoji = TimeFormatter.get_time_emoji(total_time)
            time_label = ttk.Label(
                meta_frame,
                text=f"{time_emoji} {TimeFormatter.format_minutes(total_time)}",
                style='CardTime.TLabel'
            )
            time_label.pack(side='left')
        
        # Ingredientes resumen
        if recipe['ingredients_list']:
            ing_frame = ttk.Frame(right_frame, style='Card.TFrame')
            ing_frame.pack(fill='x', pady=(0, 10))
            
            ings = recipe['ingredients_list'].split(',')[:4]  # Mostrar 4 primeros
            ing_text = ", ".join([i.split(':')[0] for i in ings])
            if len(ings) > 4:
                ing_text += " + más"
            
            ing_label = ttk.Label(
                ing_frame,
                text=ing_text,
                style='CardIng.TLabel',
                wraplength=320
            )
            ing_label.pack(anchor='w')
        
        # Categorías
        if recipe['categories']:
            cat_frame = ttk.Frame(right_frame, style='Card.TFrame')
            cat_frame.pack(fill='x', pady=(5, 0))
            
            cats = recipe['categories'].split(',')[:2]  # Mostrar solo 2 primeras
            cat_text = " 🏷️ " + ", ".join(cats)
            
            cat_label = ttk.Label(
                cat_frame,
                text=cat_text,
                style='CardMeta.TLabel',
                font=('Helvetica', 9),
                foreground=self.colors['accent']
            )
            cat_label.pack(anchor='w')
        
        # Botones de acción
        btn_frame = ttk.Frame(right_frame, style='Card.TFrame')
        btn_frame.pack(fill='x', pady=(10, 0))
        
        btn_cook = tk.Button(
            btn_frame,
            text="👩‍🍳 Cocinar",
            command=lambda rid=recipe['id']: self.start_cooking(rid),
            bg=self.colors['accent'],
            fg='white',
            font=('Helvetica', 9, 'bold'),
            relief='flat',
            padx=10,
            pady=4,
            cursor='hand2',
            bd=0
        )
        btn_cook.pack(side='left', padx=(0, 8))
        
        btn_edit = tk.Button(
            btn_frame,
            text="✏️ Editar",
            command=lambda rid=recipe['id']: self.edit_recipe(rid),
            bg=self.colors['secondary'],
            fg=self.colors['primary'],
            font=('Helvetica', 9, 'bold'),
            relief='flat',
            padx=10,
            pady=4,
            cursor='hand2',
            bd=0
        )
        btn_edit.pack(side='left', padx=(0, 8))
        
        btn_delete = tk.Button(
            btn_frame,
            text="🗑️ Eliminar",
            command=lambda rid=recipe['id']: self.delete_recipe(rid),
            bg=self.colors['favorite'],
            fg='white',
            font=('Helvetica', 9, 'bold'),
            relief='flat',
            padx=10,
            pady=4,
            cursor='hand2',
            bd=0
        )
        btn_delete.pack(side='left')
        
        # Efectos hover en botones
        for btn, hover_bg in [(btn_cook, ColorUtils.darken_color(self.colors['accent'], 0.1)),
                             (btn_edit, ColorUtils.darken_color(self.colors['secondary'], 0.1)),
                             (btn_delete, ColorUtils.darken_color(self.colors['favorite'], 0.1))]:
            btn.bind('<Enter>', lambda e, b=btn, bg=hover_bg: b.config(bg=bg))
            btn.bind('<Leave>', lambda e, b=btn, bg_orig=btn.cget('bg'): b.config(bg=bg_orig))
        
        # Bind clic en toda la tarjeta para ver detalles
        for widget in [card_frame, content_frame, img_frame, right_frame, title_label, placeholder]:
            widget.bind('<Button-1>', lambda e, rid=recipe['id']: self.show_recipe_detail(rid))
            fav_btn.bind('<Button-1>', lambda e, rid=recipe['id']: self.toggle_favorite(rid))
        
        return card_frame
    
    def start_cooking(self, recipe_id):
        """Inicia proceso de cocinado (registra en historial)"""
        recipe = self.db.get_recipe_by_id(recipe_id)
        if not recipe:
            return
        
        # Diálogo para registrar preparación
        dialog = tk.Toplevel(self.root)
        dialog.title(f"Cocinando: {recipe['recipe']['title']}")
        dialog.geometry("450x350")
        dialog.transient(self.root)
        dialog.grab_set()
        
        # Centrar diálogo
        dialog.update_idletasks()
        x = (dialog.winfo_screenwidth() // 2) - (450 // 2)
        y = (dialog.winfo_screenheight() // 2) - (350 // 2)
        dialog.geometry(f"+{x}+{y}")
        
        main_frame = ttk.Frame(dialog, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text=f"👩‍🍳 Cocinando: {recipe['recipe']['title']}", 
                 font=('Helvetica', 14, 'bold'), foreground=self.colors['primary']).pack(pady=(0, 15))
        
        # Raciones preparadas
        ttk.Label(main_frame, text="Raciones preparadas:").pack(anchor='w')
        servings_var = tk.StringVar(value=str(recipe['recipe']['servings'] or 4))
        ttk.Entry(main_frame, textvariable=servings_var, width=10).pack(anchor='w', pady=(5, 15))
        
        # Notas
        ttk.Label(main_frame, text="Notas de esta preparación:").pack(anchor='w', pady=(10, 5))
        notes_text = tk.Text(main_frame, height=4, width=50, font=('Helvetica', 10))
        notes_text.pack(fill='x', pady=(0, 15))
        
        # Ratings
        rating_frame = ttk.Frame(main_frame)
        rating_frame.pack(fill='x', pady=(0, 20))
        
        ttk.Label(rating_frame, text="Sabor (1-10):").pack(side='left')
        taste_var = tk.IntVar(value=recipe['recipe']['rating_taste'] or 8)
        ttk.Spinbox(rating_frame, from_=1, to=10, textvariable=taste_var, width=5).pack(side='left', padx=10)
        
        ttk.Label(rating_frame, text="Facilidad (1-10):").pack(side='left', padx=(15, 0))
        ease_var = tk.IntVar(value=recipe['recipe']['rating_ease'] or 8)
        ttk.Spinbox(rating_frame, from_=1, to=10, textvariable=ease_var, width=5).pack(side='left', padx=10)
        
        def save_cooking():
            try:
                servings = int(servings_var.get())
            except:
                servings = recipe['recipe']['servings'] or 4
            
            notes = notes_text.get('1.0', 'end').strip()
            self.db.add_cooking_record(
                recipe_id,
                servings_made=servings,
                notes=notes,
                rating_taste=taste_var.get(),
                rating_ease=ease_var.get()
            )
            messagebox.showinfo("Éxito", "¡Buen provecho! 🍽️\nRegistro guardado correctamente.")
            dialog.destroy()
        
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(pady=(10, 0))
        
        ttk.Button(btn_frame, text="Cancelar", 
                  command=dialog.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Guardar y cocinar", 
                  command=save_cooking, style='TButton').pack(side='left', padx=5)
    
    def show_recipe_detail(self, recipe_id):
        """Muestra vista detallada de receta"""
        recipe_data = self.db.get_recipe_by_id(recipe_id)
        if not recipe_
            return
        
        recipe = recipe_data['recipe']
        
        detail_win = tk.Toplevel(self.root)
        detail_win.title(f"Receta: {recipe['title']}")
        detail_win.geometry("800x700")
        detail_win.configure(bg=self.colors['bg_light'])
        detail_win.transient(self.root)
        
        # Scrollable frame
        canvas = tk.Canvas(detail_win, bg=self.colors['bg_light'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(detail_win, orient='vertical', command=canvas.yview)
        scroll_frame = ttk.Frame(canvas, style='TFrame')
        
        scroll_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scroll_frame, anchor='nw')
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')
        
        # Contenido
        title_label = ttk.Label(
            scroll_frame,
            text=recipe['title'],
            font=('Helvetica', 22, 'bold'),
            foreground=self.colors['primary'],
            wraplength=750,
            padding=(30, 25, 30, 10)
        )
        title_label.pack(fill='x')
        
        # Metadatos
        meta_frame = ttk.Frame(scroll_frame, style='TFrame')
        meta_frame.pack(fill='x', padx=30, pady=(0, 20))
        
        # Rating
        if recipe['rating_taste']:
            stars = "★" * recipe['rating_taste'] + "☆" * (10 - recipe['rating_taste'])
            ttk.Label(meta_frame, text=f"{stars} {recipe['rating_taste']}/10", 
                     font=('Helvetica', 14, 'bold'), foreground=self.colors['accent']).pack(side='left', padx=(0, 20))
        
        # Tiempo
        total = (recipe['prep_time'] or 0) + (recipe['cook_time'] or 0)
        if total:
            ttk.Label(meta_frame, text=f"⏱️ {total} minutos", 
                     font=('Helvetica', 12)).pack(side='left', padx=(0, 20))
        
        # Raciones
        if recipe['servings']:
            ttk.Label(meta_frame, text=f"👥 {recipe['servings']} raciones", 
                     font=('Helvetica', 12)).pack(side='left', padx=(0, 20))
        
        # Dificultad
        if recipe['difficulty']:
            diff_map = {
                'principiante': '👶 Principiante',
                'intermedio': '👨‍🍳 Intermedio',
                'experto': '👨‍🍳👨‍🍳 Experto'
            }
            ttk.Label(meta_frame, text=diff_map.get(recipe['difficulty'], recipe['difficulty']), 
                     font=('Helvetica', 12), foreground=self.colors['warning']).pack(side='left')
        
        # Ingredientes
        ttk.Label(scroll_frame, text="🥗 Ingredientes", 
                 font=('Helvetica', 16, 'bold'), foreground=self.colors['accent'],
                 padding=(30, 15, 30, 10)).pack(anchor='w', fill='x')
        
        ing_list = recipe_data['ingredients']
        if ing_list:
            for ing in ing_list:
                qty = f"{ing['quantity']:g}" if ing['quantity'] % 1 != 0 else str(int(ing['quantity']))
                unit = ing['unit']
                name = ing['name']
                notes = f" ({ing['notes']})" if ing['notes'] else ""
                
                ing_text = f"• {qty} {unit} {name}{notes}"
                
                ttk.Label(scroll_frame, text=ing_text, 
                         font=('Helvetica', 11), padding=(45, 3, 30, 3)).pack(anchor='w', fill='x')
        else:
            ttk.Label(scroll_frame, text="Sin ingredientes especificados", 
                     font=('Helvetica', 11, 'italic'), padding=(45, 3, 30, 3)).pack(anchor='w', fill='x')
        
        # Instrucciones
        ttk.Label(scroll_frame, text="📝 Instrucciones", 
                 font=('Helvetica', 16, 'bold'), foreground=self.colors['accent'],
                 padding=(30, 25, 30, 10)).pack(anchor='w', fill='x')
        
        instr_frame = ttk.Frame(scroll_frame, style='TFrame')
        instr_frame.pack(fill='x', padx=30, pady=(0, 20))
        
        instr_text = tk.Text(instr_frame, wrap='word', font=('Helvetica', 12),
                           bg=self.colors['bg_light'], fg=self.colors['text_dark'],
                           relief='flat', height=10, padx=10, pady=10)
        instr_text.insert('1.0', recipe['instructions'])
        instr_text.config(state='disabled', spacing1=5, spacing2=3, spacing3=10)
        instr_text.pack(fill='x')
        
        # Notas personales
        if recipe['notes'] or recipe['alternative_recipe']:
            ttk.Label(scroll_frame, text="✨ Notas personales", 
                     font=('Helvetica', 14, 'bold'), foreground=self.colors['primary'],
                     padding=(30, 20, 30, 10)).pack(anchor='w', fill='x')
            
            if recipe['notes']:
                ttk.Label(scroll_frame, text=f"📝 {recipe['notes']}", 
                         font=('Helvetica', 11, 'italic'), padding=(45, 5, 30, 5)).pack(anchor='w', fill='x')
            
            if recipe['alternative_recipe']:
                ttk.Label(scroll_frame, text=f"💫 Variante: {recipe['alternative_recipe']}", 
                         font=('Helvetica', 11, 'italic'), padding=(45, 5, 30, 5)).pack(anchor='w', fill='x')
        
        # Botones acción
        btn_frame = ttk.Frame(scroll_frame, style='TFrame', padding=(30, 20, 30, 30))
        btn_frame.pack(fill='x')
        
        ttk.Button(btn_frame, text="Cerrar", 
                  command=detail_win.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="👩‍🍳 Cocinar ahora", 
                  command=lambda: [detail_win.destroy(), self.start_cooking(recipe_id)],
                  style='TButton').pack(side='left', padx=5)
        ttk.Button(btn_frame, text="✏️ Editar receta", 
                  command=lambda: [detail_win.destroy(), self.edit_recipe(recipe_id)],
                  style='TButton').pack(side='left', padx=5)
    
    def add_new_category(self):
        """Añade nueva categoría personalizada"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Nueva categoría")
        dialog.geometry("400x250")
        dialog.transient(self.root)
        dialog.grab_set()
        
        # Centrar
        dialog.update_idletasks()
        x = (dialog.winfo_screenwidth() // 2) - (400 // 2)
        y = (dialog.winfo_screenheight() // 2) - (250 // 2)
        dialog.geometry(f"+{x}+{y}")
        
        main_frame = ttk.Frame(dialog, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text="Nombre de la categoría:", 
                 font=('Helvetica', 11, 'bold')).pack(anchor='w', pady=(0, 5))
        
        name_var = tk.StringVar()
        name_entry = ttk.Entry(main_frame, textvariable=name_var, font=('Helvetica', 11))
        name_entry.pack(fill='x', pady=(0, 15))
        name_entry.focus_set()
        
        ttk.Label(main_frame, text="Color (HEX):", 
                 font=('Helvetica', 11, 'bold')).pack(anchor='w', pady=(0, 5))
        
        color_var = tk.StringVar(value="#8B4513")
        color_entry = ttk.Entry(main_frame, textvariable=color_var, font=('Helvetica', 11), width=15)
        color_entry.pack(anchor='w', pady=(0, 20))
        
        # Vista previa de color
        preview_frame = ttk.Frame(main_frame, width=50, height=30, relief='solid', borderwidth=1)
        preview_frame.pack(anchor='w')
        preview_frame.configure(style='TFrame')
        preview_inner = tk.Frame(preview_frame, bg=color_var.get(), width=48, height=28)
        preview_inner.place(x=1, y=1)
        
        def update_preview(*args):
            try:
                preview_inner.configure(bg=color_var.get())
            except:
                pass
        
        color_var.trace('w', update_preview)
        
        def save_category():
            name = name_var.get().strip()
            color = color_var.get().strip()
            
            if not name:
                messagebox.showerror("Error", "El nombre no puede estar vacío")
                return
            
            if not color.startswith('#'):
                color = '#' + color
            
            cat_id = self.db.add_category(name, color, is_system=0)
            if cat_id:
                self.load_categories()
                messagebox.showinfo("Éxito", f"Categoría '{name}' creada correctamente")
                dialog.destroy()
            else:
                messagebox.showerror("Error", "Ya existe una categoría con ese nombre")
        
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(pady=20, anchor='e')
        
        ttk.Button(btn_frame, text="Cancelar", 
                  command=dialog.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Crear categoría", 
                  command=save_category, style='TButton').pack(side='left', padx=5)
    
    def open_export_dialog(self):
        """Abre diálogo de exportación"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Exportar recetas")
        dialog.geometry("500x450")
        dialog.transient(self.root)
        dialog.grab_set()
        
        # Centrar
        dialog.update_idletasks()
        x = (dialog.winfo_screenwidth() // 2) - (500 // 2)
        y = (dialog.winfo_screenheight() // 2) - (450 // 2)
        dialog.geometry(f"+{x}+{y}")
        
        main_frame = ttk.Frame(dialog, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text="📤 Exportar recetas", 
                 font=('Helvetica', 16, 'bold'), foreground=self.colors['primary']).pack(pady=(0, 20))
        
        # Selección de recetas
        select_frame = ttk.LabelFrame(main_frame, text="Recetas a exportar", padding=10)
        select_frame.pack(fill='x', pady=(0, 15))
        
        self.export_all_var = tk.BooleanVar(value=True)
        ttk.Radiobutton(select_frame, text="Todas las recetas", 
                       variable=self.export_all_var, value=True).pack(anchor='w')
        
        ttk.Radiobutton(select_frame, text="Solo las seleccionadas (próximamente)", 
                       variable=self.export_all_var, value=False, state='disabled').pack(anchor='w', pady=(5, 0))
        
        # Formato
        format_frame = ttk.LabelFrame(main_frame, text="Formato de exportación", padding=10)
        format_frame.pack(fill='x', pady=(0, 15))
        
        self.export_format = tk.StringVar(value="pdf")
        formats = [
            ("📄 PDF (libro de cocina elegante)", "pdf"),
            ("📊 Excel (hojas separadas)", "excel"),
            ("📋 CSV (compatible con hojas de cálculo)", "csv"),
            ("📦 Todo (PDF + Excel + CSV)", "all")
        ]
        
        for text, value in formats:
            ttk.Radiobutton(format_frame, text=text, variable=self.export_format, 
                           value=value).pack(anchor='w', pady=3)
        
        # Opciones PDF
        pdf_frame = ttk.LabelFrame(main_frame, text="Opciones PDF", padding=10)
        pdf_frame.pack(fill='x', pady=(0, 15))
        
        self.include_photos_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(pdf_frame, text="Incluir fotos en el PDF", 
                       variable=self.include_photos_var).pack(anchor='w')
        
        # Progreso
        progress_frame = ttk.Frame(main_frame)
        progress_frame.pack(fill='x', pady=(10, 20))
        
        self.progress_var = tk.DoubleVar(value=0.0)
        progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_var, 
                                      maximum=100, style='TProgressbar')
        progress_bar.pack(fill='x')
        
        status_label = ttk.Label(progress_frame, text="", font=('Helvetica', 9))
        status_label.pack(pady=(5, 0))
        
        def do_export():
            dialog.update()
            status_label.config(text="Preparando exportación...")
            dialog.update()
            
            # Obtener recetas
            if self.export_all_var.get():
                recipes = self.db.get_all_recipes()
            else:
                recipes = []  # Implementar selección múltiple en futuro
            
            if not recipes:
                messagebox.showinfo("Información", "No hay recetas para exportar")
                return
            
            try:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                export_count = 0
                total_formats = 4 if self.export_format.get() == 'all' else 1
                
                if self.export_format.get() in ['pdf', 'all']:
                    status_label.config(text="Generando PDF...")
                    dialog.update()
                    path = export_recipes_to_pdf(
                        recipes, 
                        f"exports/recetas_{timestamp}.pdf",
                        include_photos=self.include_photos_var.get()
                    )
                    export_count += 1
                    self.progress_var.set((export_count / total_formats) * 100)
                    dialog.update()
                
                if self.export_format.get() in ['excel', 'all']:
                    status_label.config(text="Generando Excel...")
                    dialog.update()
                    path = export_recipes_to_excel(recipes, f"exports/recetas_{timestamp}.xlsx")
                    export_count += 1
                    self.progress_var.set((export_count / total_formats) * 100)
                    dialog.update()
                
                if self.export_format.get() in ['csv', 'all']:
                    status_label.config(text="Generando CSV...")
                    dialog.update()
                    path = export_recipes_to_csv(recipes, f"exports/recetas_{timestamp}.csv")
                    export_count += 1
                    self.progress_var.set((export_count / total_formats) * 100)
                    dialog.update()
                
                status_label.config(text="¡Exportación completada!")
                self.progress_var.set(100)
                dialog.update()
                
                messagebox.showinfo("Éxito", 
                                  f"Recetas exportadas correctamente.\n"
                                  f"Archivos guardados en carpeta 'exports/'.")
                dialog.destroy()
                
            except Exception as e:
                messagebox.showerror("Error", f"No se pudo exportar:\n{str(e)}")
                status_label.config(text="Error en exportación")
                self.progress_var.set(0)
        
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(pady=(10, 0), anchor='e')
        
        ttk.Button(btn_frame, text="Cancelar", 
                  command=dialog.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Exportar", 
                  command=do_export, style='TButton').pack(side='left', padx=5)
    
    def open_weekly_planner(self):
        """Abre planificador semanal"""
        dialog = WeeklyPlannerDialog(self.root, self.db, self)
        self.root.wait_window(dialog)
    
    def open_shopping_list(self):
        """Abre lista de la compra"""
        dialog = ShoppingListDialog(self.root, self.db, self)
        self.root.wait_window(dialog)
    
    def create_manual_backup(self):
        """Crea backup manual"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = Path(f"backups/backup_manual_{timestamp}.db")
            
            import shutil
            shutil.copy2("cocinando_con_papi.db", backup_path)
            
            # Mantener solo últimos 15 backups manuales
            manual_backups = sorted(
                Path("backups").glob("backup_manual_*.db"), 
                key=os.path.getmtime, 
                reverse=True
            )
            for old_backup in manual_backups[15:]:
                old_backup.unlink(missing_ok=True)
            
            messagebox.showinfo("Éxito", f"Backup creado:\n{backup_path.name}")
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo crear el backup:\n{str(e)}")
    
    def update_stats(self):
        """Actualiza estadísticas en barra inferior"""
        stats = self.db.get_stats()
        most_cooked = self.db.get_most_cooked_recipes(1)
        
        stats_text = f"📊 {stats['total_recipes']} recetas"
        if stats['favorite_recipes']:
            stats_text += f" • ❤️ {stats['favorite_recipes']} favoritas"
        if stats['average_taste'] > 0:
            stats_text += f" • ⭐ {stats['average_taste']} sabor promedio"
        if most_cooked:
            stats_text += f" • 👩‍🍳 Más cocinada: {most_cooked[0]['title']}"
        
        self.stats_label.config(text=stats_text)
    
    def on_window_resize(self, event):
        """Al redimensionar ventana, ajustar grid de tarjetas"""
        if event.widget == self.root:
            self.load_recipes()
    
    def on_closing(self):
        """Al cerrar aplicación, guardar configuración"""
        # Guardar tamaño ventana
        self.config['window_width'] = self.root.winfo_width()
        self.config['window_height'] = self.root.winfo_height()
        ConfigManager.save_config(self.config)
        
        # Confirmar salida
        if messagebox.askokcancel("Salir", 
                                 "¿Seguro que quieres salir de Cocinando con Papi?\n"
                                 "Todos tus datos están guardados automáticamente."):
            self.root.destroy()