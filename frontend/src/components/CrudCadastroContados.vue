<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Pencil, Trash2, AlertTriangle } from 'lucide-vue-next'
import PopUpCadastroAgendamentos from './PopUpCadastroAgendamentos.vue'
import type { Contato } from '../types/contato'
import { useContatos } from '../composables/useContatos'
import '../assets/crudCadastroContatos.css'

const { contatos, carregando, erro, carregarContatos, salvarContato, excluirContato } = useContatos()

// Carrega os contatos da API ao montar o componente
onMounted(carregarContatos)

// Popup de cadastro/edição
const popupVisivel = ref(false)
const contatoSelecionado = ref<Contato | null>(null)

function abrirNovo() {
  contatoSelecionado.value = null
  popupVisivel.value = true
}

function abrirEdicao(contato: Contato) {
  contatoSelecionado.value = { ...contato }
  popupVisivel.value = true
}

function fecharPopup() {
  popupVisivel.value = false
}

async function aoSalvar(dados: Contato) {
  const ok = await salvarContato(dados)
  if (ok) popupVisivel.value = false
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
  await excluirContato(contatoParaExcluir.value.id)
  contatoParaExcluir.value = null
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

    <!-- Estado de carregamento -->
    <div v-if="carregando" class="vazio">
      <p>Carregando contatos...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="erro" class="vazio">
      <AlertTriangle :size="40" />
      <p>{{ erro }}</p>
      <button class="btn btn-primario" @click="carregarContatos">Tentar novamente</button>
    </div>

    <!-- Tabela de contatos -->
    <div v-else class="tabela-wrapper">
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
    </div>

  </div>

  <!-- Popup de cadastro / edição -->
  <PopUpCadastroAgendamentos
    :visivel="popupVisivel"
    :contato="contatoSelecionado"
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
</template>

