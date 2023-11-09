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
- [getConfig](MagellanicClient.md#getconfig)
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

[src/client/magellanic-client.ts:72](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L72)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<`void`\>

Method used to authenticate the workload.

#### Returns

`Promise`<`void`\>

**`Throws`**

[AuthenticateError](AuthenticateError.md)

#### Defined in

[src/client/magellanic-client.ts:115](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L115)

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

[ForbiddenError](ForbiddenError.md)

#### Defined in

[src/client/magellanic-client.ts:385](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L385)

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

[ForbiddenError](ForbiddenError.md)

#### Defined in

[src/client/magellanic-client.ts:412](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L412)

___

### dilithiumVerify

▸ **dilithiumVerify**(`mode`, `publicKey`, `message`, `signature`): `Promise`<[`DilithiumVerifyResponse`](../interfaces/DilithiumVerifyResponse.md)\>

Method used to verify the signature of provided message using Dilithium.

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

[ForbiddenError](ForbiddenError.md)

#### Defined in

[src/client/magellanic-client.ts:441](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L441)

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

[src/client/magellanic-client.ts:183](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L183)

___

### getConfig

▸ **getConfig**(`configId`): `Promise`<`Record`<`string`, `unknown`\>\>

Method used to pull configuration

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configId` | `string` | ID of the configuration to pull |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

**`Throws`**

[NotInitializedError](NotInitializedError.md)

**`Throws`**

[ForbiddenError](ForbiddenError.md)

#### Defined in

[src/client/magellanic-client.ts:287](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L287)

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

[src/client/magellanic-client.ts:166](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L166)

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

[ForbiddenError](ForbiddenError.md)

#### Defined in

[src/client/magellanic-client.ts:360](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L360)

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

[ForbiddenError](ForbiddenError.md)

#### Defined in

[src/client/magellanic-client.ts:336](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L336)

___

### kyberGenerateKeys

▸ **kyberGenerateKeys**(): `Promise`<[`KyberGenerateKeysResponse`](../interfaces/KyberGenerateKeysResponse.md)\>

Method used to generate Kyber private key/public key pair.

#### Returns

`Promise`<[`KyberGenerateKeysResponse`](../interfaces/KyberGenerateKeysResponse.md)\>

**`Throws`**

[ForbiddenError](ForbiddenError.md)

#### Defined in

[src/client/magellanic-client.ts:313](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L313)

___

### validateRequest

▸ **validateRequest**(`req`, `validationOptions?`): `void`

Method used to validate request from another workload. It throws errors on bad requests and returns nothing if
everything is as expected.
If you don't want to pass Express.js Request object, see [validateToken](MagellanicClient.md#validatetoken) method instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> | Express.js Request object |
| `validationOptions?` | [`ValidationOptions`](../interfaces/ValidationOptions.md) | additional validation options |

#### Returns

`void`

**`Throws`**

[RequestValidationError](RequestValidationError.md)

**`Throws`**

[NotInitializedError](NotInitializedError.md)

**`Throws`**

[TokenValidationError](TokenValidationError.md)

#### Defined in

[src/client/magellanic-client.ts:202](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L202)

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
| `token` | `string` | sender's token (acquired from the "magellanic-authorization" header) |

#### Returns

`void`

**`Throws`**

[TokenValidationError](TokenValidationError.md)

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Defined in

[src/client/magellanic-client.ts:229](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L229)

▸ **validateToken**(`workloadId`, `token`, `validationOptions`): `void`

Method used to validate token. It throws errors on bad requests and returns nothing if
everything is as expected.

See [validateRequest](MagellanicClient.md#validaterequest) method if using Express.js

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workloadId` | `string` | unique sender's ID (acquired from the "magellanic-workload-id" header) |
| `token` | `string` | sender's token (acquired from the "magellanic-authorization" header) |
| `validationOptions` | [`ValidationOptions`](../interfaces/ValidationOptions.md) | additional validation options |

#### Returns

`void`

**`Throws`**

[TokenValidationError](TokenValidationError.md)

**`Throws`**

[NotInitializedError](NotInitializedError.md)

#### Defined in

[src/client/magellanic-client.ts:242](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L242)

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

[authenticated](MagellanicClient.md) instance

**`Throws`**

[AuthenticateError](AuthenticateError.md)

**`Throws`**

[ProjectKeyMissingError](ProjectKeyMissingError.md) if projectKey is missing

#### Defined in

[src/client/magellanic-client.ts:58](https://github.com/Magellanic-AI/magellanic-sdk-nodejs/blob/76346bd/src/client/magellanic-client.ts#L58)
