export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const EncryptedNote = IDL.Record({
    'updated_at' : IDL.Nat64,
    'owner' : IDL.Principal,
    'data' : IDL.Vec(IDL.Nat8),
    'created_at' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({ 'Ok' : EncryptedNote, 'Err' : IDL.Text });
  const TimeLock = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'locked' : IDL.Bool,
    'timelock_id' : IDL.Nat64,
  });
  const Result_3 = IDL.Variant({ 'Ok' : TimeLock, 'Err' : IDL.Text });
  return IDL.Service({
    'get_root_public_key' : IDL.Func([], [Result], []),
    'get_user_key' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [Result], []),
    'notes_delete' : IDL.Func([], [Result_1], []),
    'notes_get' : IDL.Func([], [Result_2], ['query']),
    'notes_has' : IDL.Func([], [Result_1], ['query']),
    'notes_save' : IDL.Func([IDL.Vec(IDL.Nat8)], [Result_2], []),
    'timelock_create' : IDL.Func(
        [IDL.Nat64, IDL.Vec(IDL.Nat8)],
        [Result_3],
        [],
      ),
    'timelock_list' : IDL.Func([], [IDL.Vec(TimeLock)], ['query']),
    'timelock_open' : IDL.Func([IDL.Nat64], [Result_3], []),
  });
};
export const init = ({ IDL }) => { return []; };
