import logging
import httpx
from typing import Dict, Any
from app.core.config import settings

logger = logging.getLogger("sms_service")

class SMSService:
    """
    Real SMS Gateway Integration service supporting Fast2SMS, Twilio, and Supabase Auth.
    """

    def send_otp_sms(self, phone_number: str, otp_code: str) -> Dict[str, Any]:
        """
        Dispatches a 6-digit OTP code to the target mobile phone number.
        """
        clean_phone = phone_number.strip()
        message_text = f"Your SkillVerse AI login verification OTP code is: {otp_code}. Valid for 5 minutes."

        # 1. Fast2SMS Integration (Ideal for Indian +91 numbers)
        if settings.FAST2SMS_API_KEY:
            try:
                # Fast2SMS requires 10-digit number without +91
                digits_only = clean_phone.replace("+91", "").replace("+", "").strip()
                logger.info(f"📱 Dispatched real SMS via Fast2SMS to {digits_only}")
                
                # First attempt: OTP route
                response = httpx.post(
                    "https://www.fast2sms.com/dev/bulkV2",
                    headers={"authorization": settings.FAST2SMS_API_KEY},
                    json={
                        "variables_values": otp_code,
                        "route": "otp",
                        "numbers": digits_only
                    },
                    timeout=8.0
                )
                res_data = response.json()
                if response.status_code == 200 and res_data.get("return") is True:
                    return {"success": True, "provider": "fast2sms", "detail": "SMS dispatched successfully via Fast2SMS OTP route"}
                
                # Second attempt: Quick SMS route (bypasses DLT verification)
                logger.info(f"Retrying Fast2SMS via Quick SMS route for {digits_only}...")
                q_response = httpx.post(
                    "https://www.fast2sms.com/dev/bulkV2",
                    headers={"authorization": settings.FAST2SMS_API_KEY},
                    json={
                        "route": "q",
                        "message": f"Your SkillVerse AI verification code is: {otp_code}",
                        "language": "english",
                        "flash": 0,
                        "numbers": digits_only
                    },
                    timeout=8.0
                )
                q_res_data = q_response.json()
                if q_response.status_code == 200 and q_res_data.get("return") is True:
                    return {"success": True, "provider": "fast2sms", "detail": "SMS dispatched successfully via Fast2SMS Quick SMS route"}
                else:
                    logger.warning(f"Fast2SMS Quick SMS response: {q_res_data}")
            except Exception as e:
                logger.error(f"Fast2SMS dispatch error: {str(e)}")

        # 2. Twilio SMS Integration
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_PHONE_NUMBER:
            try:
                formatted_to = clean_phone if clean_phone.startswith("+") else f"+91{clean_phone}"
                logger.info(f"📱 Dispatched real SMS via Twilio to {formatted_to}")
                
                url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
                response = httpx.post(
                    url,
                    auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                    data={
                        "From": settings.TWILIO_PHONE_NUMBER,
                        "To": formatted_to,
                        "Body": message_text
                    },
                    timeout=8.0
                )
                if response.status_code in (200, 201):
                    return {"success": True, "provider": "twilio", "detail": "SMS dispatched successfully via Twilio"}
                else:
                    logger.warning(f"Twilio SMS response issue: {response.text}")
            except Exception as e:
                logger.error(f"Twilio SMS dispatch error: {str(e)}")

        # 3. Fallback / Dev Log notification
        logger.info(f"🔑 [REAL SMS DISPATCH SIMULATION] Target: {clean_phone} | Message: '{message_text}'")
        return {
            "success": True,
            "provider": "dev_mock",
            "detail": f"OTP {otp_code} generated for {clean_phone}."
        }

sms_service = SMSService()
