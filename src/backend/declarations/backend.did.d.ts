import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : TimeLock } |
  { 'Err' : string };
export interface TimeLock {
  'data' : Uint8Array | number[],
  'locked' : boolean,
  'timelock_id' : bigint,
}
export interface _SERVICE {
  'get_root_public_key' : ActorMethod<[], Result>,
  'timelock_create' : ActorMethod<[bigint, Uint8Array | number[]], Result_1>,
  'timelock_list' : ActorMethod<[], Array<TimeLock>>,
  'timelock_open' : ActorMethod<[bigint], Result_1>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
