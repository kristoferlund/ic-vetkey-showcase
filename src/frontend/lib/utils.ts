import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bigintToLEUint8Array(num: bigint, byteLength: number) {
  const arr = new Uint8Array(byteLength);
  let temp = num;
  for (let i = 0; i < byteLength; i++) {
    arr[i] = Number(temp & 0xffn);
    temp >>= 8n;
  }
  return arr;
}
