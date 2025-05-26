use ic_cdk::query;

use crate::{
    auth::auth_guard_no_anon,
    encrypted_notes::notes_manager::NotesManager,
};

#[query]
pub fn notes_has() -> Result<bool, String> {
    auth_guard_no_anon()?;
    Ok(NotesManager::has_note())
}