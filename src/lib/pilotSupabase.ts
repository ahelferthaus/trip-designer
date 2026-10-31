import { createClient } from '@supabase/supabase-js';

// Never fall back to the legacy app's backend or browser session.
const url = import.meta.env.VITE_PALAU_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_PALAU_SUPABASE_PUBLISHABLE_KEY as string | undefined;
export const supabase = import.meta.env.VITE_PALAU_PRIVATE_ENABLED === 'true' && url && key
  ? createClient(url, key, { auth: { storageKey: 'vybr-palau-pilot-auth', detectSessionInUrl: false, flowType: 'pkce' } }) : null;
