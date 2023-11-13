[@magellanic/magellanic-sdk](../README.md) / [Exports](../modules.md) / UnauthorizedError

# Class: UnauthorizedError

## Hierarchy

- `Error`

  ↳ **`UnauthorizedError`**

## Table of contents

### Constructors

- [constructor](UnauthorizedError.md#constructor)

### Properties

- [message](UnauthorizedError.md#message)
- [name](UnauthorizedError.md#name)
- [stack](UnauthorizedError.md#stack)
- [prepareStackTrace](UnauthorizedError.md#preparestacktrace)
- [stackTraceLimit](UnauthorizedError.md#stacktracelimit)

### Methods

- [captureStackTrace](UnauthorizedError.md#capturestacktrace)

## Constructors

### constructor

• **new UnauthorizedError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |

#### Overrides

Error.constructor

#### Defined in

[src/client/errors/unauthorized.error.ts:2](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/7e16304/src/client/errors/unauthorized.error.ts#L2)

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
