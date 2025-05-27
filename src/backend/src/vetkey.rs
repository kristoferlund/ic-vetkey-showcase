use ic_vetkeys::TransportSecretKey;
use serde_bytes::ByteBuf;
use std::cell::RefCell;

use crate::chainkey_testing_canister::{
    VetkdCurve, VetkdPublicKeyArgs, VetkdPublicKeyArgsKeyId, CHAINKEY_TESTING_CANISTER,
};

pub static VETKEY_PUBLIC_KEY_NAME: &str = "insecure_test_key_1";

thread_local! {
    static CANISTER_PUBLIC_KEY: RefCell<Option<Vec<u8>>> = const { RefCell::new(None) };
}

pub fn create_empty_transport_key() -> TransportSecretKey {
    let seed = vec![0u8; 32];
    TransportSecretKey::from_seed(seed).unwrap()
}

pub async fn get_root_public_key() -> Result<Vec<u8>, String> {
    if let Some(public_key) =
        CANISTER_PUBLIC_KEY.with_borrow(|canister_public_key| canister_public_key.clone())
    {
        return Ok(public_key);
    };

    let args = VetkdPublicKeyArgs {
        key_id: VetkdPublicKeyArgsKeyId {
            name: VETKEY_PUBLIC_KEY_NAME.to_string(),
            curve: VetkdCurve::Bls12381G2,
        },
        context: ByteBuf::new(),
        canister_id: None,
    };

    let public_key = CHAINKEY_TESTING_CANISTER
        .vetkd_public_key(args)
        .await
        .map(|(res,)| res.public_key)
        .map_err(|(code, msg)| format!("{}, code: {:?}", msg, code))?;

    CANISTER_PUBLIC_KEY.with_borrow_mut(|canister_public_key| {
        *canister_public_key = Some(public_key.clone().into_vec());
    });

    Ok(public_key.into_vec())
}
