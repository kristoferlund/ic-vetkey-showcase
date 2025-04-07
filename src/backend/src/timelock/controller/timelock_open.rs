use ic_cdk::update;

use crate::{
    auth::auth_guard_no_anon,
    timelock::timelock_manager::{TimeLock, TimeLockId, TimeLockManager},
};

#[update]
pub async fn timelock_open(timelock_id: TimeLockId) -> Result<TimeLock, String> {
    auth_guard_no_anon()?;
    TimeLockManager::open_lock(timelock_id).await
}
