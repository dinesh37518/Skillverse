from supabase import create_client, Client
from app.core.config import settings

# Initialize the Supabase Client with service role key for admin privileges
supabase_client: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)

def get_supabase() -> Client:
    return supabase_client
