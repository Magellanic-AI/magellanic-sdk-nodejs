magellanic-sdk / [Exports](modules.md)

# Magellanic SDK for Node.js

The purpose of the Magellanic SDK for Node.js is to provide a quick and easy way to integrate any Node.js project with the Magellanic platform. Currently, it supports only Express.js, but there are plans to integrate with other popular frameworks, such as Fastify.

## Installation

The easiest way to get the latest version of Magellanic SDK for Node.js is to use yarn or npm:

[//]: # 'TODO: replace with proper npm package name'

```bash
yarn install .../magellanic-sdk
or
npm install -save .../magellanic-sdk
```

## Usage

> _**Note:**_ MagellanicClient documentation generated using [typedoc](https://github.com/TypeStrong/typedoc) can be found [here](docs/classes/MagellanicClient.md).

#### Examples

An example Node.js Express application that utilizes all Magellanic SDK for Node.js features can be found at ...

#### Simple Setup

Create the MagellanicClient instance:

```ts
import { MagellanicClient } from 'magellanic-sdk';

// Setup client
export const client = new MagellanicClient('mgl://example/TDTI/ID');
```

Setup endpoint that responds to webhook events sent by Magellanic:

```ts
import { NextFunction, Request } from 'express';
import { magellanicClient } from 'path/of/your/setup/file';

app.get('/magellanic-webhook', async (req: Request, res: Response) => {
  const response = await magellanicClient.handleWebhook(req.body);
  res.status(200).send(response);
});
```

Authenticate client:

> **_Important:_** _authenticate()_ method should be called after the application has been initialized - the webhook endpoint must be accessible by Magellanic.

```ts
import express from 'express';
import { magellanicClient } from 'path/of/your/setup/file';

const app = express();
const server = app.listen(3000);

server.on('listening', async () => {
  console.log(`🚀 App listening on the port 3000`);
  const result = await magellanicClient.authenticate();
  if (!result.authenticated) {
    console.log(result.reason);
    server.close();
  }
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

[//]: # 'TODO'
