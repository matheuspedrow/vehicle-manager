// Função para mostrar modal de confirmação
export function showConfirmationModal(message) {
  const modal = document.getElementById('confirmationModal');
  const messageElement = document.getElementById('confirmationMessage');
  
  if (modal && messageElement) {
    messageElement.textContent = message;
    
    // Configurar o botão OK para atualizar a lista
    const okButton = modal.querySelector('.modal-footer .btn-primary');
    if (okButton) {
      okButton.onclick = () => {
        $('#confirmationModal').modal('hide');
        window.vehicleManager.listVehicles();
      };
    }
    
    // Mostrar o modal
    $('#confirmationModal').modal('show');
  }
}

// Função para mostrar modal de erro
export function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const messageElement = document.getElementById('errorMessage');
  
  if (modal && messageElement) {
    messageElement.textContent = message;
    $('#errorModal').modal('show');
  }
}

// Função para mostrar modal de confirmação de exclusão
export function showDeleteConfirmModal() {
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    // Configurar o botão de confirmação de exclusão
    const confirmButton = modal.querySelector('#confirmDeleteBtn');
    if (confirmButton) {
      confirmButton.onclick = () => {
        if (window.vehicleManager.deleteId) {
          window.vehicleManager.confirmDeletion(window.vehicleManager.deleteId);
        }
      };
    }
    
    // Mostrar o modal
    $('#deleteConfirmModal').modal('show');
  }
}

// Função para salvar arquivo
export function saveToFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename || 'veiculos'}.txt`);
} 