import { test, expect, vi } from 'vitest'
import { Money, MoneyParseWarning } from '../src/money'

test(`parse / tryParse`, () => {
  const MAY_15_2024 = 1715731200000
  const data = { dimension: 'Money', unit: 'USD', value: 15, updatedAt: MAY_15_2024 }
  // parse object
  const l1_onWarnings = vi.fn()
  const l1 = Money.parse(data, l1_onWarnings)
  expect(l1.unit).toBe('USD')
  expect(l1.value).toBe(15)
  expect(l1.updatedAt).toBe(MAY_15_2024)
  expect(l1_onWarnings.mock.calls.length === 0)
  // tryParse object
  const l2 = Money.tryParse(data)
  expect('money' in l2 && l2.money.unit).toBe('USD')
  expect('money' in l2 && l2.money.value).toBe(15)
  expect('money' in l2 && l2.money.updatedAt).toBe(MAY_15_2024)
  expect('warnings' in l2 && l2.warnings.length).toBe(0)
  // parse string
  const l3 = Money.parse(JSON.stringify(data))
  expect(l3.unit).toBe('USD')
  expect(l3.value).toBe(15)
  expect(l3.updatedAt).toBe(MAY_15_2024)
  // tryParse string
  const l4 = Money.tryParse(JSON.stringify(data))
  expect('money' in l4 && l4.money.unit).toBe('USD')
  expect('money' in l4 && l4.money.value).toBe(15)
  expect('money' in l4 && l4.money.updatedAt).toBe(MAY_15_2024)
})

test(`parse / tryParse (warnings)`, () => {
  const data = { dimension: 'Money', unit: 'USD', value: 15 }
  // parse object
  const l1_onWarnings = vi.fn()
  const l1 = Money.parse(data, l1_onWarnings)
  expect(l1.unit).toBe('USD')
  expect(l1.value).toBe(15)
  expect(
    l1_onWarnings.mock.calls[0].warning ===
      ('data.updatedAt is missing; using current timestamp' satisfies MoneyParseWarning['warning'])
  )
  // tryParse object
  const l2 = Money.tryParse(data)
  expect('money' in l2 && l2.money.unit).toBe('USD')
  expect('money' in l2 && l2.money.value).toBe(15)
  expect('warnings' in l2 && l2.warnings[0].warning).toBe(
    'data.updatedAt is missing; using current timestamp' satisfies MoneyParseWarning['warning']
  )
})

test(`parse / tryParse (invalid)`, () => {
  const data = {}
  // parse object
  expect(() => Money.parse(data)).toThrow()
  // tryParse object
  expect(Money.tryParse(data)).toEqual({ error: expect.stringMatching(/.*/) })
  // parse string
  expect(() => Money.parse(JSON.stringify(data))).toThrow()
  // tryParse object
  expect(Money.tryParse(JSON.stringify(data))).toEqual({ error: expect.stringMatching(/.*/) })
})
