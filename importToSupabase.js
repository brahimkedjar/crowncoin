const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client
const supabaseUrl = 'https://hfoqrjlsmwpwujqwgmds.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmb3FyamxzbXdwd3VqcXdnbWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzOTA3MjYsImV4cCI6MjA0NTk2NjcyNn0.Q6a-hT1xySKiWS5IHNkyqxI0CIbw_lylSDzih2Co8cc'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importData() {
  const data = JSON.parse(fs.readFileSync("users.json")); // replace with your file name

  for (const item of data) {
    const { data, error } = await supabase
      .from("users") // Replace with your Supabase table name
      .insert(item);
    if (error) {
      console.error("Error importing item:", error);
    } else {
      console.log("Item imported:", data);
    }
  }
}

importData();
