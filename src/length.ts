import type { JsonObject } from 'type-fest'

export const LENGTH_UNITS = [
  'Kilometer',
  'Meter',
  'Centimeter',
  'Millimeter',
  'Nautical Mile', // international
  'Mile',
  'Yard',
  'Foot',
  'Inch',
] as const
export type LengthUnit = (typeof LENGTH_UNITS)[number]

export class Length<L extends LengthUnit = LengthUnit> {
  static UNITS = LENGTH_UNITS
  readonly dimension = 'Length'
  constructor(public value: number, public unit: L) {}
  static parse(data: JsonObject | string): Length {
    const res = Length.tryParse(data)
    if ('error' in res) throw new Error(res.error)
    return res.length
  }
  static tryParse(data: JsonObject | string): { length: Length } | { error: string } {
    try {
      const o = typeof data === 'string' ? (JSON.parse(data) as JsonObject) : data
      if (typeof o.value !== 'number') return { error: `data.value is non-numeric` }
      if (!('unit' in o) || typeof o.unit !== 'string') return { error: `data.unit is missing or invalid` }
      const unit = o.unit as LengthUnit
      if (!Length.UNITS.includes(unit)) return { error: `unsupported length unit: ${o.unit}` }
      const length = new Length(o.value, unit)
      if (o.dimension !== length.dimension) return { error: `data.dimension is not ${length.dimension}` }
      return { length }
    } catch (err) {
      return { error: `invalid JSON: ${data}` }
    }
  }
  static Kilometers(value: number): Length<'Kilometer'> {
    return new Length(value, 'Kilometer')
  }
  static Meters(value: number): Length<'Meter'> {
    return new Length(value, 'Meter')
  }
  static Centimeters(value: number): Length<'Centimeter'> {
    return new Length(value, 'Centimeter')
  }
  static Millimeters(value: number): Length<'Millimeter'> {
    return new Length(value, 'Millimeter')
  }
  static NauticalMiles(value: number): Length<'Nautical Mile'> {
    return new Length(value, 'Nautical Mile')
  }
  static Miles(value: number): Length<'Mile'> {
    return new Length(value, 'Mile')
  }
  static Yards(value: number): Length<'Yard'> {
    return new Length(value, 'Yard')
  }
  static Feet(value: number): Length<'Foot'> {
    return new Length(value, 'Foot')
  }
  static Inches(value: number): Length<'Inch'> {
    return new Length(value, 'Inch')
  }

  /**
   * Converts a length of arbitrary units to a length of specified units.
   */
  static convert<L extends LengthUnit>(from: Length<LengthUnit>, toUnit: L): Length<L> {
    const value = from.value * LENGTH_CONVERSION_FACTORS[from.unit][toUnit]
    return new Length(value, toUnit)
  }

  /**
   * Normalizes an array of possibly mixed length units to an array of lengths with
   * homogeneous units.
   */
  static normalize<T extends LengthUnit>(lengths: Length[], toUnit: T): Length<T>[] {
    return lengths.map(l => Length.convert(l, toUnit))
  }
}

/**
 * Generate complete conversion factors between any two length units.  Returns a map whose
 * outermost keys are the "from" unit and the innermost keys are the "to" unit.
 *
 * In the future, this function may be used for code generation; it enables easy creation
 * of conversions (by using arithmetic operators), and results in a conversion lookup table.
 *
 * @example
 * const LENGTH_CONVERSION_FACTORS = generateLengthConversionFactors()
 * const meters = 1000
 * const km = meters * LENGTH_CONVERSION_FACTORS['Meter']['Kilometer'] // 1
 */
