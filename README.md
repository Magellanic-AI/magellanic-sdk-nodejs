# Magellanic SDK for Node.js

The purpose of the Magellanic SDK for Node.js is to provide a quick and easy way to integrate any Node.js project with the Magellanic platform. Currently, it supports only Express.js, but there are plans to integrate with other popular frameworks, such as Fastify.

## Magellanic Documentation

Learn more [here](https://docs.magellanic.ai).

## Installation

The easiest way to get the latest version of Magellanic SDK for Node.js is to use yarn or npm:

```bash
yarn add @magellanic/magellanic-sdk
or
npm install @magellanic/magellanic-sdk
```

## Usage

> _**Note:**_ MagellanicClient documentation generated using [typedoc](https://github.com/TypeStrong/typedoc) can be found [here](docs/classes/MagellanicClient.md).

#### Examples

An example Node.js Express application that utilizes all Magellanic SDK for Node.js features can be found at ...

#### Configuration

Magellanic SDK can be configured either by providing configuration object during MagellanicClient initialization or using environment variables.

| Environment variable         | Config parameter | Required | Description                                                                                                         |
|------------------------------|------------------|----------|---------------------------------------------------------------------------------------------------------------------|
| MAGELLANIC_PROJECT_KEY       | projectKey       | yes      | Magellanic project key that is available in Magellanic web app                                                      |
| MAGELLANIC_WORKLOAD_NAME     | provider         | no       | Optional workload name that will be shown in Magellanic web app (random uuid will be used otherwise)                |
| MAGELLANIC_WORKLOAD_PROVIDER | name             | no       | Optional provider type. Magellanic SDK will resolve it on its own, but providing it will make initialization faster |


#### Simple Setup

Create the MagellanicClient instance and authenticate:

```ts
import { MagellanicClient } from 'magellanic-sdk';

// Setup client
const client = new MagellanicClient({
  projectKey: 'mgl://3/2b8d8155-7530-49b0-ac4d-1a92cfc4c7ba',
  provider: 'k8s',
  name: 'My app',
});
await client.authenticate();
```

or

```ts
import { MagellanicClient } from 'magellanic-sdk';

const client = await MagellanicClient.createClient({
  projectKey: 'mgl://3/2b8d8155-7530-49b0-ac4d-1a92cfc4c7ba',
  provider: 'k8s',
  name: 'My app',
});
```

#### Generate Authorization Headers

When sending requests to another workload use _generateHeaders()_ method. <br>
Example:

```ts
import axios, { AxiosError } from 'axios';
import { NextFunction, Request } from 'express';
import { magellanicClient } from 'path/of/your/setup/file';

app.get('/example-endpoint', async (req: Request, res: Response) => {
  // do something with request payload
  // ...

  try {
    await axios.post(
      'https://other-workload.com/example-workload-endpoint',
      payload,
      {
        headers: magellanicClient.generateHeaders(),
      },
    );
  } catch (err) {
    // handle 401
  }

  res.status(200).send(response);
});
```

#### Authorizing Workloads

When receiving request from another workload, validate it using _validateRequest()_ method. <br>
Example:

```ts
import { NextFunction, Request } from 'express';
import { magellanicClient } from 'path/of/your/setup/file';

app.get('/example-workload-endpoint', async (req: Request, res: Response) => {
  try {
    await magellanicClient.validateRequest(req);
  } catch (err) {
    res.status(401).send(err.message);
  }
  // handle request as usual
  res.status(200).send(response);
});
```

## License

Apache License 2.0
