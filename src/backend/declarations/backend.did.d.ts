import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface EncryptedNote {
  'updated_at' : bigint,
  'owner' : Principal,
  'data' : Uint8Array | number[],
  'created_at' : bigint,
}
export interface ReceivedMessage {
  'id' : bigint,
  'encrypted_data' : Uint8Array | number[],
  'recipient' : string,
  'sender' : string,
  'timestamp' : bigint,
}
export type Result = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Array<ReceivedMessage> } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : Array<SentMessage> } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : EncryptedNote } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : TimeLock } |
  { 'Err' : string };
export interface SentMessage {
  'id' : bigint,
  'encrypted_data' : Uint8Array | number[],
  'recipient' : string,
  'sender' : string,
  'timestamp' : bigint,
}
export interface TimeLock {
  'data' : Uint8Array | number[],
  'locked' : boolean,
  'timelock_id' : bigint,
}
export interface _SERVICE {
  'get_root_public_key' : ActorMethod<[], Result>,
  'get_user_key' : ActorMethod<[Uint8Array | number[], string], Result>,
  'message_list_received' : ActorMethod<[string], Result_1>,
  'message_list_sent' : ActorMethod<[string], Result_2>,
  'message_send' : ActorMethod<
    [string, string, Uint8Array | number[], Uint8Array | number[]],
    Result_3
  >,
  'notes_delete' : ActorMethod<[], Result_4>,
  'notes_get' : ActorMethod<[], Result_5>,
  'notes_has' : ActorMethod<[], Result_4>,
  'notes_save' : ActorMethod<[Uint8Array | number[]], Result_5>,
  'timelock_create' : ActorMethod<[bigint, Uint8Array | number[]], Result_6>,
  'timelock_list' : ActorMethod<[], Array<TimeLock>>,
  'timelock_open' : ActorMethod<[bigint], Result_6>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
