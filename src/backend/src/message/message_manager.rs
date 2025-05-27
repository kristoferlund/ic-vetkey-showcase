use candid::CandidType;
use std::{cell::RefCell, collections::HashMap};

pub type MessageId = u64;
pub type EncryptedMessageData = Vec<u8>;

#[derive(Debug, Clone, CandidType)]
pub struct Message {
    pub id: MessageId,
    pub sender: String,                 // username
    pub recipient: String,              // username
    pub ibe_encrypted_data: Vec<u8>,    // IBE encrypted for recipient
    pub sender_encrypted_data: Vec<u8>, // VetKey encrypted for sender
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType)]
pub struct ReceivedMessage {
    pub id: MessageId,
    pub sender: String,
    pub recipient: String,
    pub encrypted_data: Vec<u8>,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType)]
pub struct SentMessage {
    pub id: MessageId,
    pub sender: String,
    pub recipient: String,
    pub encrypted_data: Vec<u8>,
    pub timestamp: u64,
}

thread_local! {
    static MESSAGES: RefCell<HashMap<MessageId, Message>> = RefCell::new(HashMap::new());
    static MESSAGE_COUNTER: RefCell<MessageId> = const { RefCell::new(0) };
}

pub struct MessageManager {}

impl MessageManager {
    fn next_message_id() -> MessageId {
        MESSAGE_COUNTER.with(|counter| {
            let mut counter = counter.borrow_mut();
            *counter += 1;
            *counter
        })
    }

    pub fn send_message(
        sender_username: String,
        recipient_username: String,
        ibe_encrypted_data: EncryptedMessageData,
        sender_encrypted_data: EncryptedMessageData,
    ) -> Result<MessageId, String> {
        let now = ic_cdk::api::time();
        let message_id = Self::next_message_id();

        let message = Message {
            id: message_id,
            sender: sender_username,
            recipient: recipient_username,
            ibe_encrypted_data,
            sender_encrypted_data,
            timestamp: now,
        };

        MESSAGES.with(|messages| {
            messages.borrow_mut().insert(message_id, message);
        });

        Ok(message_id)
    }

    pub fn list_received_messages(recipient_username: String) -> Vec<ReceivedMessage> {
        MESSAGES.with(|messages| {
            let messages = messages.borrow();
            messages
                .values()
                .filter(|msg| msg.recipient == recipient_username)
                .map(|msg| ReceivedMessage {
                    id: msg.id,
                    sender: msg.sender.clone(),
                    recipient: msg.recipient.clone(),
                    encrypted_data: msg.ibe_encrypted_data.clone(),
                    timestamp: msg.timestamp,
                })
                .collect()
        })
    }

    pub fn list_sent_messages(sender_username: String) -> Vec<SentMessage> {
        MESSAGES.with(|messages| {
            let messages = messages.borrow();
            messages
                .values()
                .filter(|msg| msg.sender == sender_username)
                .map(|msg| SentMessage {
                    id: msg.id,
                    sender: msg.sender.clone(),
                    recipient: msg.recipient.clone(),
                    encrypted_data: msg.sender_encrypted_data.clone(),
                    timestamp: msg.timestamp,
                })
                .collect()
        })
    }

    pub fn _get_received_message(message_id: MessageId) -> Option<ReceivedMessage> {
        MESSAGES.with(|messages| {
            let messages = messages.borrow();
            messages.get(&message_id).map(|msg| ReceivedMessage {
                id: msg.id,
                sender: msg.sender.clone(),
                recipient: msg.recipient.clone(),
                encrypted_data: msg.ibe_encrypted_data.clone(),
                timestamp: msg.timestamp,
            })
        })
    }

    pub fn _get_sent_message(
        message_id: MessageId,
        sender_username: String,
    ) -> Option<SentMessage> {
        MESSAGES.with(|messages| {
            let messages = messages.borrow();
            messages
                .get(&message_id)
                .filter(|msg| msg.sender == sender_username)
                .map(|msg| SentMessage {
                    id: msg.id,
                    sender: msg.sender.clone(),
                    recipient: msg.recipient.clone(),
                    encrypted_data: msg.sender_encrypted_data.clone(),
                    timestamp: msg.timestamp,
                })
        })
    }
}
