export const validacoes = {
  // Validação de placa (Mercosul e padrão antigo BR)
  placa: (value) => {
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