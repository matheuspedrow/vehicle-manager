import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function ExportModal({ show, onHide, vehicles }) {
  const handleExport = () => {
    const doc = new jsPDF();
    
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
    autoTable(doc, {
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
    
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Exportar Lista em PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Clique em "Exportar" para gerar um relatório em PDF com todos os veículos.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleExport}>
          Exportar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExportModal; 