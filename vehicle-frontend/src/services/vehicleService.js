import axios from 'axios';

const API_URL = 'http://localhost:3000/veiculos';

// Função auxiliar para formatar data
const formatDateToMySql = (date) => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().slice(0, 19).replace('T', ' ');
};

const VehicleService = {
  // Buscar todos os veículos
  getAllVehicles: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  },

  // Buscar veículos com checkout
  getVehiclesWithCheckout: async () => {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      return vehicles.filter(v => v.checkoutDate);
    } catch (error) {
      console.error('Erro ao carregar veículos com checkout:', error);
      throw error;
    }
  },

  // Buscar veículos sem checkout
  getActiveVehicles: async () => {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      return vehicles.filter(v => !v.checkoutDate);
    } catch (error) {
      console.error('Erro ao carregar veículos ativos:', error);
      throw error;
    }
  },

  // Adicionar um novo veículo
  addVehicle: async (vehicle) => {
    try {
      const vehicleWithDates = {
        ...vehicle,
        checkinDate: formatDateToMySql(new Date()),
        checkoutDate: null
      };
      const response = await axios.post(API_URL, vehicleWithDates);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      throw error;
    }
  },

  // Atualizar um veículo
  updateVehicle: async (id, vehicle) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, vehicle);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  },

  // Realizar checkout do veículo
  checkoutVehicle: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      const [vehicle] = response.data;
      
      if (!vehicle) {
        throw new Error('Veículo não encontrado');
      }

      const updatedVehicle = {
        ...vehicle,
        checkoutDate: formatDateToMySql(new Date())
      };

      const updateResponse = await axios.put(`${API_URL}/${id}`, updatedVehicle);
      return updateResponse.data;
    } catch (error) {
      console.error('Erro ao fazer checkout:', error);
      throw error;
    }
  },

  // Excluir um veículo
  deleteVehicle: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      throw error;
    }
  },

  // Retornar veículo para ativos
  returnVehicle: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      const [vehicle] = response.data;
      
      if (!vehicle) {
        throw new Error('Veículo não encontrado');
      }

      const updatedVehicle = {
        ...vehicle,
        checkoutDate: null
      };

      const updateResponse = await axios.put(`${API_URL}/${id}`, updatedVehicle);
      return updateResponse.data;
    } catch (error) {
      console.error('Erro ao retornar veículo:', error);
      throw error;
    }
  }
};

export default VehicleService; 