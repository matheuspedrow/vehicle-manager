'use strict';

const url = `http://localhost:3000/veiculos`

let editId = null;
let deleteId = null;

// Funções de validação
const validacoes = {
  // Validação de placa (Mercosul e padrão antigo BR)
  placa: (value) => {
    // Padrão Mercosul: AAA0A00 ou AAA0000
    // Padrão antigo BR: AAA0000
    // Outros padrões da América do Sul são similares
    const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    return {
      valido: placaRegex.test(value.toUpperCase()),
      mensagem: 'A placa deve seguir o padrão Mercosul (ABC1D23) ou padrão antigo (ABC1234)'
    };
  },

  // Validação de chassi (17 caracteres alfanuméricos)
  chassi: (value) => {
    const chassiRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return {
      valido: chassiRegex.test(value.toUpperCase()),
      mensagem: 'O chassi deve conter 17 caracteres alfanuméricos (exceto I, O e Q)'
    };
  },

  // Validação de Renavam (11 dígitos)
  renavam: (value) => {
    const renavamRegex = /^[0-9]{11}$/;
    return {
      valido: renavamRegex.test(value),
      mensagem: 'O Renavam deve conter exatamente 11 dígitos numéricos'
    };
  },

  // Validação de modelo (mínimo 2 caracteres, máximo 50)
  modelo: (value) => {
    const modeloRegex = /^[A-Za-zÀ-ÿ0-9\s\-\.]{2,50}$/;
    return {
      valido: modeloRegex.test(value),
      mensagem: 'O modelo deve ter entre 2 e 50 caracteres'
    };
  },

  // Validação de marca (mínimo 2 caracteres, máximo 50)
  marca: (value) => {
    const marcaRegex = /^[A-Za-zÀ-ÿ0-9\s\-\.]{2,50}$/;
    return {
      valido: marcaRegex.test(value),
      mensagem: 'A marca deve ter entre 2 e 50 caracteres'
    };
  },

  // Validação de ano (entre 1900 e o ano atual + 1)
  ano: (value) => {
    const anoAtual = new Date().getFullYear();
    const anoNum = parseInt(value);
    return {
      valido: !isNaN(anoNum) && anoNum >= 1900 && anoNum <= (anoAtual + 1) && value.length === 4,
      mensagem: `O ano deve estar entre 1900 e ${anoAtual + 1} (4 dígitos)`
    };
  }
};

// Função para validar input em tempo real
function validarInput(input, tipo) {
  const valor = input.value;
  const resultado = validacoes[tipo](valor);
  
  // Remove espaços em branco
  input.value = valor.trim();
  
  // Aplica formatação específica
  if (tipo === 'placa') {
    input.value = input.value.toUpperCase();
  }
  
  // Atualiza o visual do campo
  if (valor) {
    if (resultado.valido) {
      input.style.backgroundColor = 'rgba(146, 192, 253, 0.493)';
      input.setCustomValidity('');
    } else {
      input.style.backgroundColor = 'rgba(255, 148, 148, 0.493)';
      input.setCustomValidity(resultado.mensagem);
    }
  } else {
    input.style.backgroundColor = 'rgba(146, 192, 253, 0.493)';
    input.setCustomValidity('');
  }
}

// Função para inicializar os listeners de validação
function inicializarValidacoes() {
  const campos = {
    inputPlaca: 'placa',
    inputChassi: 'chassi',
    inputRenavam: 'renavam',
    inputModelo: 'modelo',
    inputMarca: 'marca',
    inputAno: 'ano'
  };

  for (const [inputId, tipo] of Object.entries(campos)) {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', () => validarInput(input, tipo));
      input.addEventListener('blur', () => validarInput(input, tipo));
    }
  }
}

// Função para recarregar a página
function reloadPage() {
  location.reload();
}

// Funções auxiliares para mostrar modais
function showConfirmationModal(message) {
  // Fecha todos os outros modais primeiro
  $('.modal').modal('hide');
  
  // Pequeno delay para garantir que os outros modais fecharam
  setTimeout(() => {
    document.getElementById('confirmationMessage').innerText = message;
    $('#confirmationModal').modal('show');
  }, 300);
}

