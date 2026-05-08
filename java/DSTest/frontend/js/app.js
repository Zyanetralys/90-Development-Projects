/**
 * BDSM ROLE PSYCHOLOGICAL ASSESSMENT
 * Main Application Entry Point
 */

const App = {
  /**
   * Inicializa la aplicación
   */
  async init() {
    console.log('🔮 BDSM Role Psychological Assessment v2.0');
    console.log('Initializing...');
    
    // Bind all event listeners
    this.bindEvents();
    
    // Initialize assessment
    const initialized = await Assessment.init();
    
    if (initialized) {
      // Check for saved progress
      const hasProgress = Assessment.loadProgress();
      if (hasProgress) {
        console.log('Progress loaded from storage');
        this.showScreen('assessment-screen');
        Assessment.renderQuestion();
        Assessment.updateProgress();
        Assessment.updateNavigation();
      } else {
        this.showScreen('welcome-screen');
      }
    } else {
      Utils.showToast('Error al inicializar. Recarga la página.', 'error');
    }
    
    console.log('Initialization complete');
  },

  /**
   * Vincula todos los event listeners
   */
  bindEvents() {
    // Consent checkbox
    const consentCheckbox = document.getElementById('consent-checkbox');
    const startBtn = document.getElementById('start-btn');
    
    if (consentCheckbox && startBtn) {
      consentCheckbox.addEventListener('change', () => {
        startBtn.disabled = !consentCheckbox.checked;
      });
      
      startBtn.addEventListener('click', () => this.startAssessment());
    }
    
    // Answer buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const value = parseInt(e.currentTarget.dataset.value);
        this.selectAnswer(value);
      });
    });
    
    // Navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => Assessment.previous());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNext());
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('assessment-screen').classList.contains('active')) {
        if (e.key >= '1' && e.key <= '5') {
          this.selectAnswer(parseInt(e.key));
        } else if (e.key === 'ArrowLeft') {
          Assessment.previous();
        } else if (e.key === 'ArrowRight') {
          this.handleNext();
        }
      }
    });
  },

  /**
   * Muestra pantalla específica
   */
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  },

  /**
   * Inicia evaluación
   */
  async startAssessment() {
    console.log('Starting assessment...');
    this.showScreen('assessment-screen');
    Assessment.renderQuestion();
    Assessment.updateProgress();
    Assessment.updateNavigation();
  },

  /**
   * Selecciona respuesta
   */
  selectAnswer(value) {
    Assessment.setAnswer(value);
    Assessment.renderQuestion();
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (Assessment.currentIndex < Assessment.questions.length - 1) {
        Assessment.next();
      }
    }, 200);
  },

  /**
   * Maneja botón siguiente/finalizar
   */
  async handleNext() {
    const currentAnswer = Assessment.getCurrentAnswer();
    
    if (!currentAnswer) {
      Utils.showToast('Selecciona una respuesta antes de continuar', 'warning');
      return;
    }
    
    if (Assessment.currentIndex === Assessment.questions.length - 1) {
      // Finalizar evaluación
      await this.finishAssessment();
    } else {
      Assessment.next();
    }
  },

  /**
   * Finaliza evaluación y muestra resultados
   */
  async finishAssessment() {
    if (!Assessment.canFinish()) {
      const answered = Assessment.answers.filter(a => a !== null).length;
      const minimumRequired = Math.floor(Assessment.questions.length * 0.8);
      Utils.showToast(
        `Debes responder al menos ${minimumRequired} ítems (${answered} respondidos)`,
        'error'
      );
      return;
    }
    
    // Show loading screen
    this.showScreen('loading-screen');
    this.animateLoading();
    
    // Submit and get results
    const result = await Assessment.submit();
    
    if (result) {
      // Show results
      Results.show(result);
    } else {
      Utils.showToast('Error al procesar resultados', 'error');
      this.showScreen('assessment-screen');
    }
  },

  /**
   * Anima pantalla de carga
   */
  animateLoading() {
    const steps = [
      'step-validity',
      'step-scoring',
      'step-normative',
      'step-interpretation'
    ];
    
    const percentDisplay = document.getElementById('loading-percent');
    let percent = 0;
    let stepIndex = 0;
    
    const interval = setInterval(() => {
      percent += 2;
      percentDisplay.textContent = `${percent}%`;
      
      if (percent % 25 === 0 && stepIndex < steps.length) {
        document.getElementById(steps[stepIndex]).classList.add('completed');
        stepIndex++;
      }
      
      if (percent >= 100) {
        clearInterval(interval);
      }
    }, 100);
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js').catch(() => {
    //   console.log('Service Worker registration failed');
    // });
  });
}
