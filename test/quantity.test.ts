import { test, expect } from 'vitest'
import { parseQuantityJson, Time } from '../src/main'

test('valid conversion of unknown dimension', () => {
  const t = parseQuantityJson({ dimension: 'Time', unit: 'Hour', value: 10 })
  expect(t instanceof Time).toBeTruthy()
  expect(t.dimension).toBe(Time.DIMENSION)
  expect(t.unit).toBe('Hour')
  expect(t.value).toBe(10)
})

test('conversion of invalid JSON results in error', () => {
  expect(() => parseQuantityJson({ nope: 'not a quantity object' })).toThrow()
})
