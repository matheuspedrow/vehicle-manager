import { validacoes } from '../validators/vehicleValidators.js';
import { VehicleService } from '../services/vehicleService.js';
import { showConfirmationModal, showErrorModal, showDeleteConfirmModal } from '../utils/uiUtils.js';

class VehicleManager {
  constructor() {
    this.editId = null;
    this.deleteId = null;
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeEventListeners());
    } else {
      this.initializeEventListeners();
    }
  }

  // Initialize all event listeners
  initializeEventListeners() {
    // Listener for filter
    const searchInput = document.getElementById('inputSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.listVehicles(e.target.value));
    }

    // Listener for filter type change
    const filterTypeInputs = document.querySelectorAll('input[name="filterType"]');
    filterTypeInputs.forEach(input => {
      input.addEventListener('change', () => {
        const searchInput = document.getElementById('inputSearch');
        if (searchInput) {
          // Atualizar placeholder baseado no tipo de filtro
          const filterType = document.querySelector('input[name="filterType"]:checked').value;
          searchInput.placeholder = this.getPlaceholderForFilterType(filterType);
          // Reexecutar a busca com o novo tipo de filtro
          this.listVehicles(searchInput.value);
        }
      });
    });

    // Initialize form listeners
    this.initializeFormListeners();

    // Initialize close button listeners
    this.initializeCloseListeners();

    // Initialize field validations
    this.initializeValidations();

    // Initialize tab listeners
    this.initializeTabListeners();

    // Carregar lista inicial
    this.listVehicles();
  }

  // Get placeholder text based on filter type
  getPlaceholderForFilterType(filterType) {
    const placeholders = {
      todos: "Filtrar veículos...",
      placa: "Digite a placa (ABC1234)...",
      chassi: "Digite o chassi...",
      renavam: "Digite o renavam...",
      modelo: "Digite o modelo...",
      marca: "Digite a marca...",
      ano: "Digite o ano..."
    };
    return placeholders[filterType] || placeholders.todos;
  }

  // Initialize form listeners
  initializeFormListeners() {
    const form = document.getElementById('vehicleForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.save();
      });
    }

    // Adicionar listener para o botão de exportar
    const exportBtn = document.getElementById('btn-save');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToPDF());
    }
  }

  // Initialize close button listeners
  initializeCloseListeners() {
    const closeButtons = document.querySelectorAll('[data-action="close"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close());
    });
  }

  // Initialize validations
  initializeValidations() {
    const fields = {
      inputPlaca: 'placa',
      inputChassi: 'chassi',
      inputRenavam: 'renavam',
      inputModelo: 'modelo',
      inputMarca: 'marca',
      inputAno: 'ano'
    };

    for (const [inputId, type] of Object.entries(fields)) {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', () => this.validateInput(input, type));
        input.addEventListener('blur', () => this.validateInput(input, type));
      }
    }
  }

  // Validate input
  validateInput(input, type) {
    const value = input.value;
    const result = validacoes[type](value);
    
    input.value = value.trim();
    
    if (type === 'placa') {
      input.value = input.value.toUpperCase();
    }
    
    if (value) {
      if (result.valido) {
        input.style.backgroundColor = 'rgba(146, 192, 253, 0.493)';
        input.setCustomValidity('');
      } else {
        input.style.backgroundColor = 'rgba(255, 148, 148, 0.493)';
        input.setCustomValidity(result.mensagem);
      }
    } else {
      input.style.backgroundColor = 'rgba(146, 192, 253, 0.493)';
      input.setCustomValidity('');
    }
  }

  // Initialize tab listeners
  initializeTabListeners() {
    const activeTab = document.getElementById('active-tab');
    const historyTab = document.getElementById('history-tab');

    if (activeTab) {
      activeTab.addEventListener('click', () => this.listActiveVehicles());
    }

    if (historyTab) {
      historyTab.addEventListener('click', () => this.listVehiclesHistory());
    }
  }

  // List active vehicles
  async listActiveVehicles() {
    try {
      const vehicles = await VehicleService.getActiveVehicles();
      this.renderActiveTable(vehicles);
    } catch (error) {
      console.error('Erro ao listar veículos ativos:', error);
      showErrorModal('Erro ao carregar a lista de veículos ativos.');
    }
  }

  // List vehicles history
  async listVehiclesHistory() {
    try {
      const vehicles = await VehicleService.getVehiclesWithCheckout();
      this.renderHistoryTable(vehicles);
    } catch (error) {
      console.error('Erro ao listar histórico de veículos:', error);
      showErrorModal('Erro ao carregar o histórico de veículos.');
    }
  }

  // Format date
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  // Render active vehicles table
  renderActiveTable(vehicles) {
    const tbody = document.getElementById('tbodyActive');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    vehicles.forEach(vehicle => {
      const row = tbody.insertRow();

      // Criar células
      const cells = {
        placa: row.insertCell(),
        chassi: row.insertCell(),
        renavam: row.insertCell(),
        modelo: row.insertCell(),
        marca: row.insertCell(),
        ano: row.insertCell(),
        entrada: row.insertCell(),
        actions: row.insertCell()
      };

      // Preencher dados
      cells.placa.textContent = vehicle.placa;
      cells.chassi.textContent = vehicle.chassi;
      cells.renavam.textContent = vehicle.renavam;
      cells.modelo.textContent = vehicle.modelo;
      cells.marca.textContent = vehicle.marca;
      cells.ano.textContent = vehicle.ano;
      cells.entrada.textContent = this.formatDate(vehicle.checkinDate);

      // Criar botões de ação
      const editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.className = 'buttonEdit btn btn-success mr-2';
      editButton.addEventListener('click', () => {
        this.edit(vehicle);
        $('#ExemploModalCentralizado').modal('show');
      });

      const checkoutButton = document.createElement('button');
      checkoutButton.textContent = 'Saída';
      checkoutButton.className = 'btn btn-primary mr-2';
      checkoutButton.addEventListener('click', () => this.checkout(vehicle.id));

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.className = 'buttonExcluir btn btn-danger';
      deleteButton.addEventListener('click', () => this.delete(vehicle.id));

      cells.actions.appendChild(editButton);
      cells.actions.appendChild(checkoutButton);
      cells.actions.appendChild(deleteButton);
    });
  }

  // Render history table
  renderHistoryTable(vehicles) {
    const tbody = document.getElementById('tbodyHistory');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    vehicles.forEach(vehicle => {
      const row = tbody.insertRow();

      // Criar células
      const cells = {
        placa: row.insertCell(),
        chassi: row.insertCell(),
        renavam: row.insertCell(),
        modelo: row.insertCell(),
        marca: row.insertCell(),
        ano: row.insertCell(),
        entrada: row.insertCell(),
        saida: row.insertCell(),
        actions: row.insertCell()
      };

      // Preencher dados
      cells.placa.textContent = vehicle.placa;
      cells.chassi.textContent = vehicle.chassi;
      cells.renavam.textContent = vehicle.renavam;
      cells.modelo.textContent = vehicle.modelo;
      cells.marca.textContent = vehicle.marca;
      cells.ano.textContent = vehicle.ano;
      cells.entrada.textContent = this.formatDate(vehicle.checkinDate);
      cells.saida.textContent = this.formatDate(vehicle.checkoutDate);

      // Criar botões de ação
      const returnButton = document.createElement('button');
      returnButton.textContent = 'Retornar';
      returnButton.className = 'btn btn-success mr-2';
      returnButton.addEventListener('click', () => this.returnVehicle(vehicle.id));

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.className = 'buttonExcluir btn btn-danger';
      deleteButton.addEventListener('click', () => this.delete(vehicle.id));

      cells.actions.appendChild(returnButton);
      cells.actions.appendChild(deleteButton);
    });
  }

  // Checkout vehicle
  async checkout(id) {
    this.checkoutId = id;
    $('#checkoutConfirmModal').modal('show');

    // Configurar o botão de confirmação
    const confirmBtn = document.getElementById('confirmCheckoutBtn');
    confirmBtn.onclick = async () => {
      try {
        $('#checkoutConfirmModal').modal('hide');
        await VehicleService.checkoutVehicle(this.checkoutId);
        showConfirmationModal('Saída do veículo registrada com sucesso!');
        await this.listActiveVehicles();
        await this.listVehiclesHistory();
      } catch (error) {
        console.error('Erro ao registrar saída:', error);
        showErrorModal('Erro ao registrar saída do veículo.');
      }
    };
  }

  // List vehicles (override)
  async listVehicles(searchTerm = '') {
    try {
      let vehicles;
      const activeTab = document.querySelector('#active-tab.active');
      
      // Buscar veículos baseado na aba ativa
      if (activeTab) {
        vehicles = await VehicleService.getActiveVehicles();
      } else {
        vehicles = await VehicleService.getVehiclesWithCheckout();
      }

      // Aplicar filtro se houver termo de busca
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        const filterType = document.querySelector('input[name="filterType"]:checked').value;

        vehicles = vehicles.filter(vehicle => {
          if (filterType === 'todos') {
            return (
              vehicle.placa.toLowerCase().includes(searchTermLower) ||
              vehicle.chassi.toLowerCase().includes(searchTermLower) ||
              vehicle.renavam.toLowerCase().includes(searchTermLower) ||
              vehicle.modelo.toLowerCase().includes(searchTermLower) ||
              vehicle.marca.toLowerCase().includes(searchTermLower) ||
              vehicle.ano.toString().includes(searchTermLower)
            );
          } else {
            // Filtrar apenas pelo campo selecionado
            const value = vehicle[filterType]?.toString().toLowerCase() || '';
            return value.includes(searchTermLower);
          }
        });
      }

      // Renderizar a tabela apropriada
      if (activeTab) {
        this.renderActiveTable(vehicles);
      } else {
        this.renderHistoryTable(vehicles);
      }
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      showErrorModal('Erro ao carregar a lista de veículos.');
    }
  }

  // Read form data
  readFormData() {
    const formData = {
      placa: document.getElementById('inputPlaca').value,
      chassi: document.getElementById('inputChassi').value,
      renavam: document.getElementById('inputRenavam').value,
      modelo: document.getElementById('inputModelo').value,
      marca: document.getElementById('inputMarca').value,
      ano: document.getElementById('inputAno').value
    };

    // Se estiver editando, manter as datas do veículo original
    if (this.editId !== null && this.currentVehicle) {
      formData.checkinDate = this.currentVehicle.checkinDate;
      formData.checkoutDate = this.currentVehicle.checkoutDate;
    }

    return formData;
  }

  // Validate data
  validate(vehicle) {
    let message = '';
    let isValid = true;

    // Campos que precisam ser validados
    const fieldsToValidate = ['placa', 'chassi', 'renavam', 'modelo', 'marca', 'ano'];

    for (const field of fieldsToValidate) {
      const value = vehicle[field];
      if (!value) {
        message += `- Preencha o campo ${field}\n`;
        isValid = false;
      } else {
        const result = validacoes[field](value);
        if (!result.valido) {
          message += `- ${result.mensagem}\n`;
          isValid = false;
        }
      }
    }

    if (!isValid) {
      showErrorModal(message);
      return false;
    }
    return true;
  }

  // Register or update vehicle
  async save() {
    try {
      const vehicle = this.readFormData();

      if (this.validate(vehicle)) {
        if (this.editId === null) {
          await VehicleService.addVehicle(vehicle);
          showConfirmationModal('Veículo cadastrado com sucesso!');
        } else {
          await VehicleService.updateVehicle(this.editId, vehicle);
          showConfirmationModal('Veículo atualizado com sucesso!');
          this.editId = null;
        }
        
        // Fechar o modal de cadastro usando jQuery
        $('#ExemploModalCentralizado').modal('hide');
        
        // Limpar o formulário
        this.close();
        
        // Atualizar a lista
        await this.listVehicles();
      }
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      showErrorModal('Erro ao salvar o veículo. Por favor, tente novamente.');
    }
  }

  // Prepare edit
  edit(vehicle) {
    this.editId = vehicle.id;
    this.currentVehicle = vehicle; // Guardar o veículo atual para manter as datas
    document.getElementById('TituloModalCentralizado').innerText = 'Editar';
    document.getElementById('btn-primary').innerText = 'Atualizar';

    document.getElementById('inputPlaca').value = vehicle.placa;
    document.getElementById('inputChassi').value = vehicle.chassi;
    document.getElementById('inputRenavam').value = vehicle.renavam;
    document.getElementById('inputModelo').value = vehicle.modelo;
    document.getElementById('inputMarca').value = vehicle.marca;
    document.getElementById('inputAno').value = vehicle.ano;

    // Abrir o modal usando jQuery
    $('#ExemploModalCentralizado').modal('show');
  }

  // Delete vehicle
  delete(id) {
    this.deleteId = id;
    showDeleteConfirmModal();
  }

  // Confirm deletion
  async confirmDeletion(id) {
    try {
      await VehicleService.deleteVehicle(id);
      
      // Fechar o modal de confirmação de exclusão
      $('#deleteConfirmModal').modal('hide');
      
      showConfirmationModal('Veículo excluído com sucesso!');
      
      // Atualizar a lista
      await this.listVehicles();
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      showErrorModal('Erro ao excluir o veículo. Por favor, tente novamente.');
    }
  }

  // Close registration/edit modal
  close() {
    this.editId = null;
    this.currentVehicle = null; // Limpar o veículo atual
    document.getElementById('TituloModalCentralizado').innerText = 'New Registration';
    document.getElementById('btn-primary').innerText = 'Register';

    document.getElementById('inputPlaca').value = '';
    document.getElementById('inputChassi').value = '';
    document.getElementById('inputRenavam').value = '';
    document.getElementById('inputModelo').value = '';
    document.getElementById('inputMarca').value = '';
    document.getElementById('inputAno').value = '';
  }

  // Return vehicle to active
  async returnVehicle(id) {
    this.returnId = id;
    $('#returnConfirmModal').modal('show');

    // Configurar o botão de confirmação
    const confirmBtn = document.getElementById('confirmReturnBtn');
    confirmBtn.onclick = async () => {
      try {
        $('#returnConfirmModal').modal('hide');
        await VehicleService.returnVehicle(this.returnId);
        showConfirmationModal('Veículo retornado com sucesso!');
        await this.listActiveVehicles();
        await this.listVehiclesHistory();
      } catch (error) {
        console.error('Erro ao retornar veículo:', error);
        showErrorModal('Erro ao retornar o veículo.');
      }
    };
  }

  // Export to PDF
  async exportToPDF() {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      
      // Criar novo documento PDF usando o objeto global jsPDF
      const doc = new window.jspdf.jsPDF();
      
      // Configurar título
      doc.setFontSize(16);
      doc.text('Relatório de Veículos', 14, 15);
      
      // Preparar dados para a tabela
      const headers = [['ID', 'Placa', 'Chassi', 'Renavam', 'Modelo', 'Marca', 'Ano', 'Data Entrada', 'Data Saída']];
      
      const data = vehicles.map(vehicle => [
        vehicle.id,
        vehicle.placa,
        vehicle.chassi,
        vehicle.renavam,
        vehicle.modelo,
        vehicle.marca,
        vehicle.ano,
        vehicle.checkinDate ? new Date(vehicle.checkinDate).toLocaleDateString('pt-BR') : '',
        vehicle.checkoutDate ? new Date(vehicle.checkoutDate).toLocaleDateString('pt-BR') : ''
      ]);
      
      // Gerar tabela
      doc.autoTable({
        head: headers,
        body: data,
        startY: 25,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'center'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });
      
      // Salvar o PDF
      doc.save('relatorio-veiculos.pdf');
      
      // Fechar o modal usando jQuery
      $('#Modal-Save').modal('hide');
      
      showConfirmationModal('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      showErrorModal('Erro ao gerar o relatório PDF. Por favor, tente novamente.');
    }
  }
}

// Export single instance
export const vehicleManager = new VehicleManager(); 