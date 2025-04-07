use ic_cdk::query;

use crate::timelock::timelock_manager::{TimeLock, TimeLockManager};

#[query]
pub fn timelock_list() -> Vec<TimeLock> {
    TimeLockManager::list_locks()
}
