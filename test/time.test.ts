import { test, expect } from 'vitest'
import { Time, TimeUnit } from '../src/time'

const CONVERSION_TESTS: [number, TimeUnit, number, TimeUnit][] = [
  // week conversions
  [1, 'Week', 7 * 24 * 60 * 60, 'Second'],
  [1, 'Week', 7 * 24 * 60, 'Minute'],
  [1, 'Week', 7 * 24, 'Hour'],
  [1, 'Week', 7, 'Day'],
  [1, 'Week', 1, 'Week'],
  // day conversions
  [1, 'Day', 24 * 60 * 60, 'Second'],
  [1, 'Day', 24 * 60, 'Minute'],
  [1, 'Day', 24, 'Hour'],
  [1, 'Day', 1, 'Day'],
  [1, 'Day', 1 / 7, 'Week'],
  // hour conversions
  [1, 'Hour', 60 * 60, 'Second'],
  [1, 'Hour', 60, 'Minute'],
  [1, 'Hour', 1, 'Hour'],
  [1, 'Hour', 1 / 24, 'Day'],
  [1, 'Hour', 1 / 24 / 7, 'Week'],
  // minute conversions
  [1, 'Minute', 60, 'Second'],
  [1, 'Minute', 1, 'Minute'],
  [1, 'Minute', 1 / 60, 'Hour'],
  [1, 'Minute', 1 / 60 / 24, 'Day'],
  [1, 'Minute', 1 / 60 / 24 / 7, 'Week'],
  // second conversions
  [1, 'Second', 1, 'Second'],
  [1, 'Second', 1 / 60, 'Minute'],
  [1, 'Second', 1 / 60 / 60, 'Hour'],
  [1, 'Second', 1 / 60 / 60 / 24, 'Day'],
  [1, 'Second', 1 / 60 / 60 / 24 / 7, 'Week'],
]

for (const [fromValue, fromUnit, toValue, toUnit] of CONVERSION_TESTS) {
  test(`convert: ${fromUnit} -> ${toUnit}`, () => {
    const from = new Time(fromValue, fromUnit)
    const to = Time.convert(from, toUnit)
    expect(to.dimension).toBe('Time')
    expect(to.unit).toBe(toUnit)
    expect(to.value).toBeCloseTo(toValue)
  })
}

test(`0 conversions`, () => {
  expect(Time.convert(Time.Weeks(0), 'Day')).toEqual(Time.Days(0))
  expect(Time.convert(Time.Days(0), 'Hour')).toEqual(Time.Hours(0))
  expect(Time.convert(Time.Hours(0), 'Minute')).toEqual(Time.Minutes(0))
  expect(Time.convert(Time.Minutes(0), 'Second')).toEqual(Time.Seconds(0))
  expect(Time.convert(Time.Seconds(0), 'Minute')).toEqual(Time.Minutes(0))
})

test(`normalize`, () => {
  const times = [Time.Weeks(1), Time.Days(1), Time.Hours(1), Time.Minutes(1), Time.Seconds(1)]
  const normalTimes = Time.normalize(times, 'Second')
  expect(normalTimes.every(t => t.unit === 'Second')).toBe(true)
  expect(normalTimes[0].value).toBeCloseTo(7 * 24 * 60 * 60)
  expect(normalTimes[1].value).toBeCloseTo(24 * 60 * 60)
  expect(normalTimes[2].value).toBeCloseTo(60 * 60)
  expect(normalTimes[3].value).toBeCloseTo(60)
  expect(normalTimes[4].value).toBeCloseTo(1)
})

test(`parse / tryParse`, () => {
  const data = { dimension: 'Time', unit: 'Hour', value: 15 }
  // parse object
  const t1 = Time.parse(data)
  expect(t1.unit).toBe('Hour')
  expect(t1.value).toBe(15)
  // tryParse object
  const t2 = Time.tryParse(data)
  expect('time' in t2 && t2.time.unit).toBe('Hour')
  expect('time' in t2 && t2.time.value).toBe(15)
  // parse string
  const t3 = Time.parse(JSON.stringify(data))
  expect(t3.unit).toBe('Hour')
  expect(t3.value).toBe(15)
  // tryParse string
  const t4 = Time.tryParse(JSON.stringify(data))
  expect('time' in t4 && t4.time.unit).toBe('Hour')
  expect('time' in t4 && t4.time.value).toBe(15)
})

test(`parse / tryParse (invalid)`, () => {
  const data = {}
  // parse object
  expect(() => Time.parse(data)).toThrow()
  // tryParse object
  expect(Time.tryParse(data)).toEqual({ error: expect.stringMatching(/.*/) })
  // parse string
  expect(() => Time.parse(JSON.stringify(data))).toThrow()
  // tryParse object
  expect(Time.tryParse(JSON.stringify(data))).toEqual({ error: expect.stringMatching(/.*/) })
})
