use crate::{
    chainkey_testing_canister::{
        VetkdCurve, VetkdDeriveEncryptedKeyArgs, VetkdDeriveEncryptedKeyArgsKeyId,
        CHAINKEY_TESTING_CANISTER,
    },
    vetkey::{create_random_transport_key, get_root_public_key, VETKEY_PUBLIC_KEY_NAME},
};
use candid::CandidType;
use ic_vetkd_utils::IBECiphertext;
use serde_bytes::ByteBuf;
use std::{
    cell::RefCell,
    collections::{
        hash_map::Entry::{Occupied, Vacant},
        HashMap,
    },
};

pub type TimeLockId = u64;
// pub type TimeLockEncryptionKey = Vec<u8>;
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
    // pub async fn get_encryption_key(
    //     lock_release_time: u64,
    // ) -> Result<(TimeLockEncryptionKeyId, TimeLockEncryptionKey), String> {
    //     ic_cdk::println!("TIME: {}", ic_cdk::api::time());
    //     let lock_key_id = ic_cdk::api::time().saturating_add(lock_release_time);
    //     let lock_canister_public_key = get_canister_public_key().await;
    //     Ok((lock_key_id, lock_canister_public_key.to_vec()))
    // }

    pub fn list_locks() -> Vec<TimeLock> {
        TIME_LOCKS.with(|time_locks| {
            let time_locks = time_locks.borrow();
            time_locks.values().cloned().collect()
        })
    }

    pub fn create_lock(
        timelock_id: TimeLockId,
        encrypted_data: TimeLockEncryptedData,
    ) -> Result<bool, String> {
        // TODO: Validate data has been encrypted with the right key

        TIME_LOCKS.with(|time_locks| {
            let mut time_locks = time_locks.borrow_mut();

            match time_locks.entry(timelock_id) {
                Vacant(entry) => {
                    entry.insert(TimeLock {
                        timelock_id,
                        data: encrypted_data,
                        locked: true,
                    });
                    Ok(true)
                }
                Occupied(_) => Err("User already has a time lock.".to_string()),
            }
        })
    }

    pub async fn open_lock(timelock_id: TimeLockId) -> Result<TimeLock, String> {
        match TimeLockManager::get_lock(timelock_id) {
            Some(mut time_lock) => {
                if time_lock.locked {
                    ic_cdk::println!("Key ID: {}", timelock_id);
                    ic_cdk::println!("TIME: {}", ic_cdk::api::time());

                    if timelock_id >= ic_cdk::api::time() {
                        return Err("Time lock has not yet expired.".to_string());
                    }

                    let derivation_id = ByteBuf::from(timelock_id.to_le_bytes().to_vec());

                    ic_cdk::println!("Derivation ID: {:?}", derivation_id);

                    let transport_key = create_random_transport_key().await;
                    let transport_public_key = ByteBuf::from(transport_key.public_key());

                    let args = VetkdDeriveEncryptedKeyArgs {
                        key_id: VetkdDeriveEncryptedKeyArgsKeyId {
                            name: VETKEY_PUBLIC_KEY_NAME.to_string(),
                            curve: VetkdCurve::Bls12381G2,
                        },
                        derivation_path: vec![],
                        derivation_id: derivation_id.clone(),
                        encryption_public_key: transport_public_key,
                    };

                    let encrypted_vetkey = CHAINKEY_TESTING_CANISTER
                        .vetkd_derive_encrypted_key(args)
                        .await
                        .map(|(res,)| res.encrypted_key)
                        .map_err(|(code, msg)| format!("{}, code: {:?}", msg, code))?;

                    let root_public_key = get_root_public_key().await?;

                    ic_cdk::println!("Root Public Key: {:?}", root_public_key);

                    let vetkey = transport_key.decrypt(
                        &encrypted_vetkey,
                        &root_public_key,
                        &derivation_id,
                    )?;

                    let ibe_ciphertext = IBECiphertext::deserialize(time_lock.data.as_slice())?;

                    let decrypted_data = ibe_ciphertext.decrypt(&vetkey)?;

                    time_lock.data = decrypted_data.to_vec();
                    time_lock.locked = false;
                    Ok(time_lock)
                } else {
                    Ok(time_lock)
                }
            }
            None => Err("Lock not found.".to_string()),
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
                Vacant(_) => Err("User does not have a time lock.".to_string()),
                Occupied(entry) => {
                    entry.remove();
                    Ok(true)
                }
            }
        })
    }
}
