import type { JsonObject } from 'type-fest'

export const TIME_UNITS = ['Week', 'Day', 'Hour', 'Minute', 'Second'] as const
export type TimeUnit = (typeof TIME_UNITS)[number]

export class Time<T extends TimeUnit = TimeUnit> {
  static UNITS = TIME_UNITS
  readonly dimension = 'Time'
  constructor(public value: number, public unit: T) {}
  static parse(data: JsonObject | string): Time {
    const res = Time.tryParse(data)
    if ('error' in res) throw new Error(res.error)
    return res.time
  }
  static tryParse(data: JsonObject | string): { time: Time } | { error: string } {
    try {
      const o = typeof data === 'string' ? (JSON.parse(data) as JsonObject) : data
      if (typeof o.value !== 'number') return { error: `data.value is non-numeric` }
      if (!('unit' in o) || typeof o.unit !== 'string') return { error: `data.unit is missing or invalid` }
      const unit = o.unit as TimeUnit
      if (!Time.UNITS.includes(unit)) return { error: `unsupported length unit: ${o.unit}` }
      const time = new Time(o.value, unit)
      if (o.dimension !== time.dimension) return { error: `data.dimension is not ${time.dimension}` }
      return { time }
    } catch (err) {
      return { error: `invalid JSON: ${data}` }
    }
  }
  static Weeks(value: number): Time<'Week'> {
    return new Time(value, 'Week')
  }
  static Days(value: number): Time<'Day'> {
    return new Time(value, 'Day')
  }
  static Hours(value: number): Time<'Hour'> {
    return new Time(value, 'Hour')
  }
  static Minutes(value: number): Time<'Minute'> {
    return new Time(value, 'Minute')
  }
  static Seconds(value: number): Time<'Second'> {
    return new Time(value, 'Second')
  }

  /**
   * Converts a time in arbitrary units to a time in specified units.
   */
  static convert<T extends TimeUnit>(from: Time<TimeUnit>, toUnit: T): Time<T> {
    const value = from.value * TIME_CONVERSION_FACTORS[from.unit][toUnit]
    return new Time(value, toUnit)
  }

  /**
   * Normalizes an array of possibly mixed time units to an array of times with
   * homogeneous units.
   */
  static normalize<T extends TimeUnit>(times: Time[], toUnit: T): Time<T>[] {
    return times.map(t => Time.convert(t, toUnit))
  }
}

/**
 * Generate complete conversion factors between any two time units.  Returns a map whose
 * outermost keys are the "from" unit and the innermost keys are the "to" unit.
 *
 * In the future, this function may be used for code generation; it enables easy creation
 * of conversions (by using arithmetic operators), and results in a conversion lookup table.
 *
 * @example
 * const TIME_CONVERSION_FACTORS = generateTimeConversionFactors()
 * const minutes = 3600
 * const hours = minutes * TIME_CONVERSION_FACTORS['Minute']['Hour'] // 1
 */
export function generateTimeConversionFactors(): Record<TimeUnit, Record<TimeUnit, number>> {
  return {
    Week: {
      Week: 1,
      Day: 7,
      Hour: 7 * 24,
      Minute: 7 * 24 * 60,
      Second: 7 * 24 * 60 * 60,
    },
    Day: {
      Week: 1 / 7,
      Day: 1,
      Hour: 24,
      Minute: 24 * 60,
      Second: 24 * 60 * 60,
    },
    Hour: {
      Week: 1 / 7 / 24,
      Day: 1 / 24,
      Hour: 1,
      Minute: 60,
      Second: 60 * 60,
    },
    Minute: {
      Week: 1 / 7 / 24 / 60,
      Day: 1 / 24 / 60,
      Hour: 1 / 60,
      Minute: 1,
      Second: 60,
    },
    Second: {
      Week: 1 / 7 / 24 / 60 / 60,
      Day: 1 / 24 / 60 / 60,
      Hour: 1 / 60 / 60,
      Minute: 1 / 60,
      Second: 1,
    },
  }
}

export const TIME_CONVERSION_FACTORS: Record<TimeUnit, Record<TimeUnit, number>> = generateTimeConversionFactors()
