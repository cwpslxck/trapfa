import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllArtists() {
  try {
    const { data, error } = await supabase.from("artists").select("*");

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching artists:", error.message);
    return null;
  }
}

export async function getAllTracks() {
  try {
    const { data, error } = await supabase.from("tracks").select("*");

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching tracks:", error.message);
    return null;
  }
}

export async function getArtistByUrl(url) {
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("url", url)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching artist:", error.message);
    return null;
  }
}
