import { ref } from 'vue'
import type { Contato } from '../types/contato'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

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

export type ErrosValidacao = Record<string, string[]>

export interface ResultadoSalvar {
  ok: boolean
  erros?: ErrosValidacao
}

export interface Paginacao {
  paginaAtual: number
  ultimaPagina: number
  total: number
  porPagina: number
}

export function useContatos() {
  const contatos = ref<Contato[]>([])
  const carregando = ref(false)
  const erro = ref<string | null>(null)
  const paginacao = ref<Paginacao>({ paginaAtual: 1, ultimaPagina: 1, total: 0, porPagina: 5 })

  async function carregarContatos(
    pagina = paginacao.value.paginaAtual,
    porPagina = paginacao.value.porPagina,
  ) {
    carregando.value = true
    erro.value = null
    try {
      const res = await apiFetch(`/contatos?pagina=${pagina}&por_pagina=${porPagina}`)
      if (!res.ok) throw new Error(`Erro ao carregar contatos: ${res.status}`)
      const dados = await res.json()
      contatos.value = dados.data
      paginacao.value = {
        paginaAtual: dados.current_page,
        ultimaPagina: dados.last_page,
        total: dados.total,
        porPagina: dados.per_page,
      }
    } catch (e) {
      erro.value = (e as Error).message
    } finally {
      carregando.value = false
    }
  }

  async function parsarErros422(res: Response): Promise<ErrosValidacao> {
    const corpo = await res.json()
    return corpo.errors ?? {}
  }

  async function criarContato(dados: Omit<Contato, 'id'>): Promise<ResultadoSalvar> {
    try {
      const res = await apiFetch('/contatos', { method: 'POST', body: JSON.stringify(dados) })
      if (res.status === 422) return { ok: false, erros: await parsarErros422(res) }
      if (!res.ok) throw new Error(`Erro ao criar contato: ${res.status}`)
      await carregarContatos(1, paginacao.value.porPagina)
      return { ok: true }
    } catch (e) {
      erro.value = (e as Error).message
      return { ok: false }
    }
  }

  async function editarContato(id: number, dados: Omit<Contato, 'id'>): Promise<ResultadoSalvar> {
    try {
      const res = await apiFetch(`/contatos/${id}`, { method: 'PUT', body: JSON.stringify(dados) })
      if (res.status === 422) return { ok: false, erros: await parsarErros422(res) }
      if (!res.ok) throw new Error(`Erro ao editar contato: ${res.status}`)
      await carregarContatos()
      return { ok: true }
    } catch (e) {
      erro.value = (e as Error).message
      return { ok: false }
    }
  }

  async function excluirContato(id: number): Promise<boolean> {
    try {
      const res = await apiFetch(`/contatos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Erro ao excluir contato: ${res.status}`)
      // Se excluiu o último da página, volta uma página
      const ultimoDaPagina = contatos.value.length === 1 && paginacao.value.paginaAtual > 1
      await carregarContatos(
        ultimoDaPagina ? paginacao.value.paginaAtual - 1 : paginacao.value.paginaAtual,
        paginacao.value.porPagina,
      )
      return true
    } catch (e) {
      erro.value = (e as Error).message
      return false
    }
  }

  async function salvarContato(dados: Contato): Promise<ResultadoSalvar> {
    if (dados.id) {
      const { id, ...campos } = dados
      return editarContato(id, campos)
    }
    return criarContato(dados)
  }

  function irParaPagina(pagina: number) {
    carregarContatos(pagina, paginacao.value.porPagina)
  }

  function mudarPorPagina(porPagina: number) {
    carregarContatos(1, porPagina)
  }

  return {
    contatos,
    carregando,
    erro,
    paginacao,
    carregarContatos,
    salvarContato,
    excluirContato,
    irParaPagina,
    mudarPorPagina,
  }
}
