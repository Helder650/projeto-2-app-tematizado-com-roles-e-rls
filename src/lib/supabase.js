import { createClient } from '@supabase/supabase-js'

const URL_SUPABASE = "https://defdprhuowozirrcqieq.supabase.co"
const CHAVE_SUPABASE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZmRwcmh1b3dvemlycmNxaWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDYxMTIsImV4cCI6MjA5NjU4MjExMn0.c0wgVnLgzBQHMyVgfs2TRy0cdib0Z6i_Omk-n09HeXg"

export const supabase = createClient(URL_SUPABASE, CHAVE_SUPABASE)