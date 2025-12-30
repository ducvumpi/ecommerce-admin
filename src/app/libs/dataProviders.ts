import { supabase } from "./supabaseClient";
import { dataProvider  } from "@refinedev/supabase";

export const dataProviderSupabase = dataProvider(supabase);





