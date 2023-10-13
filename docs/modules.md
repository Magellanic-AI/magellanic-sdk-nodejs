[@magellanic/magellanic-sdk](README.md) / Exports

# @magellanic/magellanic-sdk

## Table of contents

### Classes

- [AuthenticateError](classes/AuthenticateError.md)
- [MagellanicClient](classes/MagellanicClient.md)
- [NotInitializedError](classes/NotInitializedError.md)
- [ProjectKeyMissingError](classes/ProjectKeyMissingError.md)
- [RequestValidationError](classes/RequestValidationError.md)
- [TokenValidationError](classes/TokenValidationError.md)
- [WasmError](classes/WasmError.md)

### Interfaces

- [ClientOptions](interfaces/ClientOptions.md)
- [DilithiumGenerateKeysResponse](interfaces/DilithiumGenerateKeysResponse.md)
- [DilithiumSignResponse](interfaces/DilithiumSignResponse.md)
- [DilithiumVerifyResponse](interfaces/DilithiumVerifyResponse.md)
- [KyberDecryptResponse](interfaces/KyberDecryptResponse.md)
- [KyberEncryptResponse](interfaces/KyberEncryptResponse.md)
- [KyberGenerateKeysResponse](interfaces/KyberGenerateKeysResponse.md)

### Type Aliases

- [DilithiumMode](modules.md#dilithiummode)
- [TWasmError](modules.md#twasmerror)

## Type Aliases

### DilithiumMode

Ƭ **DilithiumMode**: ``2`` \| ``3``

#### Defined in

[src/crypto/types/dilithium-mode.type.ts:1](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/crypto/types/dilithium-mode.type.ts#L1)

___

### TWasmError

Ƭ **TWasmError**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `string` |

#### Defined in

[src/crypto/types/wasm-error.type.ts:1](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/crypto/types/wasm-error.type.ts#L1)
