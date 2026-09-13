// Camada de acesso a dados para o recurso /usuarios da API.
import apiClient from './client';

export async function changePassword(senhaAtual, novaSenha, confirmarNovaSenha) {
  await apiClient.put('/usuarios/senha', { senhaAtual, novaSenha, confirmarNovaSenha });
}
