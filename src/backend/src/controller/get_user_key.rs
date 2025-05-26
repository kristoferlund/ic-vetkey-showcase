use ic_cdk::update;

use crate::{
    auth::auth_guard_no_anon,
    vetkey::{system_api_canister_id, vetkd_key_id},
};
use ic_cdk::api::msg_caller;
use ic_vetkeys::vetkd_api_types::{VetKDDeriveKeyReply, VetKDDeriveKeyRequest};

#[update]
pub async fn get_user_key(transport_public_key: Vec<u8>) -> Result<Vec<u8>, String> {
    auth_guard_no_anon()?;

    let caller = msg_caller();
    let input = caller.as_slice().to_vec();

    let args = VetKDDeriveKeyRequest {
        input: input.clone(),
        context: vec![],
        transport_public_key,
        key_id: vetkd_key_id(),
    };

    let response = ic_cdk::call::Call::unbounded_wait(system_api_canister_id(), "vetkd_derive_key")
        .with_arg(args)
        .with_cycles(26_153_846_153)
        .await
        .unwrap();

    let result = response
        .candid::<VetKDDeriveKeyReply>()
        .map_err(|e| e.to_string())?;

    Ok(result.encrypted_key)
}
