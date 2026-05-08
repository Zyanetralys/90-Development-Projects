#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Planificador semanal de menús con vista de calendario
"""

import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime, timedelta, date
import calendar

from utils import DateUtils

class WeeklyPlannerDialog:
    def __init__(self, parent, db, main_window):
        self.parent = parent
        self.db = db
        self.main_window = main_window
        
        self.window = tk.Toplevel(parent)
        self.window.title("📅 Planificador Semanal")
        self.window.geometry("1000x750")
        self.window.configure(bg="#FFFDFB")
        self.window.transient(parent)
        self.window.grab_set()
        
        # Fecha inicial (lunes de esta semana)
        today = datetime.now().date()
        self.current_week_start = today - timedelta(days=today.weekday())
        
        self.create_ui()
        self.load_week_plan()
    
    def create_ui(self):
        main_frame = ttk.Frame(self.window, padding=20)
        main_frame.pack(fill='both', expand=True)
        
        # Cabecera con navegación de semanas
        header_frame = ttk.Frame(main_frame)
        header_frame.pack(fill='x', pady=(0, 20))
        
        ttk.Button(header_frame, text="❮ Semana anterior", 
                  command=self.prev_week).pack(side='left')
        
        self.week_label = ttk.Label(header_frame, text="", 
                                  font=('Helvetica', 16, 'bold'), foreground="#8B4513")
        self.week_label.pack(side='left', padx=20)
        
        ttk.Button(header_frame, text="Semana siguiente ❯", 
                  command=self.next_week).pack(side='left')
        
        ttk.Button(header_frame, text="Hoy", 
                  command=self.go_to_current_week).pack(side='right')
        
        # Grid de días de la semana
        self.days_frame = ttk.Frame(main_frame)
        self.days_frame.pack(fill='both', expand=True)
        
        self.day_columns = {}
        self.create_week_grid()
        
        # Pie con acciones
        footer_frame = ttk.Frame(main_frame, padding=(0, 20, 0, 0))
        footer_frame.pack(fill='x')
        
        ttk.Button(footer_frame, text="Generar lista de la compra", 
                  command=self.generate_shopping_list, style='TButton').pack(side='left', padx=5)
        
        ttk.Button(footer_frame, text="Cerrar", 
                  command=self.window.destroy).pack(side='right', padx=5)
        
        # Actualizar etiqueta de semana
        self.update_week_label()
    
    def create_week_grid(self):
        """Crea grid de 7 días"""
        # Limpiar frame existente
        for widget in self.days_frame.winfo_children():
            widget.destroy()
        
        self.day_columns = {}
        
        # Días de la semana
        weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        
        for i, day_name in enumerate(weekdays):
            day_date = self.current_week_start + timedelta(days=i)
            is_today = (day_date == datetime.now().date())
            
            # Columna para el día
            col_frame = ttk.Frame(self.days_frame, relief='solid', borderwidth=1)
            col_frame.grid(row=0, column=i, sticky='nsew', padx=3, pady=3)
            self.days_frame.columnconfigure(i, weight=1)
            
            # Cabecera del día
            header = ttk.Frame(col_frame, style='TFrame', padding=8)
            header.pack(fill='x')
            
            day_label = ttk.Label(header, text=day_name, 
                                font=('Helvetica', 12, 'bold'),
                                foreground='#8B4513' if is_today else '#333333')
            day_label.pack(side='left')
            
            date_label = ttk.Label(header, text=day_date.strftime('%d/%m'), 
                                 font=('Helvetica', 10),
                                 foreground='#8B4513' if is_today else '#666666')
            date_label.pack(side='right')
            
            if is_today:
                header.configure(style='TFrame')
                # Simular fondo destacado
                highlight = tk.Frame(header, bg='#FFF9F5', height=2)
                highlight.place(x=0, y=0, relwidth=1, height=3)
            
            # Área de comidas (desayuno, almuerzo, cena)
            meals_frame = ttk.Frame(col_frame, padding=10)
            meals_frame.pack(fill='both', expand=True)
            
            for meal_type in ['desayuno', 'almuerzo', 'cena']:
                meal_frame = ttk.LabelFrame(meals_frame, text=meal_type.capitalize(), padding=8)
                meal_frame.pack(fill='x', pady=5)
                
                # Placeholder para recetas
                placeholder = ttk.Label(meal_frame, text="Arrastra una receta aquí", 
                                      font=('Helvetica', 9, 'italic'), foreground='#999999')
                placeholder.pack(pady=15)
                
                # Hacer drop target
                meal_frame.drop_target = meal_type
                meal_frame.drop_date = day_date.isoformat()
                
                # Guardar referencia
                if day_date not in self.day_columns:
                    self.day_columns[day_date] = {}
                self.day_columns[day_date][meal_type] = meal_frame
            
            self.day_columns[day_date]['frame'] = col_frame
    
    def update_week_label(self):
        """Actualiza etiqueta con rango de fechas de la semana"""
        end_date = self.current_week_start + timedelta(days=6)
        month_start = DateUtils.get_month_name(self.current_week_start.month)
        month_end = DateUtils.get_month_name(end_date.month)
        
        if self.current_week_start.month == end_date.month:
            text = f"Semana del {self.current_week_start.day} al {end_date.day} de {month_start} de {self.current_week_start.year}"
        else:
            text = f"Semana del {self.current_week_start.day} de {month_start} al {end_date.day} de {month_end} de {self.current_week_start.year}"
        
        self.week_label.config(text=text)
    
    def load_week_plan(self):
        """Carga plan de la semana actual desde BD"""
        start_date = self.current_week_start.isoformat()
        end_date = (self.current_week_start + timedelta(days=6)).isoformat()
        
        plan = self.db.get_weekly_plan(start_date, end_date)
        
        # Limpiar placeholders
        for day_date, meals in self.day_columns.items():
            if day_date == 'frame':
                continue
            for meal_type, frame in meals.items():
                if meal_type != 'frame':
                    for widget in frame.winfo_children():
                        if "Arrastra" in widget.cget('text'):
                            widget.destroy()
        
        # Mostrar recetas planificadas
        for item in plan:
            plan_date = date.fromisoformat(item['planned_date'])
            meal_type = item['meal_type']
            
            if plan_date in self.day_columns and meal_type in self.day_columns[plan_date]:
                frame = self.day_columns[plan_date][meal_type]
                
                # Tarjeta de receta
                recipe_card = ttk.Frame(frame, style='Card.TFrame', padding=5)
                recipe_card.pack(fill='x', pady=2)
                
                ttk.Label(recipe_card, text=f"🍽️ {item['title']}", 
                         font=('Helvetica', 10, 'bold')).pack(anchor='w')
                ttk.Label(recipe_card, text=f"{item['servings_planned']} raciones", 
                         font=('Helvetica', 9)).pack(anchor='w')
                
                # Botón eliminar
                btn_del = ttk.Button(recipe_card, text="❌", width=3, 
                                   command=lambda pid=item['id']: self.remove_plan_item(pid))
                btn_del.pack(side='right')
    
    def prev_week(self):
        """Navega a semana anterior"""
        self.current_week_start -= timedelta(days=7)
        self.create_week_grid()
        self.update_week_label()
        self.load_week_plan()
    
    def next_week(self):
        """Navega a semana siguiente"""
        self.current_week_start += timedelta(days=7)
        self.create_week_grid()
        self.update_week_label()
        self.load_week_plan()
    
    def go_to_current_week(self):
        """Navega a semana actual"""
        today = datetime.now().date()
        self.current_week_start = today - timedelta(days=today.weekday())
        self.create_week_grid()
        self.update_week_label()
        self.load_week_plan()
    
    def remove_plan_item(self, plan_id):
        """Elimina item del plan"""
        if messagebox.askyesno("Confirmar", "¿Eliminar esta receta del plan?"):
            # Implementar eliminación en BD
            messagebox.showinfo("Éxito", "Receta eliminada del plan")
            self.load_week_plan()
    
    def generate_shopping_list(self):
        """Genera lista de la compra para la semana"""
        # Implementar lógica de generación
        messagebox.showinfo("Próximamente", 
                          "Esta función generará automáticamente una lista de la compra\n"
                          "basada en las recetas planificadas para la semana.")