import { warn } from 'console'
import type { JsonObject } from 'type-fest'

/**
 * Supported cryptocurrencies.  THis is not currently a comprehensive list, but includes some of
 * the most commonly used cryptocurrencies.  See https://en.wikipedia.org/wiki/List_of_cryptocurrencies.
 */
export const CRYPTO_MONEY_UNITS = ['BTC', 'BCH', 'ETH', 'XNO', 'USDT'] as const

/**
 * Supported currencies (units of money).  This is not currently a comprehensive list,
 * but includes the most commonly used currencies (including some cryptocurrencies).
 * See https://en.wikipedia.org/wiki/ISO_4217.
 */
export const MONEY_UNITS = [
  'AUD',
  'BRL',
  'CAD',
  'CHF',
  'CNY',
  'CZK',
  'DKK',
  'EUR',
  'GBP',
  'HKD',
  'HUF',
  'ILS',
  'JPY',
  'MXN',
  'MYR',
  'NOK',
  'NZD',
  'PHP',
  'PLN',
  'SGD',
  'SEK',
  'TWD',
  'THB',
  'TRY',
  'USD',
  ...CRYPTO_MONEY_UNITS,
] as const

/**
 * Currency (unit of money).  We use the terminology "money unit" instead of
 * "currency" to align with the other quantities.
 */
export type MoneyUnit = (typeof MONEY_UNITS)[number]

/**
 * Money dimension string (interchangeable with Money.DIMENSION).
 */
export const MONEY_DIMENSION = 'Money' as const

/**
 * Possible errors when parsing money from JSON.
 */
export type MoneyParseError =
  | { error: `data.value is non-numeric`; value: any }
  | { error: `data.unit is missing or invalid` }
  | { error: `unsupported currency (money unit)`; unit: any }
  | { error: `data.updatedAt is non-numeric or invalid`; updatedAt: any }
  | { error: `data.dimension is not ${typeof MONEY_DIMENSION}`; dimension: any }
  | { error: `invalid JSON`; data: any }

/**
 * Possible warnings when parsing Money from JSON.
 */
export type MoneyParseWarning = {
  warning: 'data.updatedAt is missing; using current timestamp'
  currentTimestamp: number
}

/**
 * Money quantity.
 *
 * Note that conversion and normalization of money requires a service.  A future update
 * will include async conversion & normalization functions configured to use popular
 * currency conversion services.
 */
export class Money<T extends MoneyUnit = MoneyUnit> {
  /**
   * Available currencies (units of money).
   */
  static UNITS = MONEY_UNITS
  /**
   * Dimension string.
   */
  static DIMENSION = MONEY_DIMENSION
  /**
   * Dimension string.
   */
  readonly dimension = Money.DIMENSION
  /**
   * Constructs a money quantity with a value, currency (money unit) and optional timestamp
   * (since money values are a function of time).  If timestamp is not provided, the current
   * timestamp is used.
   */
  constructor(public value: number, public unit: T, public updatedAt: number = Date.now()) {}
  /**
   * Parses a money quantity from a JSON object or a string containing a JSON object.  If the
   * parsing fails, an error is thrown.  Note that warnings are handled by an optional callback
   * that will be invoked if there were warnings; use `tryParse` to get warnings more directly.
   */
  static parse(data: JsonObject | string, onWarnings?: (warnings: MoneyParseWarning[]) => void): Money {
    const res = Money.tryParse(data)
    if ('error' in res) throw new Error(res.error)
    if (onWarnings && res.warnings.length > 0) onWarnings(res.warnings)
    return res.money
  }
  /**
   * Attempts to parse a money quantity from a JSON object or string containing a JSON object.
   * If the parsing fails, an object containing the property "error" with a string description of
   * the error is returned.  Otherwise a valid Money instance is returned in the property `money`.
   */
  static tryParse(data: JsonObject | string): { money: Money; warnings: MoneyParseWarning[] } | MoneyParseError {
    try {
      const warnings: MoneyParseWarning[] = []
      const o = typeof data === 'string' ? (JSON.parse(data) as JsonObject) : data
      if (typeof o.value !== 'number') return { error: `data.value is non-numeric`, value: o.value }
      if (!('unit' in o) || typeof o.unit !== 'string') return { error: `data.unit is missing or invalid` }
      const unit = o.unit as MoneyUnit
      if (!Money.UNITS.includes(unit)) return { error: `unsupported currency (money unit)`, unit }
      let updatedAt = Date.now()
      if ('updatedAt' in o) {
        updatedAt = Number(o.updatedAt)
        if (!Number.isFinite(updatedAt)) return { error: `data.updatedAt is non-numeric or invalid`, updatedAt }
      } else {
        warnings.push({
          warning: 'data.updatedAt is missing; using current timestamp',
          currentTimestamp: updatedAt,
        })
      }
      const money = new Money(o.value, unit, updatedAt)
      if (o.dimension !== MONEY_DIMENSION)
        return { error: `data.dimension is not ${MONEY_DIMENSION}`, dimension: o.dimension }
      return { money, warnings }
    } catch (err) {
      return { error: `invalid JSON`, data }
    }
  }

  /**
   * Convenience constructor: USD.
   */
  static USD(value: number, updatedAt: number = Date.now()): Money<'USD'> {
    return new Money(value, 'USD', updatedAt)
  }
  /**
   * Convenience constructor: EUR.
   */
  static EUR(value: number, updatedAt: number = Date.now()): Money<'EUR'> {
    return new Money(value, 'EUR', updatedAt)
  }
  /**
   * Convenience constructor: CAD.
   */
  static CAD(value: number, updatedAt: number = Date.now()): Money<'CAD'> {
    return new Money(value, 'CAD', updatedAt)
  }
  /**
   * Convenience constructor: GBP.
   */
  static GBP(value: number, updatedAt: number = Date.now()): Money<'GBP'> {
    return new Money(value, 'GBP', updatedAt)
  }
  /**
   * Convenience constructor: CNY.
   */
  static CNY(value: number, updatedAt: number = Date.now()): Money<'CNY'> {
    return new Money(value, 'CNY', updatedAt)
  }
  /**
   * Convenience constructor: JPY.
   */
  static JPY(value: number, updatedAt: number = Date.now()): Money<'JPY'> {
    return new Money(value, 'JPY', updatedAt)
  }
  /**
   * Convenience constructor: CHF.
   */
  static CHF(value: number, updatedAt: number = Date.now()): Money<'CHF'> {
    return new Money(value, 'CHF', updatedAt)
  }
  /**
   * Convenience constructor: HKD.
   */
  static HKD(value: number, updatedAt: number = Date.now()): Money<'HKD'> {
    return new Money(value, 'HKD', updatedAt)
  }
  /**
   * Convenience constructor: MXN.
   */
  static MXN(value: number, updatedAt: number = Date.now()): Money<'MXN'> {
    return new Money(value, 'MXN', updatedAt)
  }
  /**
   * Convenience constructor: BTC.
   */
  static BTC(value: number, updatedAt: number = Date.now()): Money<'BTC'> {
    return new Money(value, 'BTC', updatedAt)
  }
  /**
   * Convenience constructor: ETH.
   */
  static ETH(value: number, updatedAt: number = Date.now()): Money<'ETH'> {
    return new Money(value, 'ETH', updatedAt)
  }
}
