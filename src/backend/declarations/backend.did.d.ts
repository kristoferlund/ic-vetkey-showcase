import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface EncryptedNote {
  'updated_at' : bigint,
  'owner' : Principal,
  'data' : Uint8Array | number[],
  'created_at' : bigint,
}
export type Result = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : EncryptedNote } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : TimeLock } |
  { 'Err' : string };
export interface TimeLock {
  'data' : Uint8Array | number[],
  'locked' : boolean,
  'timelock_id' : bigint,
}
export interface _SERVICE {
  'get_root_public_key' : ActorMethod<[], Result>,
  'get_user_key' : ActorMethod<[Uint8Array | number[]], Result>,
  'notes_delete' : ActorMethod<[], Result_1>,
  'notes_get' : ActorMethod<[], Result_2>,
  'notes_has' : ActorMethod<[], Result_1>,
  'notes_save' : ActorMethod<[Uint8Array | number[]], Result_2>,
  'timelock_create' : ActorMethod<[bigint, Uint8Array | number[]], Result_3>,
  'timelock_list' : ActorMethod<[], Array<TimeLock>>,
  'timelock_open' : ActorMethod<[bigint], Result_3>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
