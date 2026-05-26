import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Stub browser APIs unavailable in jsdom
global.URL.createObjectURL = vi.fn(() => 'blob:mock')
global.URL.revokeObjectURL = vi.fn()
