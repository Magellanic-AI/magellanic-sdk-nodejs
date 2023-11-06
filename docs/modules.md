[@magellanic/magellanic-sdk](README.md) / Exports

# @magellanic/magellanic-sdk

## Table of contents

### Classes

- [AuthenticateError](classes/AuthenticateError.md)
- [ForbiddenError](classes/ForbiddenError.md)
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
- [ValidationOptions](interfaces/ValidationOptions.md)

### Type Aliases

- [DilithiumMode](modules.md#dilithiummode)
- [TWasmError](modules.md#twasmerror)

## Type Aliases

### DilithiumMode

Ƭ **DilithiumMode**: ``2`` \| ``3``

#### Defined in

[src/crypto/types/dilithium-mode.type.ts:1](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/0e4ce76/src/crypto/types/dilithium-mode.type.ts#L1)

___

### TWasmError

Ƭ **TWasmError**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `string` |

#### Defined in

[src/crypto/types/wasm-error.type.ts:1](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/0e4ce76/src/crypto/types/wasm-error.type.ts#L1)