export function generateLengthConversionFactors(): Record<LengthUnit, Record<LengthUnit, number>> {
  const km_to_mi = 0.6213711922
  const mi_to_km = 1 / km_to_mi
  const m_to_ft = 3.280839895
  const ft_to_m = 1 / m_to_ft
  return {
    Kilometer: {
      Kilometer: 1,
      Meter: 1000,
      Centimeter: 1000 * 100,
      Millimeter: 1000 * 100 * 10,
      'Nautical Mile': 1 / 1.852,
      Mile: km_to_mi,
      Yard: (km_to_mi * 5280) / 3,
      Foot: km_to_mi * 5280,
      Inch: km_to_mi * 5280 * 12,
    },
    Meter: {
      Kilometer: 1 / 1000,
      Meter: 1,
      Centimeter: 100,
      Millimeter: 100 * 10,
      'Nautical Mile': 1 / 1852,
      Mile: m_to_ft / 5280,
      Yard: m_to_ft / 3,
      Foot: m_to_ft,
      Inch: m_to_ft * 12,
    },
    Centimeter: {
      Kilometer: 1 / 100 / 1000,
      Meter: 1 / 100,
      Centimeter: 1,
      Millimeter: 10,
      'Nautical Mile': 1 / 100 / 1852,
      Mile: ((1 / 100) * m_to_ft) / 5280,
      Yard: ((1 / 100) * m_to_ft) / 3,
      Foot: (1 / 100) * m_to_ft,
      Inch: (1 / 100) * m_to_ft * 12,
    },
    Millimeter: {
      Kilometer: 1 / 10 / 100 / 1000,
      Meter: 1 / 10 / 100,
      Centimeter: 1 / 10,
      Millimeter: 1,
      'Nautical Mile': 1 / 1000 / 1852,
      Mile: ((1 / 1000) * m_to_ft) / 5280,
      Yard: ((1 / 1000) * m_to_ft) / 5280 / 3,
      Foot: (1 / 1000) * m_to_ft,
      Inch: (1 / 1000) * m_to_ft * 12,
    },
    'Nautical Mile': {
      Kilometer: 1 / 1.852,
      Meter: 1 / 1852,
      Centimeter: 100 / 1852,
      Millimeter: 1000 / 1852,
      'Nautical Mile': 1,
      Mile: 1.150779448,
      Yard: 1.150779448 * 1760,
      Foot: 1.150779448 * 5280,
      Inch: 1.150779448 * 5280 * 12,
    },
    Mile: {
      Kilometer: mi_to_km,
      Meter: mi_to_km * 1000,
      Centimeter: mi_to_km * 1000 * 100,
      Millimeter: mi_to_km * 1000 * 1000,
      'Nautical Mile': mi_to_km / 1.852,
      Mile: 1,
      Yard: 5280 / 3,
      Foot: 5280,
      Inch: 5280 * 12,
    },
    Yard: {
      Kilometer: (3 * ft_to_m) / 1000,
      Meter: 3 * ft_to_m,
      Centimeter: 3 * ft_to_m * 100,
      Millimeter: 3 * ft_to_m * 1000,
      'Nautical Mile': (1 / 1760) * mi_to_km * 1.852,
      Mile: 3 / 5280,
      Yard: 1,
      Foot: 3,
      Inch: 3 * 12,
    },
    Foot: {
      Kilometer: ft_to_m / 1000,
      Meter: ft_to_m,
      Centimeter: ft_to_m * 100,
      Millimeter: ft_to_m * 1000,
      'Nautical Mile': (1 / 5280) * mi_to_km * 1.852,
      Mile: 1 / 5280,
      Yard: 1 / 3,
      Foot: 1,
      Inch: 12,
    },
    Inch: {
      Kilometer: ((1 / 12) * ft_to_m) / 1000,
      Meter: (1 / 12) * ft_to_m,
      Centimeter: (1 / 12) * ft_to_m * 100,
      Millimeter: (1 / 12) * ft_to_m * 1000,
      'Nautical Mile': (1 / 5280 / 12) * mi_to_km * 1.852,
      Mile: 1 / 5280 / 12,
      Yard: 1 / 12 / 3,
      Foot: 1 / 12,
      Inch: 1,
    },
  }
}

export const LENGTH_CONVERSION_FACTORS: Record<
  LengthUnit,
  Record<LengthUnit, number>
> = generateLengthConversionFactors()
