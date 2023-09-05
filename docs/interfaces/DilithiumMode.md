[magellanic-sdk](../README.md) / [Exports](../modules.md) / DilithiumMode

# Interface: DilithiumMode

## Table of contents

### Methods

- [toExponential](DilithiumMode.md#toexponential)
- [toFixed](DilithiumMode.md#tofixed)
- [toLocaleString](DilithiumMode.md#tolocalestring)
- [toPrecision](DilithiumMode.md#toprecision)
- [toString](DilithiumMode.md#tostring)
- [valueOf](DilithiumMode.md#valueof)

## Methods

### toExponential

▸ **toExponential**(`fractionDigits?`): `string`

Returns a string containing a number represented in exponential notation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fractionDigits?` | `number` | Number of digits after the decimal point. Must be in the range 0 - 20, inclusive. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:576

___

### toFixed

▸ **toFixed**(`fractionDigits?`): `string`

Returns a string representing a number in fixed-point notation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fractionDigits?` | `number` | Number of digits after the decimal point. Must be in the range 0 - 20, inclusive. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:570

___

### toLocaleString

▸ **toLocaleString**(`locales?`, `options?`): `string`

Converts a number to a string by using the current or specified locale.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locales?` | `string` \| `string`[] | A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. |
| `options?` | `NumberFormatOptions` | An object that contains one or more properties that specify comparison options. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:4522

▸ **toLocaleString**(`locales?`, `options?`): `string`

Converts a number to a string by using the current or specified locale.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locales?` | `LocalesArgument` | A locale string, array of locale strings, Intl.Locale object, or array of Intl.Locale objects that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. |
| `options?` | `NumberFormatOptions` | An object that contains one or more properties that specify comparison options. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es2020.number.d.ts:27

___

### toPrecision

▸ **toPrecision**(`precision?`): `string`

Returns a string containing a number represented either in exponential or fixed-point notation with a specified number of digits.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `precision?` | `number` | Number of significant digits. Must be in the range 1 - 21, inclusive. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:582

___

### toString

▸ **toString**(`radix?`): `string`

Returns a string representation of an object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `radix?` | `number` | Specifies a radix for converting numeric values to strings. This value is only used for numbers. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:564

___

### valueOf

▸ **valueOf**(): `number`

Returns the primitive value of the specified object.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:585
