#!/bin/bash

# Cores para o output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens com cor
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Iniciar o backend
print_message "Iniciando o backend..."
cd vehicle-backend
npm run start:dev &
BACKEND_PID=$!

# Aguardar 2 segundos para o backend iniciar
sleep 2

# Iniciar o frontend
print_message "Iniciando o frontend..."
cd ../vehicle-frontend
live-server &
FRONTEND_PID=$!

# Função para lidar com o CTRL+C
cleanup() {
    print_message "Encerrando os serviços..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Registrar a função cleanup para ser chamada quando receber CTRL+C
trap cleanup SIGINT

# Manter o script rodando
print_message "Projeto iniciado com sucesso! Pressione CTRL+C para encerrar..."
wait 