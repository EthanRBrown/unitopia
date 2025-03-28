import type { JsonObject } from './jsonTypes'

/**
 * Supported time dimension units.
 */
export const TIME_UNITS = ['Year', 'Quarter', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'] as const

/**
 * Time dimension unit ('Week, 'Minute', etc.)
 */
export type TimeUnit = (typeof TIME_UNITS)[number]

/**
 * Time dimension string (interchangeable with Time.DIMENSION).
 */
export const TIME_DIMENSION = 'Time' as const

/**
 * Time quantity.
 */
export class Time<T extends TimeUnit = TimeUnit> {
  /**
   * Available time units.
   */
  static UNITS = TIME_UNITS
  /**
   * Dimension string.
   */
  static DIMENSION = TIME_DIMENSION
  /**
   * Dimension string.
   */
  readonly dimension = Time.DIMENSION
  /**
   * Constructs a time quantity with a value and time unit.
   */
  constructor(public value: number, public unit: T) {}
  /**
   * Parses a time quantity from a JSON object or a string containing a JSON object.  If the
   * parsing fails, an error is thrown.
   */
  static parse(data: JsonObject | string): Time {
    const res = Time.tryParse(data)
    if ('error' in res) throw new Error(res.error)
    return res.time
  }
  /**
   * Attempts to parse a time quantity from a JSON object or string containing a JSON object.
   * If the parsing fails, an object containing the property "error" with a string description of
   * the error is returned.  Otherwise a valid Time instance is returned.
   */
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
  /**
   * Convenience constructor: years.
   */
  static Years(value: number): Time<'Year'> {
    return new Time(value, 'Year')
  }
  /**
   * Convenience constructor: quarters.
   */
  static Quarters(value: number): Time<'Quarter'> {
    return new Time(value, 'Quarter')
  }
  /**
   * Convenience constructor: months.
   */
  static Months(value: number): Time<'Month'> {
    return new Time(value, 'Month')
  }
  /**
   * Convenience constructor: weeks.
   */
  static Weeks(value: number): Time<'Week'> {
    return new Time(value, 'Week')
  }
  /**
   * Convenience constructor: days.
   */
  static Days(value: number): Time<'Day'> {
    return new Time(value, 'Day')
  }
  /**
   * Convenience constructor: hours.
   */
  static Hours(value: number): Time<'Hour'> {
    return new Time(value, 'Hour')
  }
  /**
   * Convenience constructor: minutes.
   */
  static Minutes(value: number): Time<'Minute'> {
    return new Time(value, 'Minute')
  }
  /**
   * Convenience constructor: seconds.
   */
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
 * Mean days in year in the Gregorian calendar.
 */
const DAYS_IN_YEAR = 365.2425

/**
 * Mean weeks in a month in the Gregorian calendar.
 */
const WEEKS_IN_MONTH = 6957 / 1600

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
    Year: {
      // year to...
      Year: 1,
      Quarter: 4,
      Month: 12,
      Week: DAYS_IN_YEAR / 7,
      Day: DAYS_IN_YEAR,
      Hour: DAYS_IN_YEAR * 7 * 24,
      Minute: DAYS_IN_YEAR * 7 * 24 * 60,
      Second: DAYS_IN_YEAR * 7 * 24 * 60 * 60,
    },
    Quarter: {
      // quarter to...
      Year: 1 / 4,
      Quarter: 1,
      Month: 1 / 4,
      Week: (1 / 4) * WEEKS_IN_MONTH,
      Day: (1 / 4) * WEEKS_IN_MONTH * 7,
      Hour: (1 / 4) * WEEKS_IN_MONTH * 7 * 24,
      Minute: (1 / 4) * WEEKS_IN_MONTH * 7 * 24 * 60,
      Second: (1 / 4) * WEEKS_IN_MONTH * 7 * 24 * 60 * 60,
    },
    Month: {
      // month to...
      Year: 1 / 12,
      Quarter: 1 / 4,
      Month: 1,
      Week: WEEKS_IN_MONTH,
      Day: WEEKS_IN_MONTH * 7,
      Hour: WEEKS_IN_MONTH * 7 * 24,
      Minute: WEEKS_IN_MONTH * 7 * 24 * 60,
      Second: WEEKS_IN_MONTH * 7 * 24 * 60 * 60,
    },
    Week: {
      // week to...
      Year: 7 / DAYS_IN_YEAR,
      Quarter: (7 / DAYS_IN_YEAR) * 4,
      Month: 1 / WEEKS_IN_MONTH,
      Week: 1,
      Day: 7,
      Hour: 7 * 24,
      Minute: 7 * 24 * 60,
      Second: 7 * 24 * 60 * 60,
    },
    Day: {
      // day to...
      Year: 1 / DAYS_IN_YEAR,
      Quarter: (1 / DAYS_IN_YEAR) * 4,
      Month: 1 / 7 / WEEKS_IN_MONTH,
      Week: 1 / 7,
      Day: 1,
      Hour: 24,
      Minute: 24 * 60,
      Second: 24 * 60 * 60,
    },
    Hour: {
      // hour to...
      Year: 1 / 24 / 7 / DAYS_IN_YEAR,
      Quarter: (1 / 24 / 7 / DAYS_IN_YEAR) * 4,
      Month: 1 / 24 / 7 / WEEKS_IN_MONTH,
      Week: 1 / 24 / 7,
      Day: 1 / 24,
      Hour: 1,
      Minute: 60,
      Second: 60 * 60,
    },
    Minute: {
      // minute to...
      Year: 1 / 60 / 24 / DAYS_IN_YEAR,
      Quarter: (1 / 60 / 24 / DAYS_IN_YEAR) * 4,
      Month: 1 / 60 / 24 / 7 / WEEKS_IN_MONTH,
      Week: 1 / 60 / 24 / 7,
      Day: 1 / 60 / 24,
      Hour: 1 / 60,
      Minute: 1,
      Second: 60,
    },
    Second: {
      // second to...
      Year: 1 / 60 / 60 / 24 / DAYS_IN_YEAR,
      Quarter: (1 / 60 / 60 / 24 / DAYS_IN_YEAR) * 4,
      Month: 1 / 60 / 60 / 24 / 7 / WEEKS_IN_MONTH,
      Week: 1 / 60 / 60 / 24 / 7,
      Day: 1 / 60 / 60 / 24,
      Hour: 1 / 60 / 60,
      Minute: 1 / 60,
      Second: 1,
    },
  }
}

/**
 * Time conversion factors.
 *
 * @example
 * 60 * TIME_CONVERSION_FACTORS['Minute']['Hour'] // 1
 */
export const TIME_CONVERSION_FACTORS: Record<TimeUnit, Record<TimeUnit, number>> = generateTimeConversionFactors()
