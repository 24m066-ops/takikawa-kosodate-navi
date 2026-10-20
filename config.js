// Supabase connection settings
const SUPABASE_URL = 'https://ffhoyujorljqnxxtrxfy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_KYP8dL4hSmniaqzW8sT_5g_tUc_U4Nc';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
