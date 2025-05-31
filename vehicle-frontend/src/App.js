import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, Button, Alert } from 'react-bootstrap';
import Header from './components/Header';
import VehicleList from './components/VehicleList';
import VehicleFormModal from './components/VehicleFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import ExportModal from './components/ExportModal';
import VehicleService from './services/vehicleService';
import './App.css';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [confirmModal, setConfirmModal] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    variant: '', 
    onConfirm: null 
  });

  const loadVehicles = async () => {
    try {
      const data = await VehicleService.getAllVehicles();
      console.log('Veículos carregados:', data);
      setVehicles(data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      showAlert('Erro ao carregar veículos', 'danger');
    }
  };

  // Carregar veículos
  useEffect(() => {
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar veículos sempre que mudar a lista, termo de busca ou tipo de filtro
  useEffect(() => {
    filterVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, searchTerm, filterType, activeTab]);

  const filterVehicles = () => {
    let filtered = vehicles;

    // Filtrar por aba ativa
    if (activeTab === 'active') {
      filtered = filtered.filter(v => !v.checkoutDate);
    } else {
      filtered = filtered.filter(v => v.checkoutDate);
    }

    // Aplicar filtro de busca
    if (searchTerm && filterType) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle => {
        const value = vehicle[filterType];
        return value && value.toString().toLowerCase().includes(searchLower);
      });
    } else if (searchTerm && !filterType) {
      // Se há termo de busca mas nenhum filtro selecionado, buscar em todos os campos
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle => 
        Object.values(vehicle).some(value => 
          value && value.toString().toLowerCase().includes(searchLower)
        )
      );
    }

    setFilteredVehicles(filtered);
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleNewVehicle = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      show: true,
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await VehicleService.deleteVehicle(id);
          showAlert('Veículo excluído com sucesso!');
          loadVehicles();
        } catch (error) {
          showAlert('Erro ao excluir veículo', 'danger');
        }
        setConfirmModal({ ...confirmModal, show: false });
      }
    });
  };

  const handleCheckout = (id) => {
    setConfirmModal({
      show: true,
      title: 'Confirmar Saída',
      message: 'Tem certeza que deseja registrar a saída deste veículo?',
      variant: 'primary',
      onConfirm: async () => {
        try {
          await VehicleService.checkoutVehicle(id);
          showAlert('Saída registrada com sucesso!');
          loadVehicles();
        } catch (error) {
          showAlert('Erro ao registrar saída', 'danger');
        }
        setConfirmModal({ ...confirmModal, show: false });
      }
    });
  };

  const handleReturn = (id) => {
    setConfirmModal({
      show: true,
      title: 'Confirmar Retorno',
      message: 'Tem certeza que deseja retornar este veículo para a lista de ativos?',
      variant: 'success',
      onConfirm: async () => {
        try {
          await VehicleService.returnVehicle(id);
          showAlert('Veículo retornado com sucesso!');
          loadVehicles();
        } catch (error) {
          showAlert('Erro ao retornar veículo', 'danger');
        }
        setConfirmModal({ ...confirmModal, show: false });
      }
    });
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await VehicleService.updateVehicle(editingVehicle.id, {
          ...vehicleData,
          checkinDate: editingVehicle.checkinDate,
          checkoutDate: editingVehicle.checkoutDate
        });
        showAlert('Veículo atualizado com sucesso!');
      } else {
        await VehicleService.addVehicle(vehicleData);
        showAlert('Veículo cadastrado com sucesso!');
      }
      setShowForm(false);
      loadVehicles();
    } catch (error) {
      showAlert('Erro ao salvar veículo', 'danger');
    }
  };

  const getActiveVehicles = () => filteredVehicles.filter(v => !v.checkoutDate);
  const getHistoryVehicles = () => filteredVehicles.filter(v => v.checkoutDate);

  return (
    <div className="App">
      <Header 
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <main className="flex-grow-1">
        <Container className="mt-5 mb-5">
          {alert.show && (
            <Alert variant={alert.variant} dismissible onClose={() => setAlert({ ...alert, show: false })}>
              {alert.message}
            </Alert>
          )}

          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="active">Veículos Ativos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="history">Histórico de Saídas</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="active">
                <VehicleList
                  vehicles={getActiveVehicles()}
                  isActiveTab={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCheckout={handleCheckout}
                  onNewVehicle={handleNewVehicle}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="history">
                <VehicleList
                  vehicles={getHistoryVehicles()}
                  isActiveTab={false}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReturn={handleReturn}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

          <Button variant="secondary" onClick={() => setShowExportModal(true)} className="mt-3">
            EXPORTAR DADOS
          </Button>
        </Container>
      </main>

      <VehicleFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleSaveVehicle}
        editingVehicle={editingVehicle}
      />

      <ConfirmationModal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ ...confirmModal, show: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
      />

      <ExportModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        vehicles={vehicles}
      />

      <footer className="bg-dark text-white text-center py-3">
        <span>Todos os direitos reservados</span>
      </footer>
    </div>
  );
}

export default App; 