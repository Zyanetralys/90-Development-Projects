import os
import sys
import csv
from fpdf import FPDF

def base_path():
    try:
        return sys._MEIPASS
    except Exception:
        return os.path.abspath(".")

def export_csv(data, filename="recetas.csv"):
    path = os.path.join(base_path(), filename)

    with open(path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Nombre", "Ingredientes", "Pasos"])
        for row in data:
            writer.writerow(row)

    return path


def export_pdf(data, filename="recetas.pdf"):
    path = os.path.join(base_path(), filename)

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    for nombre, ingredientes, pasos in data:
        pdf.multi_cell(0, 8, f"🍽 {nombre}\nIngredientes: {ingredientes}\nPasos: {pasos}\n\n")

    pdf.output(path)
    return path
