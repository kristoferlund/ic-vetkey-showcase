use crate::{
    auth::auth_guard_no_anon,
    timelock::timelock_manager::{TimeLockEncryptedData, TimeLockId, TimeLockManager},
};
use ic_cdk::update;

#[update]
async fn timelock_create(
    timelock_id: TimeLockId,
    encrypted_data: TimeLockEncryptedData,
) -> Result<bool, String> {
    auth_guard_no_anon()?;
    TimeLockManager::create_lock(timelock_id, encrypted_data)
}
