import tkinter as tk
from tkinter import ttk, messagebox
from core.funciones import export_csv, export_pdf

def run_app():
    app = tk.Tk()
    app.title("Cocinando con Papi")
    app.geometry("700x450")
    app.configure(bg="#1e1e1e")

    style = ttk.Style()
    style.theme_use("default")
    style.configure("TButton", font=("Segoe UI", 10), padding=6)
    style.configure("TLabel", background="#1e1e1e", foreground="white", font=("Segoe UI", 11))

    recetas = []

    def add_receta():
        nombre = entry_nombre.get()
        ingredientes = entry_ing.get()
        pasos = entry_pasos.get()

        if not nombre:
            messagebox.showerror("Error", "El nombre es obligatorio")
            return

        recetas.append((nombre, ingredientes, pasos))
        listbox.insert(tk.END, nombre)
        entry_nombre.delete(0, tk.END)
        entry_ing.delete(0, tk.END)
        entry_pasos.delete(0, tk.END)

    def exportar_csv():
        path = export_csv(recetas)
        messagebox.showinfo("Exportado", f"CSV creado en:\n{path}")

    def exportar_pdf():
        path = export_pdf(recetas)
        messagebox.showinfo("Exportado", f"PDF creado en:\n{path}")

    frame = tk.Frame(app, bg="#1e1e1e")
    frame.pack(pady=10)

    ttk.Label(frame, text="🍳 Cocinando con Papi").grid(row=0, column=0, columnspan=2, pady=10)

    ttk.Label(frame, text="Nombre").grid(row=1, column=0, sticky="w")
    entry_nombre = ttk.Entry(frame, width=40)
    entry_nombre.grid(row=1, column=1)

    ttk.Label(frame, text="Ingredientes").grid(row=2, column=0, sticky="w")
    entry_ing = ttk.Entry(frame, width=40)
    entry_ing.grid(row=2, column=1)

    ttk.Label(frame, text="Pasos").grid(row=3, column=0, sticky="w")
    entry_pasos = ttk.Entry(frame, width=40)
    entry_pasos.grid(row=3, column=1)

    ttk.Button(frame, text="➕ Añadir receta", command=add_receta).grid(row=4, column=1, pady=10)

    listbox = tk.Listbox(app, width=50, height=8)
    listbox.pack(pady=10)

    botones = tk.Frame(app, bg="#1e1e1e")
    botones.pack()

    ttk.Button(botones, text="📄 Exportar CSV", command=exportar_csv).grid(row=0, column=0, padx=10)
    ttk.Button(botones, text="📕 Exportar PDF", command=exportar_pdf).grid(row=0, column=1, padx=10)

    footer = ttk.Label(app, text="Marca: José Antonio Martínez Rubio")
    footer.pack(side="bottom", pady=5)

    app.mainloop()