function showErrorModal(message) {
  document.getElementById('errorMessage').innerText = message;
  $('#errorModal').modal('show');
}

function showDeleteConfirmModal(id) {
  deleteId = id;
  $('#deleteConfirmModal').modal('show');
}

/* Exibir veiculos do DB em uma tabela HTML */
const listaVeiculos = async function () {

  const dados = await fetch(url);
  const endereco = await dados.json();

  let tbody = document.getElementById('tbody');

  tbody.innerText = '';

  for (const veiculo of endereco) {

    let tr = tbody.insertRow();

    let td_id = tr.insertCell();
    let td_placa = tr.insertCell();
    let td_chassi = tr.insertCell();
    let td_renavam = tr.insertCell();
    let td_modelo = tr.insertCell();
    let td_marca = tr.insertCell();
    let td_ano = tr.insertCell();
    let td_acoes = tr.insertCell();

    td_id.innerText = veiculo.id;
    td_placa.innerText = veiculo.placa;
    td_chassi.innerText = veiculo.chassi;
    td_renavam.innerText = veiculo.renavam;
    td_modelo.innerText = veiculo.modelo;
    td_marca.innerText = veiculo.marca;
    td_ano.innerText = veiculo.ano;

    let edit = document.createElement('button');
    edit.setAttribute('onclick', 'editar(' + JSON.stringify(veiculo) + ')');
    edit.setAttribute('data-toggle', 'modal');
    edit.setAttribute('data-target', '#ExemploModalCentralizado');
    edit.innerText = 'Editar';
    edit.classList.add('buttonEdit', 'btn', 'btn-success')
    td_acoes.appendChild(edit);

    let btnExcluir = document.createElement('button');
    btnExcluir.setAttribute('onclick', 'excluir(' + veiculo.id + ')');
    btnExcluir.innerText = 'Excluir';
    btnExcluir.classList.add('buttonExcluir', 'btn', 'btn-warning');
    td_acoes.appendChild(btnExcluir);

    console.log(veiculo)
  }
}

/* Função para cadastrar veiculo , atualizar veiculo e validação de inputs*/
function cadastrar() {
  let veiculo = lerDados();

  if (validacao(veiculo)) {
    if (editId == null) {
      addVeiculo(veiculo);
    } else {
      atualiza(editId, veiculo);
      editId = null;
    }
  }
}

/* Ler os dados dos inputs */
function lerDados() {
  let veiculo = {};

  veiculo.placa = document.getElementById('inputPlaca').value;
  veiculo.chassi = document.getElementById('inputChassi').value;
  veiculo.renavam = document.getElementById('inputRenavam').value;
  veiculo.modelo = document.getElementById('inputModelo').value;
  veiculo.marca = document.getElementById('inputMarca').value;
  veiculo.ano = document.getElementById('inputAno').value;

  return veiculo;
}

/* Valida dados dos inputs */
function validacao(veiculo) {
  let msg = '';
  let isValid = true;

  // Validar cada campo
  for (const [campo, valor] of Object.entries(veiculo)) {
    if (!valor) {
      msg += `- Digite o ${campo}\n`;
      isValid = false;
    } else {
      const resultado = validacoes[campo](valor);
      if (!resultado.valido) {
        msg += `- ${resultado.mensagem}\n`;
        isValid = false;
      }
    }
  }

  if (!isValid) {
    showErrorModal(msg);
    return false;
  }
  return true;
}

/* Adiciona veiculo no DB através da API*/
function addVeiculo(veiculo) {
  fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'asdasdasdasd': 'asdasdasd',
      },
      body: JSON.stringify({
        placa: veiculo.placa,
        chassi: veiculo.chassi,
        renavam: veiculo.renavam,
        modelo: veiculo.modelo,
        marca: veiculo.marca,
        ano: veiculo.ano,
      })
    })
    .then(() => {
      showConfirmationModal(`Veículo ${veiculo.placa} cadastrado com sucesso!`);
    })
}

