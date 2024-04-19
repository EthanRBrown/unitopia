import type { JsonObject } from 'type-fest'

export const MASS_UNITS = [
  'Kilogram',
  'Gram',
  'Milligram',
  'Short Ton',
  'Long Ton',
  'Tonne',
  'Pound',
  'Ounce',
] as const
export type MassUnit = (typeof MASS_UNITS)[number]

export class Mass<M extends MassUnit = MassUnit> {
  static UNITS = MASS_UNITS
  readonly dimension = 'Mass'
  constructor(public value: number, public unit: M) {}
  static parse(data: JsonObject | string): Mass {
    const res = Mass.tryParse(data)
    if ('error' in res) throw new Error(res.error)
    return res.mass
  }
  static tryParse(data: JsonObject | string): { mass: Mass } | { error: string } {
    try {
      const o = typeof data === 'string' ? (JSON.parse(data) as JsonObject) : data
      if (typeof o.value !== 'number') return { error: `data.value is non-numeric` }
      if (!('unit' in o) || typeof o.unit !== 'string') return { error: `data.unit is missing or invalid` }
      const unit = o.unit as MassUnit
      if (!Mass.UNITS.includes(unit)) return { error: `unsupported length unit: ${o.unit}` }
      const mass = new Mass(o.value, unit)
      if (o.dimension !== mass.dimension) return { error: `data.dimension is not ${mass.dimension}` }
      return { mass }
    } catch (err) {
      return { error: `invalid JSON: ${data}` }
    }
  }
  static Kilograms(value: number) {
    return new Mass(value, 'Kilogram')
  }
  static Grams(value: number) {
    return new Mass(value, 'Gram')
  }
  static Milligrams(value: number) {
    return new Mass(value, 'Milligram')
  }
  static ShortTons(value: number) {
    return new Mass(value, 'Short Ton')
  }
  static LongTons(value: number) {
    return new Mass(value, 'Long Ton')
  }
  static Tonnes(value: number) {
    return new Mass(value, 'Tonne')
  }
  static Pounds(value: number) {
    return new Mass(value, 'Pound')
  }
  static Ounces(value: number) {
    return new Mass(value, 'Ounce')
  }

  /**
   * Converts a mass in arbitrary units to a mass in specified units.
   */
  static convert<T extends MassUnit>(from: Mass<MassUnit>, toUnit: T): Mass<T> {
    const value = from.value * MASS_CONVERSION_FACTORS[from.unit][toUnit]
    return new Mass(value, toUnit)
  }

  /**
   * Normalizes an array of possibly mixed mass units to an array of masses with
   * homogeneous units.
   */
  static normalize<T extends MassUnit>(times: Mass[], toUnit: T): Mass<T>[] {
    return times.map(t => Mass.convert(t, toUnit))
  }
}

/**
 * Generate complete conversion factors between any two mass units.  Returns a map whose
 * outermost keys are the "from" unit and the innermost keys are the "to" unit.
 *
 * In the future, this function may be used for code generation; it enables easy creation
 * of conversions (by using arithmetic operators), and results in a conversion lookup table.
 *
 * @example
 * const MASS_CONVERSION_FACTORS = generateMassConversionFactors()
 * const ounces = 16
 * const pounds = ounces * TIME_CONVERSION_FACTORS['Ounces']['Pound'] // 1
 */
export function generateMassConversionFactors(): Record<MassUnit, Record<MassUnit, number>> {
  const kg_to_lb = 2.2046226218
  const lb_to_kg = 1 / kg_to_lb
  return {
    Kilogram: {
      Kilogram: 1,
      Gram: 1000,
      Milligram: 100000,
      'Short Ton': kg_to_lb / 2000,
      'Long Ton': 0.0009842065,
      Tonne: 0.001,
      Pound: kg_to_lb,
      Ounce: kg_to_lb * 16,
    },
    Gram: {
      Kilogram: 1 / 1000,
      Gram: 1,
      Milligram: 1000,
      'Short Ton': ((1 / 1000) * kg_to_lb) / 2000,
      'Long Ton': 9.842065276e-7,
      Tonne: 0.000001,
      Pound: (1 / 1000) * kg_to_lb,
      Ounce: (1 / 1000) * kg_to_lb * 16,
    },
    Milligram: {
      Kilogram: 1 / 100000,
      Gram: 1 / 1000,
      Milligram: 1,
      'Short Ton': ((1 / 100000) * kg_to_lb) / 2000,
      'Long Ton': 9.842065276e-10,
      Tonne: 1e-9,
      Pound: (1 / 100000) * kg_to_lb,
      Ounce: (1 / 100000) * kg_to_lb * 16,
    },
    'Short Ton': {
      Kilogram: 2000 * lb_to_kg,
      Gram: 2000 * lb_to_kg * 1000,
      Milligram: 2000 * lb_to_kg * 1000000,
      'Short Ton': 1,
      'Long Ton': 0.8928571429,
      Tonne: 0.90718474,
      Pound: 2000,
      Ounce: 2000 * 16,
    },
    'Long Ton': {
      Kilogram: 1016.0469088,
      Gram: 1016046.9088,
      Milligram: 1016046908.8,
      'Short Ton': 1.12,
      'Long Ton': 1,
      Tonne: 1.0160469088,
      Pound: 2240,
      Ounce: 2240 * 16,
    },
    Tonne: {
      Kilogram: 1000,
      Gram: 1000 * 1000,
      Milligram: 1000 * 1000 * 1000,
      'Short Ton': 1.1023113109,
      'Long Ton': 0.9842065276,
      Tonne: 1,
      Pound: 1000 * kg_to_lb,
      Ounce: 1000 * kg_to_lb * 16,
    },
    Pound: {
      Kilogram: lb_to_kg,
      Gram: lb_to_kg * 1000,
      Milligram: lb_to_kg * 1000 * 1000,
      'Short Ton': 1 / 2000,
      'Long Ton': 0.0004464286,
      Tonne: lb_to_kg / 1000,
      Pound: 1,
      Ounce: 16,
    },
    Ounce: {
      Kilogram: (1 / 16) * lb_to_kg,
      Gram: (1 / 16) * lb_to_kg * 1000,
      Milligram: (1 / 16) * lb_to_kg * 1000 * 1000,
      'Short Ton': 1 / 16 / 2000,
      'Long Ton': 0.0000279018,
      Tonne: ((1 / 16) * lb_to_kg) / 1000,
      Pound: 1 / 16,
      Ounce: 1,
    },
  }
}

export const MASS_CONVERSION_FACTORS = generateMassConversionFactors()
