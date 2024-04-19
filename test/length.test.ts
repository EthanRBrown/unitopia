import { test, expect } from 'vitest'
import { Length, LengthUnit } from '../src/length'

const CONVERSION_TESTS: [number, LengthUnit, number, LengthUnit][] = [
  // km conversions
  [1, 'Kilometer', 1, 'Kilometer'],
  [1, 'Kilometer', 1000, 'Meter'],
  [1, 'Kilometer', 100000, 'Centimeter'],
  [1, 'Kilometer', 0.5399568035, 'Nautical Mile'],
  [1, 'Kilometer', 0.621371, 'Mile'],
  [1, 'Kilometer', 1093.61, 'Yard'],
  [1, 'Kilometer', 3280.84, 'Foot'],
  [1, 'Kilometer', 39370.08, 'Inch'],
  // m conversions
  [1, 'Meter', 0.001, 'Kilometer'],
  [1, 'Meter', 1, 'Meter'],
  [1, 'Meter', 100, 'Centimeter'],
  [1, 'Meter', 0.0005399568, 'Nautical Mile'],
  [1, 'Meter', 0.000621371, 'Mile'],
  [1, 'Meter', 1.09361, 'Yard'],
  [1, 'Meter', 3.28084, 'Foot'],
  [1, 'Meter', 39.3701, 'Inch'],
  // cm conversions
  [1, 'Centimeter', 0.00001, 'Kilometer'],
  [1, 'Centimeter', 0.01, 'Meter'],
  [1, 'Centimeter', 1, 'Centimeter'],
  [1, 'Centimeter', 0.0000053996, 'Nautical Mile'],
  [1, 'Centimeter', 6.21371e-6, 'Mile'],
  [1, 'Centimeter', 0.0109361, 'Yard'],
  [1, 'Centimeter', 0.0328084, 'Foot'],
  [1, 'Centimeter', 0.393701, 'Inch'],
  // mm conversions
  [1, 'Millimeter', 0.000001, 'Kilometer'],
  [1, 'Millimeter', 0.001, 'Meter'],
  [1, 'Millimeter', 0.1, 'Centimeter'],
  [1, 'Millimeter', 5.399568034e-7, 'Nautical Mile'],
  [1, 'Millimeter', 6.21371e-7, 'Mile'],
  [1, 'Millimeter', 0.00109361, 'Yard'],
  [1, 'Millimeter', 0.00328084, 'Foot'],
  [1, 'Millimeter', 0.0393701, 'Inch'],
  // mi conversions
  [1, 'Mile', 1.60934, 'Kilometer'],
  [1, 'Mile', 1609.34, 'Meter'],
  [1, 'Mile', 160934.4, 'Centimeter'],
  [1, 'Mile', 0.8689762419, 'Nautical Mile'],
  [1, 'Mile', 1, 'Mile'],
  [1, 'Mile', 1760, 'Yard'],
  [1, 'Mile', 5280, 'Foot'],
  [1, 'Mile', 63360, 'Inch'],
  // ft conversions
  [1, 'Foot', 0.0003048, 'Kilometer'],
  [1, 'Foot', 0.3048, 'Meter'],
  [1, 'Foot', 30.48, 'Centimeter'],
  [1, 'Foot', 0.0001645788, 'Nautical Mile'],
  [1, 'Foot', 0.000189394, 'Mile'],
  [1, 'Foot', 0.333333, 'Yard'],
  [1, 'Foot', 1, 'Foot'],
  [1, 'Foot', 12, 'Inch'],
  // in conversions
  [1, 'Inch', 2.54e-5, 'Kilometer'],
  [1, 'Inch', 0.0254, 'Meter'],
  [1, 'Inch', 2.54, 'Centimeter'],
  [1, 'Inch', 0.0000137149, 'Nautical Mile'],
  [1, 'Inch', 1.5783e-5, 'Mile'],
  [1, 'Inch', 0.0277778, 'Yard'],
  [1, 'Inch', 0.0833333, 'Foot'],
  [1, 'Inch', 1, 'Inch'],
]

for (const [fromValue, fromUnit, toValue, toUnit] of CONVERSION_TESTS) {
  test(`convert: ${fromUnit} -> ${toUnit}`, () => {
    const from = new Length(fromValue, fromUnit)
    const to = Length.convert(from, toUnit)
    expect(to.dimension).toBe('Length')
    expect(to.unit).toBe(toUnit)
    expect(to.value).toBeCloseTo(toValue)
  })
}

test(`0 conversions`, () => {
  expect(Length.convert(Length.Kilometers(0), 'Meter')).toEqual(Length.Meters(0))
  expect(Length.convert(Length.Meters(0), 'Kilometer')).toEqual(Length.Kilometers(0))
  expect(Length.convert(Length.Centimeters(0), 'Meter')).toEqual(Length.Meters(0))
  expect(Length.convert(Length.Millimeters(0), 'Meter')).toEqual(Length.Meters(0))
  expect(Length.convert(Length.Miles(0), 'Meter')).toEqual(Length.Meters(0))
  expect(Length.convert(Length.Yards(0), 'Meter')).toEqual(Length.Meters(0))
  expect(Length.convert(Length.Feet(0), 'Meter')).toEqual(Length.Meters(0))
  expect(Length.convert(Length.Inches(0), 'Meter')).toEqual(Length.Meters(0))
})

test(`normalize`, () => {
  const lengths = [
    Length.Kilometers(1),
    Length.Meters(1),
    Length.Centimeters(1),
    Length.Millimeters(1),
    Length.Miles(1),
    Length.Yards(1),
    Length.Feet(1),
    Length.Inches(1),
  ]
  const normalTimes = Length.normalize(lengths, 'Meter')
  expect(normalTimes.every(l => l.unit === 'Meter')).toBe(true)
  expect(normalTimes[0].value).toBeCloseTo(1000)
  expect(normalTimes[1].value).toBeCloseTo(1)
  expect(normalTimes[2].value).toBeCloseTo(0.01)
  expect(normalTimes[3].value).toBeCloseTo(0.001)
  expect(normalTimes[4].value).toBeCloseTo(1609.34)
  expect(normalTimes[5].value).toBeCloseTo(0.9144)
  expect(normalTimes[6].value).toBeCloseTo(0.3048)
  expect(normalTimes[7].value).toBeCloseTo(0.0254)
})

test(`parse / tryParse`, () => {
  const data = { dimension: 'Length', unit: 'Foot', value: 15 }
  // parse object
  const l1 = Length.parse(data)
  expect(l1.unit).toBe('Foot')
  expect(l1.value).toBe(15)
  // tryParse object
  const l2 = Length.tryParse(data)
  expect('length' in l2 && l2.length.unit).toBe('Foot')
  expect('length' in l2 && l2.length.value).toBe(15)
  // parse string
  const l3 = Length.parse(JSON.stringify(data))
  expect(l3.unit).toBe('Foot')
  expect(l3.value).toBe(15)
  // tryParse string
  const l4 = Length.tryParse(JSON.stringify(data))
  expect('length' in l4 && l4.length.unit).toBe('Foot')
  expect('length' in l4 && l4.length.value).toBe(15)
})

test(`parse / tryParse (invalid)`, () => {
  const data = {}
  // parse object
  expect(() => Length.parse(data)).toThrow()
  // tryParse object
  expect(Length.tryParse(data)).toEqual({ error: expect.stringMatching(/.*/) })
  // parse string
  expect(() => Length.parse(JSON.stringify(data))).toThrow()
  // tryParse object
  expect(Length.tryParse(JSON.stringify(data))).toEqual({ error: expect.stringMatching(/.*/) })
})
