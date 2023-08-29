export type DilithiumMode = 2 | 3;

type WasmError = {
  error: string;
};

type DilithiumGenerateKeysResponse = {
  publicKey: string;
  privateKey: string;
};

type DilithiumSignResponse = {
  signature: string;
};

type DilithiumVerifyResponse = {
  result: boolean;
};

type DilithiumGenerateKeys = (
  mode: DilithiumMode,
) => DilithiumGenerateKeysResponse | WasmError;

type DilithiumSign = (
  mode: DilithiumMode,
  privateKey: string,
  message: string,
) => DilithiumSignResponse | WasmError;

type DilithiumVerify = (
  mode: DilithiumMode,
  publicKey: string,
  message: string,
  signature: string,
) => DilithiumVerifyResponse | WasmError;

type KyberGenerateKeysResponse = {
  publicKey: string;
  privateKey: string;
};

type KyberEncryptResponse = {
  ciphertext: string;
  secret: string;
};

type KyberDecryptResponse = {
  secret: string;
};

type KyberGenerateKeys = () => KyberGenerateKeysResponse | WasmError;

type KyberEncrypt = (publicKey: string) => KyberEncryptResponse | WasmError;

type KyberDecrypt = (
  privateKey: string,
  ciphertext: string,
) => KyberDecryptResponse | WasmError;

export interface CryptoService {
  dilithiumGenerateKeys: DilithiumGenerateKeys;
  dilithiumSign: DilithiumSign;
  dilithiumVerify: DilithiumVerify;
  kyberGenerateKeys: KyberGenerateKeys;
  kyberEncrypt: KyberEncrypt;
  kyberDecrypt: KyberDecrypt;
}
