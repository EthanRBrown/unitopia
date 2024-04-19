import { test, expect } from 'vitest'
import { Mass, MassUnit } from '../src/mass'

const CONVERSION_TESTS: [number, MassUnit, number, MassUnit][] = [
  // kg conversions
  [1, 'Kilogram', 1, 'Kilogram'],
  [1, 'Kilogram', 1000, 'Gram'],
  [1, 'Kilogram', 100000, 'Milligram'],
  [1, 'Kilogram', 0.0011023113, 'Short Ton'],
  [1, 'Kilogram', 0.0009842065, 'Long Ton'],
  [1, 'Kilogram', 0.001, 'Tonne'],
  [1, 'Kilogram', 2.2046226218, 'Pound'],
  [1, 'Kilogram', 35.27396195, 'Ounce'],
  // g conversions
  [1, 'Gram', 0.001, 'Kilogram'],
  [1, 'Gram', 1, 'Gram'],
  [1, 'Gram', 1000, 'Milligram'],
  [1, 'Gram', 0.0000011023, 'Short Ton'],
  [1, 'Gram', 9.842065276e-7, 'Long Ton'],
  [1, 'Gram', 0.000001, 'Tonne'],
  [1, 'Gram', 0.0022046226, 'Pound'],
  [1, 'Gram', 0.0352739619, 'Ounce'],
  // mg conversions
  [1, 'Milligram', 0.00001, 'Kilogram'],
  [1, 'Milligram', 0.001, 'Gram'],
  [1, 'Milligram', 1, 'Milligram'],
  [1, 'Milligram', 1.10231131e-9, 'Short Ton'],
  [1, 'Milligram', 9.842065276e-10, 'Long Ton'],
  [1, 'Milligram', 1e-9, 'Tonne'],
  [1, 'Milligram', 0.0000022046, 'Pound'],
  [1, 'Milligram', 0.000035274, 'Ounce'],
  // short ton conversions
  [1, 'Short Ton', 907.18474, 'Kilogram'],
  [1, 'Short Ton', 907184.74, 'Gram'],
  [0.001, 'Short Ton', 907184.74, 'Milligram'],
  [1, 'Short Ton', 1, 'Short Ton'],
  [1, 'Short Ton', 0.8928571429, 'Long Ton'],
  [1, 'Short Ton', 0.90718474, 'Tonne'],
  [1, 'Short Ton', 2000, 'Pound'],
  [1, 'Short Ton', 32000, 'Ounce'],
  // long ton conversions
  [1, 'Long Ton', 1016.0469088, 'Kilogram'],
  [1, 'Long Ton', 1016046.9088, 'Gram'],
  [1, 'Long Ton', 1016046908.8, 'Milligram'],
  [1, 'Long Ton', 1.12, 'Short Ton'],
  [1, 'Long Ton', 1, 'Long Ton'],
  [1, 'Long Ton', 1.0160469088, 'Tonne'],
  [1, 'Long Ton', 2240, 'Pound'],
  [1, 'Long Ton', 35840, 'Ounce'],
  // tonne conversions
  [1, 'Tonne', 1000, 'Kilogram'],
  [1, 'Tonne', 1000000, 'Gram'],
  [1, 'Tonne', 1000000000, 'Milligram'],
  [1, 'Tonne', 1.1023113109, 'Short Ton'],
  [1, 'Tonne', 0.9842065276, 'Long Ton'],
  [1, 'Tonne', 1, 'Tonne'],
  [1, 'Tonne', 2204.6226218, 'Pound'],
  [1, 'Tonne', 35273.96195, 'Ounce'],
  // lb conversions
  [1, 'Pound', 0.45359237, 'Kilogram'],
  [1, 'Pound', 453.59237, 'Gram'],
  [1, 'Pound', 453592.37, 'Milligram'],
  [1, 'Pound', 0.0005, 'Short Ton'],
  [1, 'Pound', 0.0004464286, 'Long Ton'],
  [1, 'Pound', 0.0004535924, 'Tonne'],
  [1, 'Pound', 1, 'Pound'],
  [1, 'Pound', 16, 'Ounce'],
  // oz conversions
  [1, 'Ounce', 0.0283495231, 'Kilogram'],
  [1, 'Ounce', 28.349523125, 'Gram'],
  [1, 'Ounce', 28349.523125, 'Milligram'],
  [1, 'Ounce', 0.00003125, 'Short Ton'],
  [1, 'Ounce', 0.0000279018, 'Long Ton'],
  [1, 'Ounce', 0.0000283495, 'Tonne'],
  [1, 'Ounce', 0.0625, 'Pound'],
  [1, 'Ounce', 1, 'Ounce'],
]

