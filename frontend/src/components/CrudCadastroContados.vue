<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Pencil, Trash2, AlertTriangle } from 'lucide-vue-next'
import PopUpCadastroAgendamentos from './PopUpCadastroAgendamentos.vue'
import ToastContainer from './ToastContainer.vue'
import type { Contato } from '../types/contato'
import type { ErrosValidacao } from '../composables/useContatos'
import { useContatos } from '../composables/useContatos'
import { useToast } from '../composables/useToast'
import '../assets/crudCadastroContatos.css'

const { contatos, carregando, erro, paginacao, carregarContatos, salvarContato, excluirContato, irParaPagina, mudarPorPagina } = useContatos()
const { addToast } = useToast()

onMounted(carregarContatos)

// Popup de cadastro/edição
const popupVisivel = ref(false)
const contatoSelecionado = ref<Contato | null>(null)
const errosServidor = ref<ErrosValidacao>({})

function abrirNovo() {
  contatoSelecionado.value = null
  errosServidor.value = {}
  popupVisivel.value = true
}

function abrirEdicao(contato: Contato) {
  contatoSelecionado.value = { ...contato }
  errosServidor.value = {}
  popupVisivel.value = true
}

function fecharPopup() {
  popupVisivel.value = false
}

async function aoSalvar(dados: Contato) {
  const { ok, erros } = await salvarContato(dados)
  if (ok) {
    popupVisivel.value = false
    addToast(dados.id ? 'Contato atualizado com sucesso!' : 'Contato cadastrado com sucesso!')
  } else if (erros) {
    errosServidor.value = erros
  }
}

// Exclusão com confirmação
const contatoParaExcluir = ref<Contato | null>(null)

function solicitarExclusao(contato: Contato) {
  contatoParaExcluir.value = contato
}

function cancelarExclusao() {
  contatoParaExcluir.value = null
}

async function confirmarExclusao() {
  if (!contatoParaExcluir.value?.id) return
  const nome = contatoParaExcluir.value.nome
  const ok = await excluirContato(contatoParaExcluir.value.id)
  contatoParaExcluir.value = null
  if (ok) addToast(`O contato "${nome}" foi excluído.`, 'aviso')
}
</script>

<template>
  <div class="pagina">

    <!-- Cabeçalho -->
    <header class="cabecalho">
      <div>
        <h1>📋 Agenda de Contatos</h1>
        <p>Gerencie seus contatos de forma simples</p>
      </div>
      <button class="btn btn-primario" @click="abrirNovo">+ Novo Contato</button>
    </header>

    <!-- Estado de carregamento INICIAL (sem dados ainda) -->
    <div v-if="carregando && contatos.length === 0" class="vazio">
      <p>Carregando contatos...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="erro && contatos.length === 0" class="vazio">
      <AlertTriangle :size="40" />
      <p>{{ erro }}</p>
      <button class="btn btn-primario" @click="() => carregarContatos()">Tentar novamente</button>
    </div>

    <!-- Tabela de contatos (permanece visível durante refreshes) -->
    <div v-else class="tabela-wrapper" :class="{ 'tabela-atualizando': carregando }">
      <table v-if="contatos.length > 0" class="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th class="col-acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contato in contatos" :key="contato.id">
            <td data-label="Nome">{{ contato.nome }}</td>
            <td data-label="E-mail">{{ contato.email || '—' }}</td>
            <td data-label="Telefone">{{ contato.telefone || '—' }}</td>
            <td data-label="Endereço">{{ contato.endereco || '—' }}</td>
            <td data-label="Ações" class="col-acoes td-acoes">
              <button class="btn-acao btn-editar" @click="abrirEdicao(contato)" title="Editar">
                <Pencil :size="16" />
              </button>
              <button class="btn-acao btn-excluir" @click="solicitarExclusao(contato)" title="Excluir">
                <Trash2 :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Estado vazio -->
      <div v-else class="vazio">
        <span>😶</span>
        <p>Nenhum contato cadastrado ainda.</p>
        <button class="btn btn-primario" @click="abrirNovo">Cadastrar primeiro contato</button>
      </div>

      <!-- Paginação -->
      <div v-if="paginacao.total > 0" class="paginacao">
        <div class="por-pagina">
          <span>Exibir</span>
          <select
            :value="paginacao.porPagina"
            @change="mudarPorPagina(+($event.target as HTMLSelectElement).value)"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
          <span>por página &nbsp;·&nbsp; {{ paginacao.total }} contato(s)</span>
        </div>
        <div class="paginas" v-if="paginacao.ultimaPagina > 1">
          <button class="btn-pagina" :disabled="paginacao.paginaAtual === 1" @click="irParaPagina(paginacao.paginaAtual - 1)">‹</button>
          <span>{{ paginacao.paginaAtual }} / {{ paginacao.ultimaPagina }}</span>
          <button class="btn-pagina" :disabled="paginacao.paginaAtual === paginacao.ultimaPagina" @click="irParaPagina(paginacao.paginaAtual + 1)">›</button>
        </div>
      </div>
    </div>

  </div>

  <!-- Popup de cadastro / edição -->
  <PopUpCadastroAgendamentos
    :visivel="popupVisivel"
    :contato="contatoSelecionado"
    :erros-servidor="errosServidor"
    @salvar="aoSalvar"
    @fechar="fecharPopup"
  />

  <!-- Modal de confirmação de exclusão -->
  <Transition name="fade">
    <div v-if="contatoParaExcluir" class="overlay" @click.self="cancelarExclusao">
      <div class="modal-confirmacao">
        <h3>Excluir contato?</h3>
        <p>
          Tem certeza que deseja excluir
          <strong>{{ contatoParaExcluir.nome }}</strong>?
          Essa ação não pode ser desfeita.
        </p>
        <div class="confirmacao-acoes">
          <button class="btn btn-secundario" @click="cancelarExclusao">Cancelar</button>
          <button class="btn btn-perigo" @click="confirmarExclusao">Sim, excluir</button>
        </div>
      </div>
    </div>
  </Transition>

  <ToastContainer />
</template>

