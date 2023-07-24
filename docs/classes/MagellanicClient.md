[magellanic-sdk](../README.md) / [Exports](../modules.md) / MagellanicClient

# Class: MagellanicClient

Magellanic SDK Client base class

## Table of contents

### Constructors

- [constructor](MagellanicClient.md#constructor)

### Properties

- [authRandomString](MagellanicClient.md#authrandomstring)
- [axiosInstance](MagellanicClient.md#axiosinstance)
- [currentToken](MagellanicClient.md#currenttoken)
- [currentTokens](MagellanicClient.md#currenttokens)
- [currentTokensSecret](MagellanicClient.md#currenttokenssecret)
- [previousToken](MagellanicClient.md#previoustoken)
- [previousTokens](MagellanicClient.md#previoustokens)
- [previousTokensSecret](MagellanicClient.md#previoustokenssecret)
- [secret](MagellanicClient.md#secret)
- [tdtiId](MagellanicClient.md#tdtiid)

### Methods

- [authenticate](MagellanicClient.md#authenticate)
- [decryptPayload](MagellanicClient.md#decryptpayload)
- [generateHeaders](MagellanicClient.md#generateheaders)
- [getMyToken](MagellanicClient.md#getmytoken)
- [handleWebhook](MagellanicClient.md#handlewebhook)
- [reauthenticate](MagellanicClient.md#reauthenticate)
- [validateRequest](MagellanicClient.md#validaterequest)
- [validateToken](MagellanicClient.md#validatetoken)

## Constructors

### constructor

• **new MagellanicClient**(`tdtiId`)

The constructor of the "MagellanicClient" class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tdtiId` | `string` | unique TDTI ID assigned by Magellanic to the workload. Can be found on the workload's details page in Magellanic. |

#### Defined in

[magellanic.client.ts:31](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L31)

## Properties

### authRandomString

• `Private` **authRandomString**: `string`

#### Defined in

[magellanic.client.ts:14](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L14)

___

### axiosInstance

• `Private` `Readonly` **axiosInstance**: `AxiosInstance`

#### Defined in

[magellanic.client.ts:13](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L13)

___

### currentToken

• `Private` `Optional` **currentToken**: `string`

#### Defined in

[magellanic.client.ts:22](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L22)

___

### currentTokens

• `Private` `Optional` **currentTokens**: `Record`<`string`, `string`\>

#### Defined in

[magellanic.client.ts:20](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L20)

___

### currentTokensSecret

• `Private` `Optional` **currentTokensSecret**: `string`

#### Defined in

[magellanic.client.ts:16](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L16)

___

### previousToken

• `Private` `Optional` **previousToken**: `string`

#### Defined in

[magellanic.client.ts:23](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L23)

___

### previousTokens

• `Private` `Optional` **previousTokens**: `Record`<`string`, `string`\>

#### Defined in

[magellanic.client.ts:21](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L21)

___

### previousTokensSecret

• `Private` `Optional` **previousTokensSecret**: `string`

#### Defined in

[magellanic.client.ts:17](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L17)

___

### secret

• `Private` `Optional` **secret**: `string`

#### Defined in

[magellanic.client.ts:19](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L19)

___

### tdtiId

• `Private` `Readonly` **tdtiId**: `string`

unique TDTI ID assigned by Magellanic to the workload. Can be found on the workload's details page in
Magellanic.

#### Defined in

[magellanic.client.ts:31](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L31)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<`void`\>

Method used to authenticate the workload.

<b>IMPORTANT: This method must be called after the webhook endpoint has been initialized. Magellanic will attempt
to send an HTTP request during authentication, and the application must respond correctly to complete the
authentication process.</b>

#### Returns

`Promise`<`void`\>

#### Defined in

[magellanic.client.ts:49](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L49)

___

### decryptPayload

▸ `Private` **decryptPayload**(`payload`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `any` |

#### Returns

`any`

#### Defined in

[magellanic.client.ts:191](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L191)

___

### generateHeaders

▸ **generateHeaders**(): `Record`<`string`, `string`\>

Method used to generate required HTTP headers for requests between two workloads.

```
await axios.post('.../external-app/example', payload, {
   headers: magellanicClient.generateHeaders(),
});
```

#### Returns

`Record`<`string`, `string`\>

headers object

#### Defined in

[magellanic.client.ts:134](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L134)

___

### getMyToken

▸ **getMyToken**(): `string`

Method used to obtain the latest workload's token.

#### Returns

`string`

the latest token of this workload

#### Defined in

[magellanic.client.ts:116](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L116)

___

### handleWebhook

▸ **handleWebhook**(`payload`): `Promise`<`boolean`\>

Method used to handle incoming webhook event. Its return value should be sent as a response.

```
public webhooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await magellanicClient.handleWebhook(req.body);
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  };
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` | request payload - Express.js Request object's body property |

#### Returns

`Promise`<`boolean`\>

promise with a boolean indicating the validation status of the payload

#### Defined in

[magellanic.client.ts:72](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L72)

___

### reauthenticate

▸ `Private` **reauthenticate**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[magellanic.client.ts:186](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L186)

___

### validateRequest

▸ **validateRequest**(`req`): `void`

Method used to validate request from another workload. It throws errors on bad requests and returns nothing if
everything is as expected.
If you don't want to pass Express.js Request object, see [validateToken](MagellanicClient.md#validatetoken) method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> | Express.js Request object |

#### Returns

`void`

#### Defined in

[magellanic.client.ts:151](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L151)

___

### validateToken

▸ **validateToken**(`tdtiId`, `token`): `void`

Method used to validate token. It throws errors on bad requests and returns nothing if
everything is as expected.

See [validateRequest](MagellanicClient.md#validaterequest) method if using Express.js

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tdtiId` | `string` | unique sender's TDTI ID (acquired from the "magellanic-tdti-id" header) |
| `token` | `string` | sender's token (acquired from the "Authorization" header. Remove the "Bearer " prefix first) |

#### Returns

`void`

#### Defined in

[magellanic.client.ts:173](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/cb5f95a/src/magellanic.client.ts#L173)
