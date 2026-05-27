import { ref } from 'vue'
import type { Contato } from '../types/contato'

// URL base da API — pode ser sobrescrita via variável de ambiente no .env do frontend
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// credentials: 'include' envia o cookie de sessão em toda requisição,
// garantindo que cada usuário veja apenas seus próprios contatos.
function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  })
}

export function useContatos() {
  const contatos = ref<Contato[]>([])
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  async function carregarContatos() {
    carregando.value = true
    erro.value = null
    try {
      const res = await apiFetch('/contatos')
      if (!res.ok) throw new Error(`Erro ao carregar contatos: ${res.status}`)
      contatos.value = await res.json()
    } catch (e) {
      erro.value = (e as Error).message
    } finally {
      carregando.value = false
    }
  }

  async function criarContato(dados: Omit<Contato, 'id'>): Promise<boolean> {
    erro.value = null
    try {
      const res = await apiFetch('/contatos', {
        method: 'POST',
        body: JSON.stringify(dados),
      })
      if (!res.ok) throw new Error(`Erro ao criar contato: ${res.status}`)
      const novo: Contato = await res.json()
      contatos.value.push(novo)
      return true
    } catch (e) {
      erro.value = (e as Error).message
      return false
    }
  }

  async function editarContato(id: number, dados: Omit<Contato, 'id'>): Promise<boolean> {
    erro.value = null
    try {
      const res = await apiFetch(`/contatos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
      })
      if (!res.ok) throw new Error(`Erro ao editar contato: ${res.status}`)
      const atualizado: Contato = await res.json()
      const index = contatos.value.findIndex((c) => c.id === id)
      if (index !== -1) contatos.value[index] = atualizado
      return true
    } catch (e) {
      erro.value = (e as Error).message
      return false
    }
  }

  async function excluirContato(id: number): Promise<boolean> {
    erro.value = null
    try {
      const res = await apiFetch(`/contatos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Erro ao excluir contato: ${res.status}`)
      contatos.value = contatos.value.filter((c) => c.id !== id)
      return true
    } catch (e) {
      erro.value = (e as Error).message
      return false
    }
  }

  // Função unificada chamada pelo popup: decide criar ou editar pelo id
  async function salvarContato(dados: Contato): Promise<boolean> {
    if (dados.id) {
      const { id, ...campos } = dados
      return editarContato(id, campos)
    }
    return criarContato(dados)
  }

  return {
    contatos,
    carregando,
    erro,
    carregarContatos,
    salvarContato,
    excluirContato,
  }
}
