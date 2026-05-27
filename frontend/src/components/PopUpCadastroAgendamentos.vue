<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import "../assets/popUpCadastroAgendamento.css"
import type { Contato } from '../types/contato'

import type { ErrosValidacao } from '../composables/useContatos'

const props = defineProps<{
  visivel: boolean
  contato: Contato | null
  errosServidor?: ErrosValidacao
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

watch(
  () => props.errosServidor,
  (erros) => {
    if (erros && Object.keys(erros).length > 0) {
      enviando.value = false
    }
  }
)

// Sempre que o popup ABRE (visivel muda para true), preenche ou limpa o form.
// Observar "visivel" garante que o form seja reiniciado mesmo que "contato" não mude.
watch(
  () => props.visivel,
  (aberto) => {
    if (aberto) {
      form.value = props.contato ? { ...props.contato } : formVazio()
      enviando.value = false
    }
  }
)

const enviando = ref(false)

const telefoneErro = computed(() => {
  const digitos = form.value.telefone.replace(/\D/g, '')
  return digitos.length > 0 && digitos.length < 11 ? 'Telefone incompleto — digite os 11 dígitos' : null
})

function mascaraTelefone(v: string): string {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function onTelefoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = form.value.telefone = mascaraTelefone(input.value)
}

function submitForm() {
  if (telefoneErro.value || enviando.value) return
  enviando.value = true
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
            <span v-if="props.errosServidor?.nome" class="msg-erro">{{ props.errosServidor.nome[0] }}</span>
          </div>

          <div class="campo">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="email@exemplo.com"
            />
            <span v-if="props.errosServidor?.email" class="msg-erro">{{ props.errosServidor.email[0] }}</span>
          </div>

          <div class="campo">
            <label for="telefone">Telefone</label>
            <input
              id="telefone"
              :value="form.telefone"
              @input="onTelefoneInput"
              type="tel"
              placeholder="(00) 00000-0000"
              maxlength="16"
              :class="{ 'input-erro': telefoneErro }"
            />
            <span v-if="telefoneErro" class="msg-erro">{{ telefoneErro }}</span>
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
            <button type="submit" class="btn btn-primario" :disabled="enviando">
              {{ enviando ? 'Aguarde...' : (contato?.id ? 'Salvar alterações' : 'Cadastrar') }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </Transition>
</template>
