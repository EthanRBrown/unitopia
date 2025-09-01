# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unitopia is a TypeScript library for handling measurement units with type safety. It provides types and utilities for working with dimensional values (length, mass, time, money) with automatic unit conversion and normalization.

## Commands

### Development
- `yarn test` - Run tests using Vitest
- `yarn build` - Build the library using Rollup (outputs to dist/ in UMD, CJS, and ESM formats)
- `yarn dev` - Build in watch mode for development
- `yarn publish` - Publish to JSR registry

### Testing Individual Files
- Run specific test: `yarn test test/[filename].test.ts`
- Run tests in watch mode: `yarn test --watch`

## Architecture

### Core Structure
The library uses a dimension-based architecture where each physical dimension (Length, Mass, Time, Money) is implemented as a separate class extending common patterns:

1. **Entry Point**: `src/main.ts` - Re-exports all dimensions
2. **Dimension Classes**: Each dimension (`src/length.ts`, `src/mass.ts`, `src/time.ts`, `src/money.ts`) implements:
   - Static factory methods for each unit (e.g., `Length.Meters()`, `Mass.Pounds()`)
   - `convert()` method for unit conversion
   - `normalize()` method for array normalization
   - `parse()` and `tryParse()` for deserialization
   - JSON serialization via `toJSON()`

3. **Type System**: 
   - Each dimension class is generic over its unit type for compile-time type safety
   - `src/quantity.ts` provides union types and parsing for unknown dimensions
   - `src/jsonTypes.ts` defines JSON serialization types

### Key Design Patterns
- **Immutable Values**: Quantity objects are designed to be immutable (though not enforced)
- **Type Safety**: TypeScript generics ensure unit consistency at compile time
- **Zero Dependencies**: Library has no runtime dependencies
- **Multi-Format Build**: Rollup generates UMD, CommonJS, and ES Module outputs

### Adding New Dimensions
To add a new dimension:
1. Create a new file in `src/` following the pattern of existing dimensions
2. Define the dimension constant, unit types, and conversion factors
3. Implement the class with static factory methods and conversion logic
4. Add exports to `src/main.ts`
5. Update `src/quantity.ts` to include the new dimension in union types
6. Add comprehensive tests in `test/`