import axios from 'axios'
import Cookies from 'js-cookie'
import { CreateWorkoutRequest, UpdateWorkoutRequest, WorkoutResponse } from '../types/workout'
import { Exercise } from '../types/exercise'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const auth = {
  signup: async (email: string, password: string) => {
    const response = await api.post('/auth/signup', { email, password })
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  validate: async () => {
    const response = await api.get('/auth/validate')
    return response.data
  },
}

// Exercise API
export const exercises = {
  list: async () => {
    const response = await api.get<Exercise[]>('/exercises')
    return response.data
  },

  get: async (id: string) => {
    const response = await api.get<Exercise>(`/exercises/${id}`)
    return response.data
  },

  create: async (exercise: CreateWorkoutRequest) => {
    const response = await api.post<Exercise>('/exercises', exercise)
    return response.data
  },
}

// Workout API
export const workouts = {
  list: async () => {
    const response = await api.get<WorkoutResponse[]>('/workouts')
    return response.data
  },

  get: async (id: string) => {
    const response = await api.get<WorkoutResponse>(`/workouts/${id}`)
    return response.data
  },

  create: async (workout: CreateWorkoutRequest) => {
    const response = await api.post<WorkoutResponse>('/workouts', workout)
    return response.data
  },

  update: async (id: string, workout: UpdateWorkoutRequest) => {
    const response = await api.put<WorkoutResponse>(`/workouts/${id}`, workout)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/workouts/${id}`)
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put<WorkoutResponse>(`/workouts/${id}`, { status })
    return response.data
  },
}

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., clear token and redirect to login)
      Cookies.remove('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
