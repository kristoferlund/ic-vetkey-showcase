use crate::{
    timelock::timelock_manager::{TimeLock, TimeLockEncryptedData, TimeLockId, TimeLockManager},
};
use ic_cdk::update;

#[update]
async fn timelock_create(
    timelock_id: TimeLockId,
    encrypted_data: TimeLockEncryptedData,
) -> Result<TimeLock, String> {
    TimeLockManager::create_lock(timelock_id, encrypted_data)
}
