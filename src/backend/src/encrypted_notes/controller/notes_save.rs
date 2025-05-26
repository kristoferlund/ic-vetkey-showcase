use ic_cdk::update;

use crate::{
    auth::auth_guard_no_anon,
    encrypted_notes::notes_manager::{EncryptedNote, EncryptedNoteData, NotesManager},
};

#[update]
async fn notes_save(encrypted_data: EncryptedNoteData) -> Result<EncryptedNote, String> {
    auth_guard_no_anon()?;
    NotesManager::save_note(encrypted_data)
}