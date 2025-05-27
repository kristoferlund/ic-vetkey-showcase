use crate::message::message_manager::{MessageManager, SentMessage};
use ic_cdk::query;

#[query]
pub fn message_list_sent(sender_username: String) -> Result<Vec<SentMessage>, String> {
    Ok(MessageManager::list_sent_messages(sender_username))
}
