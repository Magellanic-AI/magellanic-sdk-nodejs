[@magellanic/magellanic-sdk](../README.md) / [Exports](../modules.md) / ForbiddenError

# Class: ForbiddenError

## Hierarchy

- `Error`

  ↳ **`ForbiddenError`**

## Table of contents

### Constructors

- [constructor](ForbiddenError.md#constructor)

### Properties

- [message](ForbiddenError.md#message)
- [name](ForbiddenError.md#name)
- [stack](ForbiddenError.md#stack)
- [prepareStackTrace](ForbiddenError.md#preparestacktrace)
- [stackTraceLimit](ForbiddenError.md#stacktracelimit)

### Methods

- [captureStackTrace](ForbiddenError.md#capturestacktrace)

## Constructors

### constructor

• **new ForbiddenError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |

#### Overrides

Error.constructor

#### Defined in

[src/client/errors/forbidden.error.ts:2](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/7e16304/src/client/errors/forbidden.error.ts#L2)

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
