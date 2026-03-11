import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://giigounzfqjdsiomkdwc.supabase.co';
const supabaseAnonKey = 'sb_publishable_I-pbZaw48T0cAu9itq-nmQ_YCH7ELab'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);