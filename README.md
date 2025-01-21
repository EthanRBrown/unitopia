# Unitopia

Types and utilities for associating units (dimensions) to quantities. The primary use case for Unitopia is
applications that deal with like measurements in possibly non-homogenous units. For example, an application
that allows the user to switch between pounds and kilograms, or tasks that can be measured in days or weeks.

What it provides:

- Type safety for working with dimensional values, making it more difficult to accidentally compare or perform arithmetic on dissimilar units.
- Ergonomic unit conversion & normalization.
- Serialization and deserialization to JSON.
- Zero dependencies.

Currently available dimensions:

- Length
- Mass (weight)
- Time

Coming soon:

- Money (currency)
- Power (Watt)
- Current (Ampere)
- Voltage (Volt)

Coming not-so-soon:

- Support for derived units & dimensional analysis

## Usage

### Creating Quantities

To create a quantity object, simply import the appropriate class and use the appropriate static method:

```ts
import { Mass } from '@zepln/unitopia'

const m1 = Mass.Pounds(100)
const m2 = Mass.Kilograms(22)
```

The type of `m1` will be `Mass<'Pound'>`, tye type of `m2` will be `Mass<'Kilogram'>`. You can also use the `Mass` constructor:

```ts
const m3 = new Mass(2, 'Short Ton')
```

The type of `m3` will be `Mass<'Short Ton'>`.

### Serializing Quantities

Quantities can be serialized directly with `JSON.stringify`:

```ts
JSON.stringify(m1) // {"dimension":"Mass","unit":"Pound","value":100}
```

### Deserializing Quantities

Deserialize with the `parse` or `tryParse` methods, which can accept either an object or a string (which will be parsed from JSON):

```ts
try {
  const m = Mass.parse({ dimension: 'Mass', unit: 'Gram', value: 100 })
  console.log(m)
} catch (err) {
  console.error('parsing error:', err.message)
}
const res = Mass.tryParse({ dimension: 'Mass', unit: 'Gram', value: 100 })
if ('error' in res) console.error('parsing error:', res.error)
else console.log(res.mass)
```

You can also deserialize a quantity of an unknown dimension:

```ts
import { parseQuantityJson } from '@zepln/unitopia'
try {
  const q = parseQuantityJson({ dimension: 'Mass', unit: 'Gram', value: 100 })
  console.log(q) // q is of type "Quantity"
} catch (err) {
  console.error('parsing error:', err.message)
}
```

### Unit Conversion

Simply call the static `convert` method and specify the desired unit:

```ts
import { Length } from '@zepln/unitopia'
const h1 = Length.Inches(71)
const h2 = Length.convert(h1, 'Centimeter') // h2.value is 180.34000000072135
```

### Unit Array Normalization

To normalize an array of possibly nonhomogeneous values, call the static `normalize` method:

```ts
const lengths = [Length.Inches(71), Length.Meters(0.5), Length.Feet(2.5)]
const lengths_in_cm = Length.normalize(length, 'Centimeter')
```

## Contributing

Please [open an issue](https://github.com/EthanRBrown/unitopia/issues) describing what you want to do, and we'll be in touch. If this project grows in popularity, we will develop a more formal process.
