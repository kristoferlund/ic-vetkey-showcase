export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const TimeLock = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'locked' : IDL.Bool,
    'timelock_id' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({ 'Ok' : TimeLock, 'Err' : IDL.Text });
  return IDL.Service({
    'get_root_public_key' : IDL.Func([], [Result], []),
    'timelock_create' : IDL.Func(
        [IDL.Nat64, IDL.Vec(IDL.Nat8)],
        [Result_1],
        [],
      ),
    'timelock_list' : IDL.Func([], [IDL.Vec(TimeLock)], ['query']),
    'timelock_open' : IDL.Func([IDL.Nat64], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
