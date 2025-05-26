use ic_cdk::export_candid;
use timelock::timelock_manager::{TimeLock, TimeLockEncryptedData, TimeLockId};
use encrypted_notes::notes_manager::{EncryptedNote, EncryptedNoteData};

mod auth;
mod controller;
mod encrypted_notes;
mod timelock;
mod vetkey;

export_candid!();
