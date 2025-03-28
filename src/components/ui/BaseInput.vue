<script setup lang="ts">
defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  class?: string
  disabled?: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    :type="type || 'text'"
    :placeholder="placeholder"
    :disabled="disabled"
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    :class="class"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
