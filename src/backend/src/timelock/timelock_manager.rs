use crate::{
    chainkey_testing_canister::{
        VetkdCurve, VetkdDeriveKeyArgs, VetkdDeriveKeyArgsKeyId, CHAINKEY_TESTING_CANISTER,
    },
    vetkey::{create_empty_transport_key, get_root_public_key, VETKEY_PUBLIC_KEY_NAME},
};
use candid::CandidType;
use ic_vetkeys::{DerivedPublicKey, EncryptedVetKey, IbeCiphertext};
use serde_bytes::ByteBuf;
use std::{
    cell::RefCell,
    collections::{
        hash_map::Entry::{Occupied, Vacant},
        HashMap,
    },
};

pub type TimeLockId = u64;
pub type TimeLockEncryptedData = Vec<u8>;

#[derive(Debug, Clone, CandidType)]
pub struct TimeLock {
    pub timelock_id: u64,
    pub data: Vec<u8>,
    pub locked: bool,
}

thread_local! {
    static TIME_LOCKS: RefCell<HashMap<TimeLockId, TimeLock>> = RefCell::new(HashMap::new());
}

pub struct TimeLockManager {}

impl TimeLockManager {
    pub fn list_locks() -> Vec<TimeLock> {
        TIME_LOCKS.with(|time_locks| {
            let time_locks = time_locks.borrow();
            time_locks.values().cloned().collect()
        })
    }

    pub fn create_lock(
        timelock_id: TimeLockId,
        encrypted_data: TimeLockEncryptedData,
    ) -> Result<TimeLock, String> {
        // TODO: Validate data has been encrypted with the right key

        TIME_LOCKS.with(|time_locks| {
            let mut time_locks = time_locks.borrow_mut();

            match time_locks.entry(timelock_id) {
                Vacant(entry) => {
                    let new_lock = TimeLock {
                        timelock_id,
                        data: encrypted_data.clone(),
                        locked: true,
                    };
                    entry.insert(new_lock.clone());
                    Ok(new_lock)
                }
                Occupied(_) => Err("Time lock already exists".to_string()),
            }
        })
    }

    pub async fn open_lock(timelock_id: TimeLockId) -> Result<TimeLock, String> {
        match TimeLockManager::get_lock(timelock_id) {
            Some(mut time_lock) => {
                if time_lock.locked {
                    if timelock_id >= ic_cdk::api::time() {
                        return Err("Time lock has not yet expired.".to_string());
                    }

                    let input = timelock_id.to_le_bytes().to_vec();
                    let transport_key = create_empty_transport_key();
                    let transport_public_key = transport_key.public_key().to_vec();

                    let args = VetkdDeriveKeyArgs {
                        input: ByteBuf::from(input.clone()),
                        context: ByteBuf::new(),
                        transport_public_key: ByteBuf::from(transport_public_key),
                        key_id: VetkdDeriveKeyArgsKeyId {
                            name: VETKEY_PUBLIC_KEY_NAME.to_string(),
                            curve: VetkdCurve::Bls12381G2,
                        },
                    };

                    let derived_key = CHAINKEY_TESTING_CANISTER
                        .vetkd_derive_key(args)
                        .await
                        .map(|(res,)| res.encrypted_key)
                        .map_err(|(code, msg)| format!("{}, code: {:?}", msg, code))?;

                    let encrypted_vetkey = EncryptedVetKey::deserialize(&derived_key)
                        .map_err(|_| "Failed to deserialize encrypted vetkey")?;

                    let root_public_key = get_root_public_key().await?;
                    let derived_root_public_key =
                        DerivedPublicKey::deserialize(&root_public_key)
                            .map_err(|_| "Failed to deserialize derived root public key.")?;

                    let vetkey = encrypted_vetkey
                        .decrypt_and_verify(&transport_key, &derived_root_public_key, &input)
                        .map_err(|_| "Failed to decrypt and verify vetkey")?;

                    let ibe_ciphertext = IbeCiphertext::deserialize(time_lock.data.as_slice())?;

                    let decrypted_data = ibe_ciphertext.decrypt(&vetkey)?;

                    time_lock.data = decrypted_data.to_vec();
                    time_lock.locked = false;

                    TIME_LOCKS.with_borrow_mut(|time_locks| {
                        time_locks.insert(timelock_id, time_lock.clone());
                    });

                    Ok(time_lock)
                } else {
                    Ok(time_lock)
                }
            }
            None => Err("TimeLock not found.".to_string()),
        }
    }

    pub fn get_lock(timelock_id: TimeLockId) -> Option<TimeLock> {
        TIME_LOCKS.with(|time_locks| {
            let time_locks = time_locks.borrow();
            time_locks.get(&timelock_id).cloned()
        })
    }

    pub fn _delete_lock(timlock_id: TimeLockId) -> Result<bool, String> {
        TIME_LOCKS.with(|time_locks| {
            let mut time_locks = time_locks.borrow_mut();
            match time_locks.entry(timlock_id) {
                Vacant(_) => Err("TimeLock does not exist.".to_string()),
                Occupied(entry) => {
                    entry.remove();
                    Ok(true)
                }
            }
        })
    }
}
