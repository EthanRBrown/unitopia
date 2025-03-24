import { Length, LENGTH_DIMENSION, LengthUnit } from './length.ts'
import { Mass, MASS_DIMENSION, MassUnit } from './mass.ts'
import { Time, TIME_DIMENSION, TimeUnit } from './time.ts'
import { Money, MONEY_DIMENSION, MoneyUnit } from './money.ts'

import type { JsonObject } from './jsonTypes.ts'

/**
 * A union type that can represent any type of quantity.  Only useful in instances where
 * you need a collection of quantities of different dimensions.  Note that a collection of
 * dimensionally nonhomogeneous quantities cannot be meaningfully aggregated: for example,
 * there is no way to meaningfully add the values of a collection of quantities that contains
 * length and mass quantities.
 */
export type Quantity = Length | Mass | Time | Money

// IMPORTANT NOTE: this would be more efficiently defined as `Quantity['dimension']`, but this
// falls into the category of a "Slow Type" (https://jsr.io/docs/about-slow-types), and ends
// up as "any" in the published package; hence, this must be defined as shown here
/**
 * The types of quantity dimensions currently available in the library.
 */
export type QuantityDimension =
  | typeof LENGTH_DIMENSION
  | typeof MASS_DIMENSION
  | typeof TIME_DIMENSION
  | typeof MONEY_DIMENSION

type DimensionSeparator = ' :: '
/**
 * A string that uniquely identifies a dimension and unit in the format `[Dimension] :: [Unit]`.
 * For example, 'Mass :: Kilogram' and 'Length :: Kilometer' are valid quantity type strings,
 * but 'Mass :: Kilometer' is not.
 */
export type QuantityTypeString =
  | `${typeof LENGTH_DIMENSION}${DimensionSeparator}${LengthUnit}`
  | `${typeof MASS_DIMENSION}${DimensionSeparator}${MassUnit}`
  | `${typeof TIME_DIMENSION}${DimensionSeparator}${TimeUnit}`
  | `${typeof MONEY_DIMENSION}${DimensionSeparator}${MoneyUnit}`

/**
 * Given a JSON object, attempt to parse it as a quantity.  Based on the "dimension" property
 * of the object, the "parse" function fo the associated quantity type will be used (i.e.
 * if the "dimension" property is "Time", Time.parse will be used).
 */
export function parseQuantityJson(data: JsonObject): Quantity {
  if (!('dimension' in data)) throw new Error(`quantity object does not contain required property "dimension"`)
  switch (data.dimension) {
    case Length.DIMENSION:
      return Length.parse(data)
    case Mass.DIMENSION:
      return Mass.parse(data)
    case Time.DIMENSION:
      return Time.parse(data)
    case Money.DIMENSION:
      return Money.parse(data)
    default:
      throw new Error(`unrecognized/unsupported quantity dimension: ${data.dimension}`)
  }
}
