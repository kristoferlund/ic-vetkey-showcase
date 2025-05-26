use ic_cdk::management_canister::{vetkd_public_key, VetKDCurve, VetKDKeyId, VetKDPublicKeyArgs};
use ic_vetkeys::TransportSecretKey;
use std::cell::RefCell;

pub static VETKEY_PUBLIC_KEY_NAME: &str = "dfx_test_key";

thread_local! {
    static CANISTER_PUBLIC_KEY: RefCell<Option<Vec<u8>>> = const { RefCell::new(None) };
}

pub fn vetkd_key_id() -> VetKDKeyId {
    VetKDKeyId {
        curve: VetKDCurve::Bls12_381_G2,
        name: VETKEY_PUBLIC_KEY_NAME.to_string(),
    }
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

    let args = VetKDPublicKeyArgs {
        key_id: vetkd_key_id(),
        context: vec![],
        canister_id: None,
    };

    let result = vetkd_public_key(&args)
        .await
        .map_err(|_| "Failed to retrieve root public key")?;

    let public_key = result.public_key;

    CANISTER_PUBLIC_KEY.with_borrow_mut(|canister_public_key| {
        *canister_public_key = Some(public_key.clone());
    });

    Ok(public_key)
}
