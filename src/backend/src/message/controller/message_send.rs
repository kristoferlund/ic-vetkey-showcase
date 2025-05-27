use crate::message::message_manager::{EncryptedMessageData, MessageId, MessageManager};
use ic_cdk::update;

#[update]
async fn message_send(
    sender_username: String,
    recipient_username: String,
    ibe_encrypted_data: EncryptedMessageData,
    sender_encrypted_data: EncryptedMessageData,
) -> Result<MessageId, String> {
    MessageManager::send_message(
        sender_username,
        recipient_username,
        ibe_encrypted_data,
        sender_encrypted_data,
    )
}
