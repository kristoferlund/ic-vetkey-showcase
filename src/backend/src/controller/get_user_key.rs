use crate::{auth::auth_guard_no_anon, vetkey::vetkd_key_id};
use ic_cdk::api::msg_caller;
use ic_cdk::{
    management_canister::{vetkd_derive_key, VetKDDeriveKeyArgs},
    update,
};

#[update]
pub async fn get_user_key(transport_public_key: Vec<u8>) -> Result<Vec<u8>, String> {
    auth_guard_no_anon()?;

    let caller = msg_caller();
    let input = caller.as_slice().to_vec();

    let args = VetKDDeriveKeyArgs {
        input: input.clone(),
        context: vec![],
        transport_public_key,
        key_id: vetkd_key_id(),
    };

    let result = vetkd_derive_key(&args)
        .await
        .map_err(|_| "Failed to derive key")?;

    Ok(result.encrypted_key)
}
