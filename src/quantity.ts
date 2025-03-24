import { Length } from './length.ts'
import { Mass } from './mass.ts'
import { Time } from './time.ts'
import { Money } from './money.ts'

import type { JsonObject } from './jsonTypes.ts'

/**
 * A union type that can represent any type of quantity.  Only useful in instances where
 * you need a collection of quantities of different dimensions.  Note that a collection of
 * dimensionally nonhomogeneous quantities cannot be meaningfully aggregated: for example,
 * there is no way to meaningfully add the values of a collection of quantities that contains
 * length and mass quantities.
 */
export type Quantity = Length | Mass | Time | Money

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

/**
 * The types of quantity dimensions currently available in the library.
 */
export type QuantityDimensions = Quantity['dimension']

/**
 * Helper type for QuantityTypeString.  Not exported because I don't see any particular
 * useful application other than building QuantityTypeString.
 */
type QuantityUnits<Q extends Quantity = Quantity> = Extract<Quantity, { dimension: Q['dimension'] }>['unit']

/**
 * A string that uniquely identifies a dimension and unit in the format `[Dimension] :: [Unit]`.
 * For example, 'Mass :: Kilogram' and 'Length :: Kilometer' are valid quantity type strings,
 * but 'Mass :: Kilometer' is not.
 */
export type QuantityTypeString<Q extends Quantity = Quantity> = Q extends Quantity & { dimension: Q['dimension'] }
  ? `${Q['dimension']} :: ${QuantityUnits<Q>}`
  : never
