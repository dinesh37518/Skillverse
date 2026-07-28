import logging
from typing import Dict, Any
from app.services.email_service import email_service

logger = logging.getLogger("sms_service")

class SMSService:
    """
    Deprecated SMS Service wrapper redirecting all OTP and alert dispatches
    to the Email Verification Service (email_service).
    """

    def send_otp_sms(self, phone_number: str, otp_code: str) -> Dict[str, Any]:
        """
        Redirects OTP request to Email Verification Service.
        """
        logger.info(f"📧 SMS Gateway deprecated. Redirecting verification code [{otp_code}] for target '{phone_number}' to Email Verification Service.")
        # If target looks like email, send email OTP; otherwise mock dispatch to email
        target_email = phone_number if "@" in phone_number else f"{phone_number.replace('+', '')}@student.skillverse.ai"
        return email_service.send_verification_email_otp(target_email, otp_code, purpose="verification")

sms_service = SMSService()

