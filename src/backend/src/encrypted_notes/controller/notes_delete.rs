use ic_cdk::update;

use crate::{
    auth::auth_guard_no_anon,
    encrypted_notes::notes_manager::NotesManager,
};

#[update]
async fn notes_delete() -> Result<bool, String> {
    auth_guard_no_anon()?;
    NotesManager::delete_note()
}