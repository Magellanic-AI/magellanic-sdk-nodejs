[magellanic-sdk](../README.md) / [Exports](../modules.md) / MagellanicClient

# Class: MagellanicClient

Magellanic SDK Client base class

## Table of contents

### Constructors

- [constructor](MagellanicClient.md#constructor)

### Methods

- [authenticate](MagellanicClient.md#authenticate)
- [dilithiumGenerateKeys](MagellanicClient.md#dilithiumgeneratekeys)
- [dilithiumSign](MagellanicClient.md#dilithiumsign)
- [dilithiumVerify](MagellanicClient.md#dilithiumverify)
- [generateHeaders](MagellanicClient.md#generateheaders)
- [getMyToken](MagellanicClient.md#getmytoken)
- [kyberDecrypt](MagellanicClient.md#kyberdecrypt)
- [kyberEncrypt](MagellanicClient.md#kyberencrypt)
- [kyberGenerateKeys](MagellanicClient.md#kybergeneratekeys)
- [validateRequest](MagellanicClient.md#validaterequest)
- [validateToken](MagellanicClient.md#validatetoken)
- [createClient](MagellanicClient.md#createclient)

## Constructors

### constructor

• **new MagellanicClient**(`clientOptions?`)

The constructor of the "MagellanicClient" class.

**`Throws`**

[ProjectKeyMissingError](ProjectKeyMissingError.md) if projectKey is missing

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientOptions?` | [`ClientOptions`](../interfaces/ClientOptions.md) |

#### Defined in

[src/client/magellanic-client.ts:78](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L78)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<`void`\>

Method used to authenticate the workload.

**`Throws`**

[AuthenticateError](AuthenticateError.md)

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client/magellanic-client.ts:124](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L124)

___

### dilithiumGenerateKeys

▸ **dilithiumGenerateKeys**(`mode`): `Promise`<[`DilithiumGenerateKeysResponse`](../interfaces/DilithiumGenerateKeysResponse.md)\>

Method used to generate Dilithium private key/public key pair.

**`Throws`**

[WasmError](WasmError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`DilithiumMode`](../modules.md#dilithiummode) | Dilithium mode - 2 or 3 |

#### Returns

`Promise`<[`DilithiumGenerateKeysResponse`](../interfaces/DilithiumGenerateKeysResponse.md)\>

#### Defined in

[src/client/magellanic-client.ts:306](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L306)

___

### dilithiumSign

▸ **dilithiumSign**(`mode`, `privateKey`, `message`): `Promise`<[`DilithiumSignResponse`](../interfaces/DilithiumSignResponse.md)\>

Method used to generate a signature of provided message using Dilithium.

**`Throws`**

[WasmError](WasmError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`DilithiumMode`](../modules.md#dilithiummode) | Dilithium mode - 2 or 3 |
| `privateKey` | `string` | Dilithium private key generated using [dilithiumGenerateKeys](MagellanicClient.md#dilithiumgeneratekeys) |
| `message` | `string` | message you want to sign |

#### Returns

`Promise`<[`DilithiumSignResponse`](../interfaces/DilithiumSignResponse.md)\>

#### Defined in

[src/client/magellanic-client.ts:325](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L325)

___

### dilithiumVerify

▸ **dilithiumVerify**(`mode`, `publicKey`, `message`, `signature`): `Promise`<[`DilithiumVerifyResponse`](../interfaces/DilithiumVerifyResponse.md)\>

Method used to verify a signature of provided message using Dilithium.

**`Throws`**

[WasmError](WasmError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`DilithiumMode`](../modules.md#dilithiummode) | Dilithium mode - 2 or 3. Use the same as when signing. |
| `publicKey` | `string` | Dilithium public key generated using [dilithiumGenerateKeys](MagellanicClient.md#dilithiumgeneratekeys) |
| `message` | `string` | message received |
| `signature` | `string` | signature received |

#### Returns

`Promise`<[`DilithiumVerifyResponse`](../interfaces/DilithiumVerifyResponse.md)\>

#### Defined in

[src/client/magellanic-client.ts:350](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L350)

___

### generateHeaders

▸ **generateHeaders**(): `Record`<`string`, `string`\>

Method used to generate required HTTP headers for requests between two workloads.

```ts
await axios.post('.../external-app/example', payload, {
   headers: magellanicClient.generateHeaders(),
});
```

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Returns

`Record`<`string`, `string`\>

headers object

#### Defined in

[src/client/magellanic-client.ts:190](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L190)

___

### getMyToken

▸ **getMyToken**(): `string`

Method used to obtain the latest workload's token.

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Returns

`string`

the latest token of this workload

#### Defined in

[src/client/magellanic-client.ts:171](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L171)

___

### kyberDecrypt

▸ **kyberDecrypt**(`privateKey`, `ciphertext`): `Promise`<[`KyberDecryptResponse`](../interfaces/KyberDecryptResponse.md)\>

Method used to decrypt a secret using ciphertext

**`Throws`**

[WasmError](WasmError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `string` | Kyber public key generated using [kyberGenerateKeys](MagellanicClient.md#kybergeneratekeys) |
| `ciphertext` | `string` | Kyber ciphertext generated using [kyberEncrypt](MagellanicClient.md#kyberencrypt) |

#### Returns

`Promise`<[`KyberDecryptResponse`](../interfaces/KyberDecryptResponse.md)\>

#### Defined in

[src/client/magellanic-client.ts:286](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L286)

___

### kyberEncrypt

▸ **kyberEncrypt**(`publicKey`): `Promise`<[`KyberEncryptResponse`](../interfaces/KyberEncryptResponse.md)\>

Method used to generate Kyber secret and ciphertext

**`Throws`**

[WasmError](WasmError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `string` | Kyber public key generated using [kyberGenerateKeys](MagellanicClient.md#kybergeneratekeys) |

#### Returns

`Promise`<[`KyberEncryptResponse`](../interfaces/KyberEncryptResponse.md)\>

#### Defined in

[src/client/magellanic-client.ts:270](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L270)

___

### kyberGenerateKeys

▸ **kyberGenerateKeys**(): `Promise`<[`KyberGenerateKeysResponse`](../interfaces/KyberGenerateKeysResponse.md)\>

Method used to generate Kyber private key/public key pair.

**`Throws`**

[WasmError](WasmError.md)

#### Returns

`Promise`<[`KyberGenerateKeysResponse`](../interfaces/KyberGenerateKeysResponse.md)\>

#### Defined in

[src/client/magellanic-client.ts:255](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L255)

___

### validateRequest

▸ **validateRequest**(`req`): `Promise`<`void`\>

Method used to validate request from another workload. It throws errors on bad requests and returns nothing if
everything is as expected.
If you don't want to pass Express.js Request object, see [validateToken](MagellanicClient.md#validatetoken) method instead.

**`Throws`**

[RequestValidationError](RequestValidationError.md)

**`Throws`**

[NotInitializedError](NotInitializedError.md)

**`Throws`**

[TokenValidationError](TokenValidationError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> | Express.js Request object |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client/magellanic-client.ts:210](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L210)

___

### validateToken

▸ **validateToken**(`tdtiId`, `token`): `Promise`<`void`\>

Method used to validate token. It throws errors on bad requests and returns nothing if
everything is as expected.

See [validateRequest](MagellanicClient.md#validaterequest) method if using Express.js

**`Throws`**

[TokenValidationError](TokenValidationError.md)

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tdtiId` | `string` | unique sender's TDTI ID (acquired from the "magellanic-tdti-id" header) |
| `token` | `string` | sender's token (acquired from the "Authorization" header. Remove the "Bearer " prefix first) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client/magellanic-client.ts:234](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L234)

___

### createClient

▸ `Static` **createClient**(`clientOptions?`): `Promise`<[`MagellanicClient`](MagellanicClient.md)\>

A shorthand for
```ts
const magellanicClient = new MagellanicClient(clientOptions);
await magellanicClient.authenticate();
```

**`Throws`**

[AuthenticateError](AuthenticateError.md)

**`Throws`**

[ProjectKeyMissingError](ProjectKeyMissingError.md) if projectKey is missing

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientOptions?` | [`ClientOptions`](../interfaces/ClientOptions.md) |

#### Returns

`Promise`<[`MagellanicClient`](MagellanicClient.md)\>

authenticated [MagellanicClient](MagellanicClient.md) instance

#### Defined in

[src/client/magellanic-client.ts:64](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/0b7d1b6/src/client/magellanic-client.ts#L64)
