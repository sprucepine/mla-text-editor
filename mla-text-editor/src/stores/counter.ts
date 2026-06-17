import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DocumentItem, CreateDocumentInput } from '@' // if separated

export const useDocumentStore = defineStore('document', () => {
  
  // Use Record<string, DocumentItem> so TypeScript knows exactly what 
  // objects look like inside this dictionary
  const documents = ref<Record<string, DocumentItem>>({})

  // The function signature is now perfectly clean
  function createDocument(input: CreateDocumentInput) {
    const id = crypto.randomUUID()
    
    // Provide defaults right here during assignment if they weren't passed in
    documents.value[id] = {
      id,
      content: input.content,
      title: "Untitled Document",
      name: "",
      professor: "",
      class: ""
    }
  }

  return { documents, createDocument }
})