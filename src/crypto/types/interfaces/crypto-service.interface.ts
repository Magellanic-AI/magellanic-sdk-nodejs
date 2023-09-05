import { DilithiumMode, TWasmError } from '../index';
import {
  DilithiumGenerateKeysResponse,
  DilithiumSignResponse,
  DilithiumVerifyResponse,
  KyberDecryptResponse,
  KyberEncryptResponse,
  KyberGenerateKeysResponse,
} from './index';

export type DilithiumGenerateKeys = (
  mode: DilithiumMode,
) => DilithiumGenerateKeysResponse | TWasmError;

export type DilithiumSign = (
  mode: DilithiumMode,
  privateKey: string,
  message: string,
) => DilithiumSignResponse | TWasmError;

export type DilithiumVerify = (
  mode: DilithiumMode,
  publicKey: string,
  message: string,
  signature: string,
) => DilithiumVerifyResponse | TWasmError;

export type KyberGenerateKeys = () => KyberGenerateKeysResponse | TWasmError;

export type KyberEncrypt = (
  publicKey: string,
) => KyberEncryptResponse | TWasmError;

export type KyberDecrypt = (
  privateKey: string,
  ciphertext: string,
) => KyberDecryptResponse | TWasmError;

export interface CryptoService {
  dilithiumGenerateKeys: DilithiumGenerateKeys;
  dilithiumSign: DilithiumSign;
  dilithiumVerify: DilithiumVerify;
  kyberGenerateKeys: KyberGenerateKeys;
  kyberEncrypt: KyberEncrypt;
  kyberDecrypt: KyberDecrypt;
}
