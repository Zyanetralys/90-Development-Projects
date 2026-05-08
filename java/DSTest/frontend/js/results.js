/**
 * BDSM ROLE PSYCHOLOGICAL ASSESSMENT
 * Results Display Module
 */

const Results = {
  result: null,

  /**
   * Muestra pantalla de resultados
   */
  show(result) {
    this.result = result;
    this.renderPrimaryProfile();
    this.renderSecondaryProfile();
    this.renderTopRoles();
    this.renderDimensionScores();
    this.renderInterpretation();
    this.renderMetadata();
    this.checkValidity();
    
    // Show results screen
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('results-screen').classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
  },

  /**
   * Renderiza perfil primario
   */
  renderPrimaryProfile() {
    const primary = this.result.topRoles[0];
    document.getElementById('primary-role').textContent = primary.name;
    document.getElementById('primary-desc').textContent = primary.description;
    document.getElementById('primary-category').textContent = primary.category;
    document.getElementById('primary-percent').textContent = `${Math.round(primary.percentage)}%`;
  },

  /**
   * Renderiza perfil secundario
   */
  renderSecondaryProfile() {
    if (this.result.topRoles.length > 1) {
      const secondary = this.result.topRoles[1];
      document.getElementById('secondary-role').textContent = secondary.name;
      document.getElementById('secondary-desc').textContent = secondary.description;
      document.getElementById('secondary-category').textContent = secondary.category;
      document.getElementById('secondary-percent').textContent = `${Math.round(secondary.percentage)}%`;
    } else {
      document.getElementById('secondary-role').textContent = 'No determinado';
      document.getElementById('secondary-desc').textContent = '---';
      document.getElementById('secondary-category').textContent = '---';
      document.getElementById('secondary-percent').textContent = '0%';
    }
  },

  /**
   * Renderiza top 5 roles
   */
  renderTopRoles() {
    const container = document.getElementById('top-roles-list');
    container.innerHTML = '';
    
    this.result.topRoles.forEach((role, index) => {
      const item = document.createElement('div');
      item.className = 'top-role-item';
      item.innerHTML = `
        <span class="top-role-rank">#${index + 1}</span>
        <span class="top-role-name">${role.name}</span>
        <div class="top-role-bar">
          <div class="top-role-fill" style="width: ${role.percentage}%"></div>
        </div>
        <span class="top-role-percent">${Math.round(role.percentage)}%</span>
      `;
      container.appendChild(item);
    });
  },

  /**
   * Renderiza scores por dimensión
   */
  renderDimensionScores() {
    const container = document.getElementById('dimensions-chart');
    container.innerHTML = '';
    
    this.result.categoryScores.forEach(score => {
      // Convert percentage to approximate T-score
      const tScore = Math.round(score.percentage * 0.6 + 40);
      const barWidth = Math.min(100, (tScore - 30) * 1.43);
      
      const item = document.createElement('div');
      item.className = 'dimension-item';
      item.innerHTML = `
        <span class="dimension-name">${score.name}</span>
        <div class="dimension-bar-container">
          <div class="dimension-bar" style="width: ${barWidth}%"></div>
        </div>
        <span class="dimension-score">${tScore}T</span>
      `;
      container.appendChild(item);
    });
  },

  /**
   * Renderiza interpretación
   */
  renderInterpretation() {
    document.getElementById('interpretation-text').textContent = this.result.interpretation;
  },

  /**
   * Renderiza metadata
   */
  renderMetadata() {
    document.getElementById('confidence-value').textContent = `${Math.round(this.result.confidence * 100)}%`;
    document.getElementById('assessment-date').textContent = Utils.formatDate(this.result.assessmentDate);
    document.getElementById('items-answered').textContent = `${this.result.topRoles.length > 0 ? '120' : '0'}/120`;
  },

  /**
   * Verifica validez y muestra alerta si es necesario
   */
  checkValidity() {
    const alertBox = document.getElementById('validity-alert');
    
    // In a real implementation, this would check validity scales from the result
    // For now, we'll show based on confidence
    if (this.result.confidence < 0.7) {
      alertBox.style.display = 'flex';
      document.getElementById('validity-message').textContent = 
        `Nivel de confianza bajo (${Math.round(this.result.confidence * 100)}%). 
        Las escalas de validez pueden haber detectado inconsistencias.`;
    } else {
      alertBox.style.display = 'none';
    }
  },

  /**
   * Descarga resultados como PDF (texto)
   */
  downloadPDF() {
    const content = Utils.generatePDFContent(this.result);
    Utils.downloadFile(content, 'bdsm-assessment-results.txt', 'text/plain');
    Utils.showToast('Resultados descargados', 'success');
  },

  /**
   * Reinicia evaluación
   */
  restart() {
    if (confirm('¿Estás seguro de que quieres iniciar una nueva evaluación? Se perderá el progreso actual.')) {
      Assessment.clearProgress();
      location.reload();
    }
  }
};

// Bind events
document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('download-pdf-btn');
  const restartBtn = document.getElementById('restart-btn');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => Results.downloadPDF());
  }
  
  if (restartBtn) {
    restartBtn.addEventListener('click', () => Results.restart());
  }
});