/* Prepara edição preenchendo os inputs com dados do Veiculo a ser editado */
function editar(veiculo) {

  editId = veiculo.id;


  document.getElementById('TituloModalCentralizado').innerText = 'Edição'
  document.getElementById('btn-primary').innerText = 'Atualizar'

  document.getElementById('inputPlaca').value = veiculo.placa;
  document.getElementById('inputChassi').value = veiculo.chassi;
  document.getElementById('inputRenavam').value = veiculo.renavam;
  document.getElementById('inputModelo').value = veiculo.modelo;
  document.getElementById('inputMarca').value = veiculo.marca;
  document.getElementById('inputAno').value = veiculo.ano;
}

/* Atualiza dados da pessoa a ser editada no DB*/
function atualiza(id, veiculo) {
  let urlEdit = `http://localhost:3000/veiculos/${id}`;

  fetch(urlEdit, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'asdasdasdasd': 'asdasdasd',
      },
      body: JSON.stringify({
        placa: veiculo.placa,
        chassi: veiculo.chassi,
        renavam: veiculo.renavam,
        modelo: veiculo.modelo,
        marca: veiculo.marca,
        ano: veiculo.ano,
      })
    })
    .then(() => {
      showConfirmationModal(`Veículo ${veiculo.placa} atualizado com sucesso!`);
    })
}

/* Exclui os dados do Veiculo no DB e atualiza página*/
function excluir(id) {
  showDeleteConfirmModal(id);
}

// Função para confirmar exclusão
document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
  let urlDelete = `http://localhost:3000/veiculos/${deleteId}`;
  
  fetch(urlDelete, {
      method: 'DELETE'
    })
    .then(() => {
      // O showConfirmationModal já vai fechar todos os modais
      showConfirmationModal('Veículo excluído com sucesso!');
    });
});

/* Pesquisa veiculo pelo ID*/
const pesquisar = async function () {
  const pesquisa = document.getElementById('imputPesquisa').value;
  const urlPesquisa = `${url}/${pesquisa}`;

  const dados = await fetch(urlPesquisa);
  const endereco = await dados.json();

  if (pesquisa !== '') {
    for (const data of endereco) {

      const string = `ID: '${data.id}'  /  PLACA: '${data.placa}'  /  CHASSI: '${data.chassi}'  /  RENAVAM: '${data.renavam}'  /  MODELO: '${data.modelo}'  /  MARCA: '${data.marca}'  /  ANO: '${data.ano}'`
      document.getElementById('pesquisaId').innerText = string;
    }
  } else {
    document.getElementById('pesquisaId').innerText = 'endereco vazio';
  }
  document.getElementById('imputPesquisa').value = '';
}

/* Retorna os valores Default do formulário de cadastro*/
function fechar() {
  editId = null;
  document.getElementById('TituloModalCentralizado').innerText = 'Novo Cadastro'
  document.getElementById('btn-primary').innerText = 'Cadastrar'

  document.getElementById('inputPlaca').value = '';
  document.getElementById('inputChassi').value = '';
  document.getElementById('inputRenavam').value = '';
  document.getElementById('inputModelo').value = '';
  document.getElementById('inputMarca').value = '';
  document.getElementById('inputAno').value = '';
}

/* Rotarna valores Default do imput*/
function fecharSave() {
  document.getElementById('titulo').value = '';
}

/* Salva lista de veiculos em arquivo .txt*/
const salvar = async function () {
  const dados = await fetch(url);
  const data = await dados.json();
  JSON.stringify(data)
  let msg = ''
  for (const veiculo of data) {
    msg += `
    ID: '${veiculo.id}'  PLACA: '${veiculo.placa}'  CHASSI: '${veiculo.chassi}' MODELO: '${veiculo.modelo}'  MARCA: '${veiculo.marca}' ANO: '${veiculo.ano}'  /`;
  }

  let titulo = document.getElementById("titulo").value;
  let blob = new Blob([msg], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, titulo + ".txt");

  location.reload();
}

listaVeiculos();

// Inicializar validações quando o documento carregar
document.addEventListener('DOMContentLoaded', inicializarValidacoes);