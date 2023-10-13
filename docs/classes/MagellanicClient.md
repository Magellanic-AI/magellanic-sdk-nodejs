[@magellanic/magellanic-sdk](../README.md) / [Exports](../modules.md) / MagellanicClient

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientOptions?` | [`ClientOptions`](../interfaces/ClientOptions.md) |

**`Throws`**

[ProjectKeyMissingError](ProjectKeyMissingError.md) if projectKey is missing

#### Defined in

[src/client/magellanic-client.ts:76](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L76)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<`void`\>

Method used to authenticate the workload.

#### Returns

`Promise`<`void`\>

**`Throws`**

[AuthenticateError](AuthenticateError.md)

#### Defined in

[src/client/magellanic-client.ts:118](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L118)

___

### dilithiumGenerateKeys

▸ **dilithiumGenerateKeys**(`mode`): `Promise`<[`DilithiumGenerateKeysResponse`](../interfaces/DilithiumGenerateKeysResponse.md)\>

Method used to generate Dilithium private key/public key pair.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`DilithiumMode`](../modules.md#dilithiummode) | Dilithium mode - 2 or 3 |

#### Returns

`Promise`<[`DilithiumGenerateKeysResponse`](../interfaces/DilithiumGenerateKeysResponse.md)\>

**`Throws`**

[WasmError](WasmError.md)

#### Defined in

[src/client/magellanic-client.ts:308](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L308)

___

### dilithiumSign

▸ **dilithiumSign**(`mode`, `privateKey`, `message`): `Promise`<[`DilithiumSignResponse`](../interfaces/DilithiumSignResponse.md)\>

Method used to generate a signature of provided message using Dilithium.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`DilithiumMode`](../modules.md#dilithiummode) | Dilithium mode - 2 or 3 |
| `privateKey` | `string` | Dilithium private key generated using [dilithiumGenerateKeys](MagellanicClient.md#dilithiumgeneratekeys) |
| `message` | `string` | message you want to sign |

#### Returns

`Promise`<[`DilithiumSignResponse`](../interfaces/DilithiumSignResponse.md)\>

**`Throws`**

[WasmError](WasmError.md)

#### Defined in

[src/client/magellanic-client.ts:327](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L327)

___

### dilithiumVerify

▸ **dilithiumVerify**(`mode`, `publicKey`, `message`, `signature`): `Promise`<[`DilithiumVerifyResponse`](../interfaces/DilithiumVerifyResponse.md)\>

Method used to verify a signature of provided message using Dilithium.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`DilithiumMode`](../modules.md#dilithiummode) | Dilithium mode - 2 or 3. Use the same as when signing. |
| `publicKey` | `string` | Dilithium public key generated using [dilithiumGenerateKeys](MagellanicClient.md#dilithiumgeneratekeys) |
| `message` | `string` | message received |
| `signature` | `string` | signature received |

#### Returns

`Promise`<[`DilithiumVerifyResponse`](../interfaces/DilithiumVerifyResponse.md)\>

**`Throws`**

[WasmError](WasmError.md)

#### Defined in

[src/client/magellanic-client.ts:352](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L352)

___

### generateHeaders

▸ **generateHeaders**(): `Record`<`string`, `string`\>

Method used to generate required HTTP headers for requests between two workloads.

```ts
await axios.post('.../external-app/example', payload, {
   headers: magellanicClient.generateHeaders(),
});
```

#### Returns

`Record`<`string`, `string`\>

headers object

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Defined in

[src/client/magellanic-client.ts:192](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L192)

___

### getMyToken

▸ **getMyToken**(): `string`

Method used to obtain the latest workload's token.

#### Returns

`string`

the latest token of this workload

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Defined in

[src/client/magellanic-client.ts:175](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L175)

___

### kyberDecrypt

▸ **kyberDecrypt**(`privateKey`, `ciphertext`): `Promise`<[`KyberDecryptResponse`](../interfaces/KyberDecryptResponse.md)\>

Method used to decrypt a secret using ciphertext

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `string` | Kyber public key generated using [kyberGenerateKeys](MagellanicClient.md#kybergeneratekeys) |
| `ciphertext` | `string` | Kyber ciphertext generated using [kyberEncrypt](MagellanicClient.md#kyberencrypt) |

#### Returns

`Promise`<[`KyberDecryptResponse`](../interfaces/KyberDecryptResponse.md)\>

**`Throws`**

[WasmError](WasmError.md)

#### Defined in

[src/client/magellanic-client.ts:288](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L288)

___

### kyberEncrypt

▸ **kyberEncrypt**(`publicKey`): `Promise`<[`KyberEncryptResponse`](../interfaces/KyberEncryptResponse.md)\>

Method used to generate Kyber secret and ciphertext

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `string` | Kyber public key generated using [kyberGenerateKeys](MagellanicClient.md#kybergeneratekeys) |

#### Returns

`Promise`<[`KyberEncryptResponse`](../interfaces/KyberEncryptResponse.md)\>

**`Throws`**

[WasmError](WasmError.md)

#### Defined in

[src/client/magellanic-client.ts:272](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L272)

___

### kyberGenerateKeys

▸ **kyberGenerateKeys**(): `Promise`<[`KyberGenerateKeysResponse`](../interfaces/KyberGenerateKeysResponse.md)\>

Method used to generate Kyber private key/public key pair.

#### Returns

`Promise`<[`KyberGenerateKeysResponse`](../interfaces/KyberGenerateKeysResponse.md)\>

**`Throws`**

[WasmError](WasmError.md)

#### Defined in

[src/client/magellanic-client.ts:257](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L257)

___

### validateRequest

▸ **validateRequest**(`req`): `void`

Method used to validate request from another workload. It throws errors on bad requests and returns nothing if
everything is as expected.
If you don't want to pass Express.js Request object, see [validateToken](MagellanicClient.md#validatetoken) method instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> | Express.js Request object |

#### Returns

`void`

**`Throws`**

[RequestValidationError](RequestValidationError.md)

**`Throws`**

[NotInitializedError](NotInitializedError.md)

**`Throws`**

[TokenValidationError](TokenValidationError.md)

#### Defined in

[src/client/magellanic-client.ts:210](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L210)

___

### validateToken

▸ **validateToken**(`workloadId`, `token`): `void`

Method used to validate token. It throws errors on bad requests and returns nothing if
everything is as expected.

See [validateRequest](MagellanicClient.md#validaterequest) method if using Express.js

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workloadId` | `string` | unique sender's ID (acquired from the "magellanic-workload-id" header) |
| `token` | `string` | sender's token (acquired from the "Authorization" header. Remove the "Bearer " prefix first) |

#### Returns

`void`

**`Throws`**

[TokenValidationError](TokenValidationError.md)

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Defined in

[src/client/magellanic-client.ts:234](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L234)

___

### createClient

▸ `Static` **createClient**(`clientOptions?`): `Promise`<[`MagellanicClient`](MagellanicClient.md)\>

A shorthand for
```ts
const magellanicClient = new MagellanicClient(clientOptions);
await magellanicClient.authenticate();
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientOptions?` | [`ClientOptions`](../interfaces/ClientOptions.md) |

#### Returns

`Promise`<[`MagellanicClient`](MagellanicClient.md)\>

authenticated [MagellanicClient](MagellanicClient.md) instance

**`Throws`**

[AuthenticateError](AuthenticateError.md)

**`Throws`**

[ProjectKeyMissingError](ProjectKeyMissingError.md) if projectKey is missing

#### Defined in

[src/client/magellanic-client.ts:62](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/3ca1172/src/client/magellanic-client.ts#L62)
