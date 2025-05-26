use ic_cdk::management_canister::CanisterId;
use ic_vetkeys::{
    vetkd_api_types::{VetKDCurve, VetKDKeyId, VetKDPublicKeyReply, VetKDPublicKeyRequest},
    TransportSecretKey,
};
use std::cell::RefCell;
use std::str::FromStr;

pub static VETKEY_PUBLIC_KEY_NAME: &str = "dfx_test_key";

thread_local! {
    static CANISTER_PUBLIC_KEY: RefCell<Option<Vec<u8>>> = const { RefCell::new(None) };
}

pub fn system_api_canister_id() -> CanisterId {
    CanisterId::from_str("aaaaa-aa").unwrap()
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

    let args = VetKDPublicKeyRequest {
        key_id: vetkd_key_id(),
        context: vec![],
        canister_id: None,
    };

    let response = ic_cdk::call::Call::unbounded_wait(system_api_canister_id(), "vetkd_public_key")
        .with_arg(args)
        .await
        .unwrap();

    let public_key = response
        .candid::<VetKDPublicKeyReply>()
        .map_err(|e| e.to_string())?
        .public_key;

    CANISTER_PUBLIC_KEY.with_borrow_mut(|canister_public_key| {
        *canister_public_key = Some(public_key.clone());
    });

    Ok(public_key)
}
