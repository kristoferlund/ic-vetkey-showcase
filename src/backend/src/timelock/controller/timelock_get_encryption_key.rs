// use crate::{auth::auth_guard_no_anon, timelock::timelock_manager::TimeLockManager};
// use candid::CandidType;
// use ic_cdk::update;
//
// #[derive(Debug, Clone, CandidType)]
// pub struct TimeLockGetEncryptionKeyResponse {
//     pub lock_key_id: u64,
//     pub lock_public_key: Vec<u8>,
// }
//
// #[update]
// pub async fn timelock_get_encryption_key(
//     lock_release_time: u64,
// ) -> Result<TimeLockGetEncryptionKeyResponse, String> {
//     auth_guard_no_anon()?;
//     let (lock_key_id, lock_public_key) =
//         TimeLockManager::get_encryption_key(lock_release_time).await?;
//     Ok(TimeLockGetEncryptionKeyResponse {
//         lock_key_id,
//         lock_public_key,
//     })
// }
