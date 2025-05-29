use crate::vetkey;
use ic_cdk::update;

#[update]
pub async fn get_root_public_key() -> Result<Vec<u8>, String> {
    let root_pubkey = vetkey::get_root_public_key().await?;
    Ok(root_pubkey)
}
