use ic_cdk::query;

use crate::{
    auth::auth_guard_no_anon,
    encrypted_notes::notes_manager::{EncryptedNote, NotesManager},
};

#[query]
pub fn notes_get() -> Result<EncryptedNote, String> {
    auth_guard_no_anon()?;
    NotesManager::get_note()
}