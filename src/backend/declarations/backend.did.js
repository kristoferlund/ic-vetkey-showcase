export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : IDL.Text });
  const ReceivedMessage = IDL.Record({
    'id' : IDL.Nat64,
    'encrypted_data' : IDL.Vec(IDL.Nat8),
    'recipient' : IDL.Text,
    'sender' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(ReceivedMessage),
    'Err' : IDL.Text,
  });
  const SentMessage = IDL.Record({
    'id' : IDL.Nat64,
    'encrypted_data' : IDL.Vec(IDL.Nat8),
    'recipient' : IDL.Text,
    'sender' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Vec(SentMessage),
    'Err' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const EncryptedNote = IDL.Record({
    'updated_at' : IDL.Nat64,
    'owner' : IDL.Principal,
    'data' : IDL.Vec(IDL.Nat8),
    'created_at' : IDL.Nat64,
  });
  const Result_5 = IDL.Variant({ 'Ok' : EncryptedNote, 'Err' : IDL.Text });
  const TimeLock = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'locked' : IDL.Bool,
    'timelock_id' : IDL.Nat64,
  });
  const Result_6 = IDL.Variant({ 'Ok' : TimeLock, 'Err' : IDL.Text });
  return IDL.Service({
    'get_root_public_key' : IDL.Func([], [Result], []),
    'get_user_key' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [Result], []),
    'message_list_received' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'message_list_sent' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'message_send' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)],
        [Result_3],
        [],
      ),
    'notes_delete' : IDL.Func([], [Result_4], []),
    'notes_get' : IDL.Func([], [Result_5], ['query']),
    'notes_has' : IDL.Func([], [Result_4], ['query']),
    'notes_save' : IDL.Func([IDL.Vec(IDL.Nat8)], [Result_5], []),
    'timelock_create' : IDL.Func(
        [IDL.Nat64, IDL.Vec(IDL.Nat8)],
        [Result_6],
        [],
      ),
    'timelock_list' : IDL.Func([], [IDL.Vec(TimeLock)], ['query']),
    'timelock_open' : IDL.Func([IDL.Nat64], [Result_6], []),
  });
};
export const init = ({ IDL }) => { return []; };
