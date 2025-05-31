#!/bin/bash

echo "🚀 Iniciando o Sistema de Gerenciamento de Veículos"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Configurar trap para limpar ao receber SIGINT (Ctrl+C)
trap cleanup INT

# Matar processos nas portas se já estiverem em uso
echo "🔄 Verificando portas..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Iniciar Backend
echo "📦 Iniciando Backend na porta 3000..."
cd vehicle-backend
npm start &
BACKEND_PID=$!

# Aguardar o backend iniciar
sleep 3

# Iniciar Frontend React
echo "⚛️  Iniciando Frontend React na porta 3001..."
cd ../vehicle-frontend
PORT=3001 npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Sistema iniciado com sucesso!"
echo ""
echo "🔗 Acesse o sistema em: http://localhost:3001"
echo ""
echo "📝 Para parar os serviços, pressione Ctrl+C"

# Manter o script rodando
wait 