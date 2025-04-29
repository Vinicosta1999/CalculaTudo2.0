import '@testing-library/jest-dom'

// Mock para o localStorage
const localStorageMock = (function() {
  let store = {}
  return {
    getItem: function(key) {
      return store[key] || null
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    clear: function() {
      store = {}
    },
    removeItem: function(key) {
      delete store[key]
    }
  }
})()

// Mock para o matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// Configuração do localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Silenciar avisos específicos do React
jest.spyOn(console, 'error').mockImplementation((...args) => {
  if (args[0].includes('Warning:')) {
    return
  }
  console.error(...args)
})
