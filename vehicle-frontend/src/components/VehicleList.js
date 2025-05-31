import React from 'react';
import { Table, Button } from 'react-bootstrap';

function VehicleList({ vehicles, isActiveTab, onEdit, onDelete, onCheckout, onReturn, onNewVehicle }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Table striped bordered hover>
      <thead className="table-dark">
        <tr>
          <th className="text-center" style={{width: '10%'}}>PLACA</th>
          <th className="text-center" style={{width: '15%'}}>CHASSI</th>
          <th className="text-center" style={{width: '12%'}}>RENAVAM</th>
          <th className="text-center" style={{width: '15%'}}>MODELO</th>
          <th className="text-center" style={{width: '13%'}}>MARCA</th>
          <th className="text-center" style={{width: '5%'}}>ANO</th>
          <th className="text-center" style={{width: '15%'}}>ENTRADA</th>
          {!isActiveTab && <th className="text-center" style={{width: '10%'}}>SAÍDA</th>}
          <th className="text-center" style={{width: isActiveTab ? '15%' : '10%'}}>
            {isActiveTab && (
              <Button 
                variant="primary" 
                onClick={onNewVehicle}
                style={{ minWidth: '140px' }}
              >
                Novo Cadastro
              </Button>
            )}
            {!isActiveTab && 'AÇÕES'}
          </th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id}>
            <td className="text-center">{vehicle.placa}</td>
            <td className="text-center">{vehicle.chassi}</td>
            <td className="text-center">{vehicle.renavam}</td>
            <td className="text-center">{vehicle.modelo}</td>
            <td className="text-center">{vehicle.marca}</td>
            <td className="text-center">{vehicle.ano}</td>
            <td className="text-center">{formatDate(vehicle.checkinDate)}</td>
            {!isActiveTab && <td className="text-center">{formatDate(vehicle.checkoutDate)}</td>}
            <td className="text-center">
              <Button 
                variant="success" 
                size="sm" 
                className="me-2"
                onClick={() => onEdit(vehicle)}
              >
                Editar
              </Button>
              
              {isActiveTab && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => onCheckout(vehicle.id)}
                >
                  Saída
                </Button>
              )}
              
              {!isActiveTab && (
                <Button 
                  variant="success" 
                  size="sm" 
                  className="me-2"
                  onClick={() => onReturn(vehicle.id)}
                >
                  Retornar
                </Button>
              )}
              
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => onDelete(vehicle.id)}
              >
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default VehicleList; 