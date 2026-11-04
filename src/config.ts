/**
 * Připojení k databázi Supabase pro třídní soutěž.
 *
 * Oba údaje jsou veřejné a smí být v kódu: klíč „publishable“ dovolí jen volat
 * funkce ze supabase/schema.sql, do tabulek přímo nepustí (RLS).
 * Tajný klíč (sb_secret_…) sem nikdy nedávej.
 *
 * Když jsou prázdné, soutěž se v aplikaci nezobrazí.
 * Pro testování je jde přepsat proměnnými VITE_SUPABASE_URL a VITE_SUPABASE_KEY.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const SUPABASE_URL: string = env.VITE_SUPABASE_URL ?? 'https://erposolgxjpttqvxahvz.supabase.co';
export const SUPABASE_KEY: string = env.VITE_SUPABASE_KEY ?? 'sb_publishable_qClCZd3P-yl5HEkVnsLbHA_uOdVk427';
