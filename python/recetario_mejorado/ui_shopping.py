#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lista de la compra con agrupación inteligente y exportación
"""

import tkinter as tk
from tkinter import ttk, messagebox
import csv
from pathlib import Path
from datetime import datetime

class ShoppingListDialog:
    def __init__(self, parent, db, main_window):
        self.parent = parent
        self.db = db
        self.main_window = main_window
        
        self.window = tk.Toplevel(parent)
        self.window.title("🛒 Lista de la Compra")
        self.window.geometry("900x700")
        self.window.configure(bg="#FFFDFB")
        self.window.transient(parent)
        self.window.grab_set()
        
        self.shopping_items = []
        self.load_default_items()
        
        self.create_ui()
    
    def create_ui(self):
        main_frame = ttk.Frame(self.window, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text="🛒 Lista de la Compra", 
                 font=('Helvetica', 18, 'bold'), foreground="#8B4513").pack(pady=(0, 20))
        
        # Barra de herramientas
        toolbar = ttk.Frame(main_frame)
        toolbar.pack(fill='x', pady=(0, 15))
        
        ttk.Button(toolbar, text="➕ Añadir item", 
                  command=self.add_item_dialog).pack(side='left', padx=5)
        
        ttk.Button(toolbar, text="🗑️ Limpiar lista", 
                  command=self.clear_list).pack(side='left', padx=5)
        
        ttk.Button(toolbar, text="📥 Importar CSV", 
                  command=self.import_csv).pack(side='left', padx=5)
        
        ttk.Button(toolbar, text="📤 Exportar", 
                  command=self.export_list).pack(side='right', padx=5)
        
        # Árbol con items agrupados
        columns = ('item', 'quantity', 'unit', 'notes', 'bought')
        self.tree = ttk.Treeview(main_frame, columns=columns, show='headings')
        
        self.tree.heading('item', text='Producto')
        self.tree.heading('quantity', text='Cantidad')
        self.tree.heading('unit', text='Unidad')
        self.tree.heading('notes', text='Notas')
        self.tree.heading('bought', text='✓')
        
        self.tree.column('item', width=300)
        self.tree.column('quantity', width=80, anchor='center')
        self.tree.column('unit', width=80, anchor='center')
        self.tree.column('notes', width=200)
        self.tree.column('bought', width=40, anchor='center')
        
        # Scrollbars
        vsb = ttk.Scrollbar(main_frame, orient='vertical', command=self.tree.yview)
        hsb = ttk.Scrollbar(main_frame, orient='horizontal', command=self.tree.xview)
        self.tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        self.tree.pack(side='left', fill='both', expand=True)
        vsb.pack(side='right', fill='y')
        hsb.pack(side='bottom', fill='x')
        
        # Bind doble clic para marcar como comprado
        self.tree.bind('<Double-1>', self.toggle_bought)
        
        # Cargar items
        self.load_items_to_tree()
        
        # Pie con resumen
        footer = ttk.Frame(main_frame, padding=(0, 15, 0, 0))
        footer.pack(fill='x')
        
        self.summary_label = ttk.Label(footer, text="", font=('Helvetica', 10, 'bold'))
        self.summary_label.pack(side='left')
        
        ttk.Button(footer, text="Cerrar", 
                  command=self.window.destroy).pack(side='right', padx=5)
        
        self.update_summary()
    
    def load_default_items(self):
        """Carga items por defecto para ejemplo"""
        self.shopping_items = [
            {'category': 'Frutería', 'name': 'Manzanas', 'quantity': 6, 'unit': 'unidad', 'notes': '', 'bought': False},
            {'category': 'Frutería', 'name': 'Plátanos', 'quantity': 1, 'unit': 'mano', 'notes': 'maduros', 'bought': False},
            {'category': 'Carnicería', 'name': 'Pechuga de pollo', 'quantity': 500, 'unit': 'g', 'notes': '', 'bought': False},
            {'category': 'Lácteos', 'name': 'Leche', 'quantity': 1, 'unit': 'litro', 'notes': 'entera', 'bought': False},
            {'category': 'Panadería', 'name': 'Pan integral', 'quantity': 1, 'unit': 'barra', 'notes': '', 'bought': False},
            {'category': 'Congelados', 'name': 'Espinacas', 'quantity': 300, 'unit': 'g', 'notes': '', 'bought': False},
        ]
    
    def load_items_to_tree(self):
        """Carga items en el Treeview agrupados por categoría"""
        # Limpiar
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        # Agrupar por categoría
        categories = {}
        for item in self.shopping_items:
            cat = item['category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(item)
        
        # Insertar en árbol
        for cat, items in sorted(categories.items()):
            # Categoría como padre
            cat_id = self.tree.insert('', 'end', text=cat, 
                                    values=('', '', '', f'➡️ {cat}', ''), 
                                    tags=('category',))
            
            # Items de la categoría
            for i, item in enumerate(items):
                values = (
                    item['name'],
                    f"{item['quantity']:g}" if item['quantity'] % 1 != 0 else str(int(item['quantity'])),
                    item['unit'],
                    item['notes'],
                    '✓' if item['bought'] else ''
                )
                self.tree.insert(cat_id, 'end', text=f"{cat}_{i}", values=values,
                               tags=('bought' if item['bought'] else 'not_bought',))
        
        # Configurar tags
        self.tree.tag_configure('category', font=('Helvetica', 10, 'bold'), background='#F5F0E8')
        self.tree.tag_configure('bought', foreground='#999999', font=('Helvetica', 10, 'italic'))
        self.tree.tag_configure('not_bought', foreground='#333333')
    
    def add_item_dialog(self):
        """Diálogo para añadir nuevo item"""
        dialog = tk.Toplevel(self.window)
        dialog.title("Nuevo item")
        dialog.geometry("450x350")
        dialog.transient(self.window)
        dialog.grab_set()
        
        main_frame = ttk.Frame(dialog, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text="Categoría:", font=('Helvetica', 10, 'bold')).pack(anchor='w')
        cat_var = tk.StringVar(value="Frutería")
        categories = ["Frutería", "Verdulería", "Carnicería", "Pescadería", "Lácteos", 
                     "Panadería", "Congelados", "Despensa", "Bebidas", "Limpieza"]
        ttk.Combobox(main_frame, textvariable=cat_var, values=categories, 
                   state='readonly').pack(fill='x', pady=(5, 15))
        
        ttk.Label(main_frame, text="Producto:", font=('Helvetica', 10, 'bold')).pack(anchor='w')
        name_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=name_var).pack(fill='x', pady=(5, 15))
        
        qty_frame = ttk.Frame(main_frame)
        qty_frame.pack(fill='x', pady=(0, 15))
        ttk.Label(qty_frame, text="Cantidad:").pack(side='left')
        qty_var = tk.StringVar(value="1")
        ttk.Entry(qty_frame, textvariable=qty_var, width=10).pack(side='left', padx=10)
        ttk.Label(qty_frame, text="Unidad:").pack(side='left', padx=(10, 0))
        unit_var = tk.StringVar(value="unidad")
        units = ["g", "kg", "ml", "litro", "unidad", "paquete", "bote", "tarrina"]
        ttk.Combobox(qty_frame, textvariable=unit_var, values=units, 
                   state='readonly', width=10).pack(side='left', padx=10)
        
        ttk.Label(main_frame, text="Notas (opcional):", font=('Helvetica', 10)).pack(anchor='w', pady=(0, 5))
        notes_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=notes_var).pack(fill='x')
        
        def add():
            try:
                qty = float(qty_var.get())
            except:
                qty = 1.0
            
            self.shopping_items.append({
                'category': cat_var.get(),
                'name': name_var.get().strip(),
                'quantity': qty,
                'unit': unit_var.get(),
                'notes': notes_var.get().strip(),
                'bought': False
            })
            self.load_items_to_tree()
            self.update_summary()
            dialog.destroy()
        
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(pady=20, anchor='e')
        
        ttk.Button(btn_frame, text="Cancelar", command=dialog.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Añadir", command=add, style='TButton').pack(side='left', padx=5)
    
    def toggle_bought(self, event):
        """Alterna estado de comprado al hacer doble clic"""
        item_id = self.tree.selection()
        if not item_id:
            return
        
        item_id = item_id[0]
        parent_id = self.tree.parent(item_id)
        
        # Solo afectar a items, no categorías
        if parent_id:
            # Encontrar item en lista
            cat = self.tree.item(parent_id)['values'][3].replace('➡️ ', '')
            item_name = self.tree.item(item_id)['values'][0]
            
            for item in self.shopping_items:
                if item['category'] == cat and item['name'] == item_name:
                    item['bought'] = not item['bought']
                    break
            
            self.load_items_to_tree()
            self.update_summary()
    
    def clear_list(self):
        """Limpia lista de comprados"""
        if messagebox.askyesno("Confirmar", 
                             "¿Limpiar toda la lista?\nSe mantendrán solo los items no comprados."):
            self.shopping_items = [item for item in self.shopping_items if not item['bought']]
            self.load_items_to_tree()
            self.update_summary()
    
    def update_summary(self):
        """Actualiza resumen de la lista"""
        total = len(self.shopping_items)
        bought = sum(1 for item in self.shopping_items if item['bought'])
        remaining = total - bought
        
        self.summary_label.config(
            text=f"Total: {total} items | Comprados: {bought} | Pendientes: {remaining}"
        )
    
    def import_csv(self):
        """Importa lista desde CSV"""
        path = filedialog.askopenfilename(
            title="Importar CSV",
            filetypes=[("CSV", "*.csv")]
        )
        if not path:
            return
        
        try:
            with open(path, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.shopping_items.append({
                        'category': row.get('Categoría', 'Despensa'),
                        'name': row.get('Ingrediente', ''),
                        'quantity': float(row.get('Cantidad', 1)),
                        'unit': row.get('Unidad', 'unidad'),
                        'notes': row.get('Notas', ''),
                        'bought': row.get('Comprado', 'No').lower() == 'sí'
                    })
            
            self.load_items_to_tree()
            self.update_summary()
            messagebox.showinfo("Éxito", "Lista importada correctamente")
            
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo importar:\n{str(e)}")
    
    def export_list(self):
        """Exporta lista a varios formatos"""
        dialog = tk.Toplevel(self.window)
        dialog.title("Exportar lista")
        dialog.geometry("400x250")
        dialog.transient(self.window)
        dialog.grab_set()
        
        main_frame = ttk.Frame(dialog, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        ttk.Label(main_frame, text="Formato de exportación:", 
                font=('Helvetica', 11, 'bold')).pack(anchor='w', pady=(0, 15))
        
        format_var = tk.StringVar(value="whatsapp")
        formats = [
            ("📱 WhatsApp/Telegram (texto simple)", "whatsapp"),
            ("📊 CSV (hoja de cálculo)", "csv"),
            ("📄 PDF (imprimir)", "pdf")
        ]
        
        for text, value in formats:
            ttk.Radiobutton(main_frame, text=text, variable=format_var, value=value).pack(anchor='w', pady=5)
        
        def export():
            dialog.destroy()
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            items_to_export = [item for item in self.shopping_items if not item['bought']]
            
            if format_var.get() == "whatsapp":
                text = "📋 LISTA DE LA COMPRA\n\n"
                current_cat = ""
                for item in sorted(items_to_export, key=lambda x: x['category']):
                    if item['category'] != current_cat:
                        current_cat = item['category']
                        text += f"\n🔸 {current_cat.upper()}\n"
                    qty = f"{item['quantity']:g}" if item['quantity'] % 1 != 0 else str(int(item['quantity']))
                    notes = f" ({item['notes']})" if item['notes'] else ""
                    text += f"☐ {qty} {item['unit']} {item['name']}{notes}\n"
                
                # Guardar en archivo .txt
                path = f"exports/lista_compra_{timestamp}.txt"
                Path(path).parent.mkdir(exist_ok=True)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(text)
                
                messagebox.showinfo("Éxito", 
                                  f"Lista exportada a:\n{path}\n\n"
                                  "¡Copia el texto para WhatsApp!")
            
            elif format_var.get() == "csv":
                from excel_engine import CSVEngine
                path = f"exports/lista_compra_{timestamp}.csv"
                CSVEngine.export_shopping_list(items_to_export, path)
                messagebox.showinfo("Éxito", f"Lista exportada a:\n{path}")
            
            else:  # PDF
                messagebox.showinfo("Próximamente", "Exportación a PDF en desarrollo")
        
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(pady=20, anchor='e')
        
        ttk.Button(btn_frame, text="Cancelar", command=dialog.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Exportar", command=export, style='TButton').pack(side='left', padx=5)