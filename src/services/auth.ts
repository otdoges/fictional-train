import { ref } from 'vue'

// Simple static authentication for demo purposes
// In a real app, you would integrate with an auth provider like Auth0, Firebase, etc.

interface User {
  id: string
  username: string
  email: string
}

const currentUser = ref<User | null>(null)
const isAuthenticated = ref(false)
const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true'

// Demo users
const users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password',
  },
]

export const auth = {
  // Check if auth is enabled
  isAuthEnabled() {
    return authEnabled
  },

  // Check if user is authenticated
  isAuthenticated() {
    return isAuthenticated.value
  },

  // Get current user
  getCurrentUser() {
    return currentUser.value
  },

  // Login
  async login(username: string, password: string) {
    if (!authEnabled) {
      isAuthenticated.value = true
      currentUser.value = {
        id: 'guest',
        username: 'Guest User',
        email: 'guest@example.com',
      }
      return true
    }

    // Find user
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      const { password, ...userData } = user
      currentUser.value = userData as User
      isAuthenticated.value = true

      // Store in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(userData))

      return true
    }

    return false
  },

  // Logout
  async logout() {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth_user')
  },

  // Initialize auth from localStorage
  initialize() {
    try {
      const storedUser = localStorage.getItem('auth_user')

      if (storedUser) {
        currentUser.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      } else if (!authEnabled) {
        // Auto-login as guest if auth is disabled
        this.login('guest', 'guest')
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      this.logout()
    }
  },
}
