use crate::{
    chainkey_testing_canister::{
        VetkdCurve, VetkdDeriveKeyArgs, VetkdDeriveKeyArgsKeyId, CHAINKEY_TESTING_CANISTER,
    },
    vetkey::VETKEY_PUBLIC_KEY_NAME,
};
use ic_cdk::update;
use serde_bytes::ByteBuf;

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

    let args = VetkdDeriveKeyArgs {
        input: ByteBuf::from(input),
        context: ByteBuf::new(),
        transport_public_key: ByteBuf::from(transport_public_key),
        key_id: VetkdDeriveKeyArgsKeyId {
            name: VETKEY_PUBLIC_KEY_NAME.to_string(),
            curve: VetkdCurve::Bls12381G2,
        },
    };

    let encrypted_key = CHAINKEY_TESTING_CANISTER
        .vetkd_derive_key(args)
        .await
        .map(|(res,)| res.encrypted_key)
        .map_err(|(code, msg)| format!("{}, code: {:?}", msg, code))?;

    Ok(encrypted_key.into_vec())
}
