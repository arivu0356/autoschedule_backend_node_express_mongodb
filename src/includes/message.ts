const Message = {
    error: {
        account_not_found: 'Your email address not registered. Please register it.',
        deleted_account: 'Your Account is deleted',
        account_inactive: 'Your Account InActive',
        incorrect_password:'incorrect_password',
        already_register: 'already register',
        verify_account: 'your register, please verify your account',
        in_valid_otp: 'Invalid OTP',
        already_schedule: 'already_schedule',
        token_not_found: 'Not authorized to access',
        token_expired: 'Unauthorized! Access Token was expired!'
    },
    success: {
        otp_sent: 'Otp sent to your registered email address. please activate the account',
        password_updated: 'password updated successfully',
        already_registered_verify: 'This email address already registered. Please verify with otp'
    }
};

export default Message;
