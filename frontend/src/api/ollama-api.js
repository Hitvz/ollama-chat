import request from './request'
import ollama from 'ollama/browser'

export function gen(data) {
  return fetch('/api/generate', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export function generate(data) {
  return ollama.generate(data)
}

