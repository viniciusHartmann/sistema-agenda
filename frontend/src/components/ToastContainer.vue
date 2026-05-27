<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-vue-next'
import { useToast } from '../composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.tipo}`]"
        >
          <CheckCircle v-if="toast.tipo === 'sucesso'" :size="18" />
          <XCircle v-else-if="toast.tipo === 'erro'" :size="18" />
          <AlertTriangle v-else :size="18" />
          <span>{{ toast.mensagem }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  min-width: 240px;
  max-width: 360px;
}

.toast-sucesso { background: #16a34a; }
.toast-erro    { background: #dc2626; }
.toast-aviso   { background: #d97706; }

.toast-enter-active { transition: all 0.28s ease; }
.toast-leave-active { transition: all 0.22s ease; }
.toast-enter-from,
.toast-leave-to     { opacity: 0; transform: translateX(48px); }
</style>
