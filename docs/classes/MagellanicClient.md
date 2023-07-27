[magellanic-sdk](../README.md) / [Exports](../modules.md) / MagellanicClient

# Class: MagellanicClient

Magellanic SDK Client base class

## Table of contents

### Constructors

- [constructor](MagellanicClient.md#constructor)

### Methods

- [authenticate](MagellanicClient.md#authenticate)
- [generateHeaders](MagellanicClient.md#generateheaders)
- [getMyToken](MagellanicClient.md#getmytoken)
- [handleWebhook](MagellanicClient.md#handlewebhook)
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

[magellanic-client.ts:31](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/2a51d00/src/magellanic-client.ts#L31)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<{ `authenticated`: `boolean` ; `reason?`: `string`  }\>

Method used to authenticate the workload.

<b>IMPORTANT: This method must be called after the webhook endpoint has been initialized. Magellanic will attempt
to send an HTTP request during authentication and the application must be already able to respond correctly to
complete the authentication process.</b>

Does not throw errors, so it's safe to use in event listener function.

#### Returns

`Promise`<{ `authenticated`: `boolean` ; `reason?`: `string`  }\>

#### Defined in

[magellanic-client.ts:51](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/2a51d00/src/magellanic-client.ts#L51)

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

#### Defined in

[magellanic-client.ts:156](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/2a51d00/src/magellanic-client.ts#L156)

___

### getMyToken

▸ **getMyToken**(): `string`

Method used to obtain the latest workload's token.

#### Returns

`string`

the latest token of this workload

#### Defined in

[magellanic-client.ts:138](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/2a51d00/src/magellanic-client.ts#L138)

___

### handleWebhook

▸ **handleWebhook**(`payload`): `Promise`<`boolean`\>

Method used to handle incoming webhook event. Its return value should be sent as a response.

```ts
public webhooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await magellanicClient.handleWebhook(req.body);
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  };
app.get('/magellanic-webhook', async (req: Request, res: Response) => {
  const response = await magellanicClient.handleWebhook(req.body);
  res.status(200).send(response);
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` | request payload - Express.js Request object's body property |

#### Returns

`Promise`<`boolean`\>

promise with a boolean indicating the validation status of the payload

#### Defined in

[magellanic-client.ts:94](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/2a51d00/src/magellanic-client.ts#L94)

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

[magellanic-client.ts:173](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/2a51d00/src/magellanic-client.ts#L173)

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

[magellanic-client.ts:195](https://gitlab.com/magellanic/platform/magellanic-ciem/magellanic-ciem-sdk/-/blob/2a51d00/src/magellanic-client.ts#L195)
