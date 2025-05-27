use crate::vetkey::vetkd_key_id;
use ic_cdk::{
    management_canister::{vetkd_derive_key, VetKDDeriveKeyArgs},
    update,
};

// This function derives the encrypted VetKey for a given user. The VetKey is encrypted
// at creation time using the user's transport public key.
//
// IMPORTANT: The current implementation is not safe for production use. It is intended for
// demonstration purposes only. As the function accepts the username as a parameter, anyone
// can derive the encrypted VetKey for any user.
//
// A production implementation would most likely rely on the calling users identity instead
// of accepting the username as a parameter.
#[update]
pub async fn get_user_key(
    transport_public_key: Vec<u8>,
    username: String,
) -> Result<Vec<u8>, String> {
    let input = username.as_bytes().to_vec();

    let args = VetKDDeriveKeyArgs {
        input,
        context: vec![],
        transport_public_key,
        key_id: vetkd_key_id(),
    };

    let result = vetkd_derive_key(&args)
        .await
        .map_err(|_| "Failed to derive key")?;

    Ok(result.encrypted_key)
}
