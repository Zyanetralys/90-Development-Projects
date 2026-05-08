import sys
import os
from ui.main_window import run_app

def resource_path(relative_path):
    """ Soporte para PyInstaller """
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

if __name__ == "__main__":
    run_app()
