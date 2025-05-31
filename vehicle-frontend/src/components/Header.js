import React from 'react';
import { Navbar, Form, ButtonGroup, ToggleButton, FormControl } from 'react-bootstrap';

function Header({ filterType, setFilterType, searchTerm, setSearchTerm }) {
  const filters = [
    { name: 'Placa', value: 'placa' },
    { name: 'Chassi', value: 'chassi' },
    { name: 'Renavam', value: 'renavam' },
    { name: 'Modelo', value: 'modelo' },
    { name: 'Marca', value: 'marca' },
    { name: 'Ano', value: 'ano' }
  ];

  const getPlaceholder = () => {
    if (!filterType) return "Filtrar veículos...";
    
    const placeholders = {
      placa: "Digite a placa (ABC1234)...",
      chassi: "Digite o chassi...",
      renavam: "Digite o renavam...",
      modelo: "Digite o modelo...",
      marca: "Digite a marca...",
      ano: "Digite o ano..."
    };
    return placeholders[filterType] || "Filtrar veículos...";
  };

  return (
    <Navbar bg="dark" variant="dark" className="px-5">
      <Navbar.Brand>
        <img
          src="/assets/images/logo.png"
          alt="Logo"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Form className="d-flex ms-auto">
        <ButtonGroup className="me-2">
          {filters.map((filter, idx) => (
            <ToggleButton
              key={idx}
              id={`filter-${idx}`}
              type="radio"
              variant="outline-light"
              name="filter"
              value={filter.value}
              checked={filterType === filter.value}
              onChange={(e) => setFilterType(e.currentTarget.value)}
              style={{ height: '38px' }}
            >
              {filter.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <FormControl
          type="search"
          placeholder={getPlaceholder()}
          className="me-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ minWidth: '250px', height: '38px' }}
        />
      </Form>
    </Navbar>
  );
}

export default Header; 