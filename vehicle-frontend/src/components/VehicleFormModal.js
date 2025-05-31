import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { validacoes } from '../validators/vehicleValidators';

function VehicleFormModal({ show, onHide, onSave, editingVehicle }) {
  const [formData, setFormData] = useState({
    placa: '',
    chassi: '',
    renavam: '',
    modelo: '',
    marca: '',
    ano: ''
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        placa: editingVehicle.placa || '',
        chassi: editingVehicle.chassi || '',
        renavam: editingVehicle.renavam || '',
        modelo: editingVehicle.modelo || '',
        marca: editingVehicle.marca || '',
        ano: editingVehicle.ano || ''
      });
    } else {
      setFormData({
        placa: '',
        chassi: '',
        renavam: '',
        modelo: '',
        marca: '',
        ano: ''
      });
    }
    setErrors({});
  }, [editingVehicle, show]);

  const handleChange = (field, value) => {
    let processedValue = value;
    
    if (field === 'placa') {
      processedValue = value.toUpperCase();
    }
    
    setFormData({ ...formData, [field]: processedValue });
    
    // Validar em tempo real
    if (processedValue) {
      const validation = validacoes[field](processedValue);
      if (!validation.valido) {
        setErrors({ ...errors, [field]: validation.mensagem });
      } else {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos os campos
    let hasErrors = false;
    const newErrors = {};
    
    Object.keys(formData).forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `Preencha o campo ${field}`;
        hasErrors = true;
      } else {
        const validation = validacoes[field](formData[field]);
        if (!validation.valido) {
          newErrors[field] = validation.mensagem;
          hasErrors = true;
        }
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Mostrar modal de confirmação
    setPendingData(formData);
    setShowConfirm(true);
  };

  const confirmSave = () => {
    onSave(pendingData);
    setShowConfirm(false);
    setPendingData(null);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingVehicle ? 'Editar' : 'Novo Cadastro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <Form.Group className="mb-3" style={{ width: '250px' }}>
              <Form.Control
                type="text"
                placeholder="Placa"
                value={formData.placa}
                onChange={(e) => handleChange('placa', e.target.value)}
                maxLength="7"
                isInvalid={!!errors.placa}
                style={{ height: '38px', backgroundColor: 'rgba(146, 192, 253, 0.493)' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.placa}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '250px' }}>
              <Form.Control
                type="text"
                placeholder="Chassi"
                value={formData.chassi}
                onChange={(e) => handleChange('chassi', e.target.value)}
                maxLength="17"
                isInvalid={!!errors.chassi}
                style={{ height: '38px', backgroundColor: 'rgba(146, 192, 253, 0.493)' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.chassi}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '250px' }}>
              <Form.Control
                type="text"
                placeholder="Renavam"
                value={formData.renavam}
                onChange={(e) => handleChange('renavam', e.target.value)}
                maxLength="11"
                isInvalid={!!errors.renavam}
                style={{ height: '38px', backgroundColor: 'rgba(146, 192, 253, 0.493)' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.renavam}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '250px' }}>
              <Form.Control
                type="text"
                placeholder="Modelo"
                value={formData.modelo}
                onChange={(e) => handleChange('modelo', e.target.value)}
                maxLength="50"
                isInvalid={!!errors.modelo}
                style={{ height: '38px', backgroundColor: 'rgba(146, 192, 253, 0.493)' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.modelo}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '250px' }}>
              <Form.Control
                type="text"
                placeholder="Marca"
                value={formData.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
                maxLength="50"
                isInvalid={!!errors.marca}
                style={{ height: '38px', backgroundColor: 'rgba(146, 192, 253, 0.493)' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.marca}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '250px' }}>
              <Form.Control
                type="text"
                placeholder="Ano"
                value={formData.ano}
                onChange={(e) => handleChange('ano', e.target.value)}
                maxLength="4"
                isInvalid={!!errors.ano}
                style={{ height: '38px', backgroundColor: 'rgba(146, 192, 253, 0.493)' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ano}
              </Form.Control.Feedback>
            </Form.Group>

            <Modal.Footer className="w-100">
              <Button variant="secondary" onClick={onHide}>
                Fechar
              </Button>
              <Button variant="primary" type="submit">
                {editingVehicle ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Confirmação */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton className={editingVehicle ? 'bg-info text-white' : 'bg-success text-white'}>
          <Modal.Title>
            {editingVehicle ? 'Confirmar Atualização' : 'Confirmar Cadastro'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            {editingVehicle 
              ? 'Deseja realmente atualizar os dados deste veículo?' 
              : 'Deseja realmente cadastrar este novo veículo?'}
          </p>
          {pendingData && (
            <div className="border rounded p-3 bg-light">
              <strong>Dados do Veículo:</strong>
              <ul className="mb-0 mt-2">
                <li><strong>Placa:</strong> {pendingData.placa}</li>
                <li><strong>Chassi:</strong> {pendingData.chassi}</li>
                <li><strong>Renavam:</strong> {pendingData.renavam}</li>
                <li><strong>Modelo:</strong> {pendingData.modelo}</li>
                <li><strong>Marca:</strong> {pendingData.marca}</li>
                <li><strong>Ano:</strong> {pendingData.ano}</li>
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button variant={editingVehicle ? 'info' : 'success'} onClick={confirmSave}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VehicleFormModal; 