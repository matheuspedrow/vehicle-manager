const API_URL = 'http://localhost:3000/veiculos';

// Função auxiliar para formatar data
const formatDateToMySql = (date) => {
  return date.toISOString();
};

export const VehicleService = {
  // Buscar todos os veículos
  getAllVehicles: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Erro ao buscar veículos');
      }
      const vehicles = await response.json();
      return vehicles;
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
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

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleWithDates)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao adicionar veículo');
      }
      
      const newVehicle = await response.json();
      return newVehicle;
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      throw error;
    }
  },

  // Atualizar um veículo
  updateVehicle: async (id, vehicle) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar veículo');
      }

      const updatedVehicle = await response.json();
      return updatedVehicle;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  },

  // Realizar checkout do veículo
  checkoutVehicle: async (id) => {
    try {
      // Primeiro, buscar o veículo atual
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar veículo: ${response.status}`);
      }
      
      const [vehicle] = await response.json();
      if (!vehicle) {
        throw new Error('Veículo não encontrado');
      }

      // Preparar o veículo atualizado mantendo todos os campos existentes
      const updatedVehicle = {
        ...vehicle,
        checkoutDate: formatDateToMySql(new Date())
      };

      // Enviar a atualização
      const updateResponse = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVehicle)
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Erro ao realizar checkout: ${errorText}`);
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Erro detalhado ao realizar checkout:', error);
      throw error;
    }
  },

  // Excluir um veículo
  deleteVehicle: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir veículo');
      }

      return true;
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      throw error;
    }
  },

  // Retornar veículo para ativos
  returnVehicle: async (id) => {
    try {
      // Primeiro, buscar o veículo atual
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar veículo: ${response.status}`);
      }
      
      const [vehicle] = await response.json();
      if (!vehicle) {
        throw new Error('Veículo não encontrado');
      }

      // Preparar o veículo atualizado removendo a data de checkout
      const updatedVehicle = {
        ...vehicle,
        checkoutDate: null
      };

      // Enviar a atualização
      const updateResponse = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVehicle)
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Erro ao retornar veículo: ${errorText}`);
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Erro ao retornar veículo:', error);
      throw error;
    }
  }
}; 