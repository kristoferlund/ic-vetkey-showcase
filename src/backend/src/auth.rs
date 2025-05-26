use candid::Principal;
use ic_cdk::api::msg_caller;

pub fn auth_guard_no_anon() -> Result<(), String> {
    match msg_caller() {
        caller if caller == Principal::anonymous() => {
            Err("Calls with the anonymous principal are not allowed.".to_string())
        }
        _ => Ok(()),
    }
}
