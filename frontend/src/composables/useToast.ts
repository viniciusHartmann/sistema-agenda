import { ref } from 'vue'

export type ToastTipo = 'sucesso' | 'erro' | 'aviso'

interface Toast {
  id: number
  mensagem: string
  tipo: ToastTipo
}

// Estado no nível do módulo — singleton compartilhado por todos os componentes
const toasts = ref<Toast[]>([])
let proximoId = 0

export function useToast() {
  function addToast(mensagem: string, tipo: ToastTipo = 'sucesso', duracao = 3500) {
    const id = ++proximoId
    toasts.value.push({ id, mensagem, tipo })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duracao)
  }

  return { toasts, addToast }
}
