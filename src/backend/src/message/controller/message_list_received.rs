use crate::message::message_manager::{MessageManager, ReceivedMessage};
use ic_cdk::query;

#[query]
pub fn message_list_received(recipient_username: String) -> Result<Vec<ReceivedMessage>, String> {
    Ok(MessageManager::list_received_messages(recipient_username))
}
