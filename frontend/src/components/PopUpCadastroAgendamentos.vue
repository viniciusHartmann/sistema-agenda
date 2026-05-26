<script setup lang="ts">
import { ref, watch } from 'vue'
import "../assets/popUpCadastroAgendamento.css"
import type { Contato } from '../types/contato'

const props = defineProps<{
  visivel: boolean
  contato: Contato | null
}>()

const emit = defineEmits<{
  salvar: [contato: Contato]
  fechar: []
}>()

const form = ref<Contato>({
  nome: '',
  email: '',
  telefone: '',
  endereco: '',
})

const formVazio = (): Contato => ({ nome: '', email: '', telefone: '', endereco: '' })

// Sempre que o popup ABRE (visivel muda para true), preenche ou limpa o form.
// Observar "visivel" garante que o form seja reiniciado mesmo que "contato" não mude.
watch(
  () => props.visivel,
  (aberto) => {
    if (aberto) {
      form.value = props.contato ? { ...props.contato } : formVazio()
    }
  }
)

function submitForm() {
  emit('salvar', { ...form.value })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visivel" class="overlay" @click.self="emit('fechar')">
      <div class="modal">

        <div class="modal-header">
          <h2>{{ contato?.id ? 'Editar Contato' : 'Novo Contato' }}</h2>
          <button class="btn-fechar" @click="emit('fechar')" aria-label="Fechar">✕</button>
        </div>

        <form class="form" @submit.prevent="submitForm">
          <div class="campo">
            <label for="nome">Nome <span class="obrigatorio">*</span></label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              placeholder="Nome completo"
              required
              autofocus
            />
          </div>

          <div class="campo">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="email@exemplo.com"
            />
          </div>

          <div class="campo">
            <label for="telefone">Telefone</label>
            <input
              id="telefone"
              v-model="form.telefone"
              type="tel"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div class="campo">
            <label for="endereco">Endereço</label>
            <input
              id="endereco"
              v-model="form.endereco"
              type="text"
              placeholder="Rua, número, bairro, cidade..."
            />
          </div>

          <div class="acoes">
            <button type="button" class="btn btn-secundario" @click="emit('fechar')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primario">
              {{ contato?.id ? 'Salvar alterações' : 'Cadastrar' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </Transition>
</template>
