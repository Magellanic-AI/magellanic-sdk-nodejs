type Mode = 2 | 3;

type WasmError = {
  error: string;
};

type SignResponse = {
  signature: string;
};

export type Sign = (
  mode: Mode,
  privateKey: string,
  message: string,
) => SignResponse | WasmError;
