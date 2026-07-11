<template>
  <div class="dropdown-menu">
    <button
      v-for="(item, index) in items"
      :key="index"
      @click="selectItem(index)"
      :class="['menu-btn', { 'menu-btn--active': index === selectedIndex }]"
      type="button"
    >
      <span class="menu-btn__label">{{ item.label }}</span>
      <span class="menu-btn__hint">Enter</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  label: string;
  id: string;
}

const props = defineProps<{
  items: MenuItem[]
  command: (item: MenuItem) => void
  selectedIndex?: number
  onCommand?: (item: MenuItem) => void
}>()

const selectItem = (index: number) => {
  const item = props.items[index]
  if (item) {
    props.command(item)
    if (props.onCommand) {
      requestAnimationFrame(() => props.onCommand?.(item))
    }
  }
}

// Handles keyboard event bubbling up to the Tiptap framework
const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter') {
    return true
  }
  return false
}

// Crucial: Must be exposed so BlockEditor can see it under strict mode
defineExpose({ onKeyDown })
</script>

<style scoped>
.dropdown-menu {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  display: flex;
  flex-direction: column;
  padding: 0.375rem;
  box-shadow: 0 20px 45px -18px rgba(15, 23, 42, 0.28);
  min-width: 240px;
  min-height: 48px;
  max-height: 280px;
  overflow-y: auto;
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 0.7rem 0.75rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  border-radius: 0.65rem;
  color: #0f172a;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.menu-btn__label {
  font-weight: 500;
}

.menu-btn__hint {
  font-size: 0.72rem;
  color: #94a3b8;
}

.menu-btn:hover {
  background: #f8fafc;
}

.menu-btn--active {
  background: #eff6ff;
  color: #1d4ed8;
}

.menu-btn--active .menu-btn__hint {
  color: #3b82f6;
}
</style>
