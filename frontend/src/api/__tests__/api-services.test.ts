/**
 * Comprehensive Frontend API Services Test
 * Tests verify API services work correctly with both success and error scenarios
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

describe('Frontend API Services Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    describe('Auth Service', () => {
        it('should handle admin login success', async () => {
            const mockResponse = {
                data: {
                    access: 'mock_token',
                    refresh: 'mock_refresh',
                    user: { id: 1, username: 'admin' }
                }
            }
            mockedAxios.post.mockResolvedValue(mockResponse)

            const { authService } = await import('../authService')
            const result = await authService.adminLogin({
                email: 'admin@test.com',
                password: 'pass'
            })

            expect(result).toEqual(mockResponse.data)
        })

        it('should handle admin login failure', async () => {
            const mockError = {
                response: {
                    status: 401,
                    data: { detail: 'Invalid credentials' }
                }
            }
            mockedAxios.post.mockRejectedValue(mockError)

            const { authService } = await import('../authService')

            await expect(authService.adminLogin({
                email: 'wrong@test.com',
                password: 'wrong'
            })).rejects.toEqual(mockError)
        })
    })

    describe('Support Service', () => {
        it('should get mentors success', async () => {
            const mockData = [{ id: 1, name: 'Mentor 1' }]
            mockedAxios.get.mockResolvedValue({ data: mockData })

            const { supportService } = await import('../supportService')
            const result = await supportService.getMentors()

            expect(result).toEqual(mockData)
        })

        it('should handle get mentors error', async () => {
            const mockError = new Error('Network Error')
            mockedAxios.get.mockRejectedValue(mockError)

            const { supportService } = await import('../supportService')

            await expect(supportService.getMentors()).rejects.toThrow('Network Error')
        })
    })
})

console.log('Frontend API tests ready to run!')
