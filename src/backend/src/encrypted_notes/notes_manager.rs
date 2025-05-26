use candid::{CandidType, Principal};
use ic_cdk::api::msg_caller;
use std::{cell::RefCell, collections::HashMap};

pub type EncryptedNoteData = Vec<u8>;

#[derive(Debug, Clone, CandidType)]
pub struct EncryptedNote {
    pub owner: Principal,
    pub data: Vec<u8>,
    pub created_at: u64,
    pub updated_at: u64,
}

thread_local! {
    static ENCRYPTED_NOTES: RefCell<HashMap<Principal, EncryptedNote>> = RefCell::new(HashMap::new());
}

pub struct NotesManager {}

impl NotesManager {
    pub fn save_note(encrypted_data: EncryptedNoteData) -> Result<EncryptedNote, String> {
        let caller = msg_caller();
        let now = ic_cdk::api::time();

        ENCRYPTED_NOTES.with_borrow_mut(|notes| {
            let note = match notes.get(&caller) {
                Some(existing_note) => EncryptedNote {
                    owner: caller,
                    data: encrypted_data,
                    created_at: existing_note.created_at,
                    updated_at: now,
                },
                None => EncryptedNote {
                    owner: caller,
                    data: encrypted_data,
                    created_at: now,
                    updated_at: now,
                },
            };

            notes.insert(caller, note.clone());
            Ok(note)
        })
    }

    pub fn get_note() -> Result<EncryptedNote, String> {
        let caller = msg_caller();

        ENCRYPTED_NOTES.with(|notes| {
            let notes = notes.borrow();
            notes
                .get(&caller)
                .cloned()
                .ok_or_else(|| "No note found for user".to_string())
        })
    }

    pub fn has_note() -> bool {
        let caller = msg_caller();

        ENCRYPTED_NOTES.with(|notes| {
            let notes = notes.borrow();
            notes.contains_key(&caller)
        })
    }

    pub fn delete_note() -> Result<bool, String> {
        let caller = msg_caller();

        ENCRYPTED_NOTES.with(|notes| {
            let mut notes = notes.borrow_mut();
            match notes.remove(&caller) {
                Some(_) => Ok(true),
                None => Err("No note found for user".to_string()),
            }
        })
    }
}
