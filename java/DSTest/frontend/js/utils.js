/**
 * BDSM ROLE PSYCHOLOGICAL ASSESSMENT
 * Utility Functions
 */

const Utils = {
  /**
   * Formatea número con separadores de miles
   */
  formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
  },

  /**
   * Formatea fecha
   */
  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Genera ID único
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Debounce para funciones
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle para funciones
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Calcula percentil
   */
  calculatePercentile(value, array) {
    const sorted = array.slice().sort((a, b) => a - b);
    const index = sorted.findIndex(v => v >= value);
    return index === -1 ? 100 : (index / sorted.length) * 100;
  },

  /**
   * Valida email
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Sanitiza string para evitar XSS
   */
  sanitizeString(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Descarga contenido como archivo
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Convierte resultado a PDF (texto plano)
   */
  generatePDFContent(result) {
    let content = '════════════════════════════════════════════════\n';
    content += '  BDSM ROLE PSYCHOLOGICAL ASSESSMENT\n';
    content += '  Professional Profiling Tool v2.0\n';
    content += '════════════════════════════════════════════════\n\n';
    
    content += `Fecha: ${this.formatDate(result.assessmentDate)}\n`;
    content += `Confianza: ${(result.confidence * 100).toFixed(0)}%\n\n`;
    
    content += '────────────────────────────────────────────────\n';
    content += '  PERFIL PRINCIPAL\n';
    content += '────────────────────────────────────────────────\n\n';
    
    content += `ROL PRIMARIO: ${result.primaryRole}\n`;
    content += `Categoría: ${result.category}\n\n`;
    
    if (result.secondaryRole !== 'No determinado') {
      content += `ROL SECUNDARIO: ${result.secondaryRole}\n\n`;
    }
    
    content += '────────────────────────────────────────────────\n';
    content += '  TOP 5 ROLES\n';
    content += '────────────────────────────────────────────────\n\n';
    
    result.topRoles.forEach((role, index) => {
      content += `${index + 1}. ${role.name} (${Math.round(role.percentage)}%)\n`;
      content += `   ${role.description}\n\n`;
    });
    
    content += '────────────────────────────────────────────────\n';
    content += '  PUNTAJES POR DIMENSIÓN\n';
    content += '────────────────────────────────────────────────\n\n';
    
    result.categoryScores.forEach(score => {
      content += `${score.name}: ${score.score} (T-Score: ${(score.percentage * 0.6 + 40).toFixed(1)}T)\n`;
    });
    
    content += '\n────────────────────────────────────────────────\n';
    content += '  INTERPRETACIÓN CLÍNICA\n';
    content += '────────────────────────────────────────────────\n\n';
    
    content += result.interpretation;
    
    content += '\n\n════════════════════════════════════════════════\n';
    content += '  DISCLAIMER\n';
    content += '════════════════════════════════════════════════\n';
    content += 'Esta evaluación NO es un diagnóstico clínico.\n';
    content += '════════════════════════════════════════════════\n';
    
    return content;
  },

  /**
   * Muestra notificación toast
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 1rem 2rem;
      background: var(--surface);
      border: 1px solid var(--${type === 'error' ? 'error' : type === 'success' ? 'primary' : 'info'});
      border-left: 4px solid var(--${type === 'error' ? 'error' : type === 'success' ? 'primary' : 'info'});
      color: var(--text);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Guarda en localStorage
   */
  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  },

  /**
   * Lee de localStorage
   */
  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      return null;
    }
  },

  /**
   * Limpia localStorage
   */
  clearStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }
};

// Animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes borderFlow {
    0% { border-color: var(--primary-dark); }
    50% { border-color: var(--primary); }
    100% { border-color: var(--primary-dark); }
  }
  
  @keyframes textGlow {
    0%, 100% { text-shadow: 0 0 8px var(--primary-glow), 0 0 15px var(--primary-glow); }
    50% { text-shadow: 0 0 15px var(--primary-glow), 0 0 30px var(--primary-glow), 0 0 45px var(--primary-glow); }
  }
  
  @keyframes cursor {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.3; }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .toast {
    animation: slideIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);