for (const [fromValue, fromUnit, toValue, toUnit] of CONVERSION_TESTS) {
  test(`convert: ${fromUnit} -> ${toUnit}`, () => {
    const from = new Mass(fromValue, fromUnit)
    const to = Mass.convert(from, toUnit)
    expect(to.dimension).toBe('Mass')
    expect(to.unit).toBe(toUnit)
    expect(to.value).toBeCloseTo(toValue)
  })
}

test(`0 conversions`, () => {
  expect(Mass.convert(Mass.Kilograms(0), 'Gram')).toEqual(Mass.Grams(0))
  expect(Mass.convert(Mass.Grams(0), 'Kilogram')).toEqual(Mass.Kilograms(0))
  expect(Mass.convert(Mass.Milligrams(0), 'Kilogram')).toEqual(Mass.Kilograms(0))
  expect(Mass.convert(Mass.ShortTons(0), 'Kilogram')).toEqual(Mass.Kilograms(0))
  expect(Mass.convert(Mass.LongTons(0), 'Kilogram')).toEqual(Mass.Kilograms(0))
  expect(Mass.convert(Mass.Tonnes(0), 'Kilogram')).toEqual(Mass.Kilograms(0))
  expect(Mass.convert(Mass.Pounds(0), 'Kilogram')).toEqual(Mass.Kilograms(0))
  expect(Mass.convert(Mass.Ounces(0), 'Kilogram')).toEqual(Mass.Kilograms(0))
})

test(`normalize`, () => {
  const lengths = [
    Mass.Kilograms(1),
    Mass.Grams(1),
    Mass.Milligrams(1),
    Mass.ShortTons(1),
    Mass.LongTons(1),
    Mass.Tonnes(1),
    Mass.Pounds(1),
    Mass.Ounces(1),
  ]
  const normalTimes = Mass.normalize(lengths, 'Kilogram')
  expect(normalTimes.every(l => l.unit === 'Kilogram')).toBe(true)
  expect(normalTimes[0].value).toBeCloseTo(1)
  expect(normalTimes[1].value).toBeCloseTo(0.001)
  expect(normalTimes[2].value).toBeCloseTo(0.00001)
  expect(normalTimes[3].value).toBeCloseTo(907.18474)
  expect(normalTimes[4].value).toBeCloseTo(1016.0469088)
  expect(normalTimes[5].value).toBeCloseTo(1000)
  expect(normalTimes[6].value).toBeCloseTo(0.45359237)
  expect(normalTimes[7].value).toBeCloseTo(0.0283495231)
})

test(`parse / tryParse`, () => {
  const data = { dimension: 'Mass', unit: 'Kilogram', value: 15 }
  // parse object
  const m1 = Mass.parse(data)
  expect(m1.unit).toBe('Kilogram')
  expect(m1.value).toBe(15)
  // tryParse object
  const m2 = Mass.tryParse(data)
  expect('mass' in m2 && m2.mass.unit).toBe('Kilogram')
  expect('mass' in m2 && m2.mass.value).toBe(15)
  // parse string
  const m3 = Mass.parse(JSON.stringify(data))
  expect(m3.unit).toBe('Kilogram')
  expect(m3.value).toBe(15)
  // tryParse string
  const m4 = Mass.tryParse(JSON.stringify(data))
  expect('mass' in m4 && m4.mass.unit).toBe('Kilogram')
  expect('mass' in m4 && m4.mass.value).toBe(15)
})

test(`parse / tryParse (invalid)`, () => {
  const data = {}
  // parse object
  expect(() => Mass.parse(data)).toThrow()
  // tryParse object
  expect(Mass.tryParse(data)).toEqual({ error: expect.stringMatching(/.*/) })
  // parse string
  expect(() => Mass.parse(JSON.stringify(data))).toThrow()
  // tryParse object
  expect(Mass.tryParse(JSON.stringify(data))).toEqual({ error: expect.stringMatching(/.*/) })
})
