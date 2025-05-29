use crate::timelock::timelock_manager::{TimeLock, TimeLockId, TimeLockManager};
use ic_cdk::update;

#[update]
pub async fn timelock_open(timelock_id: TimeLockId) -> Result<TimeLock, String> {
    TimeLockManager::open_lock(timelock_id).await
}
