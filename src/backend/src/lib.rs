use ic_cdk::export_candid;
use timelock::timelock_manager::{TimeLock, TimeLockEncryptedData, TimeLockId};

mod auth;
mod controller;
mod timelock;
mod vetkey;

export_candid!();
