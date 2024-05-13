export default async (request) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  const url = new URL(request.url);
  const countParam = url.searchParams.get("count") || 10;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/urls?select=*&order=created_at.desc&limit=${countParam}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  const urls = await response.json();

  return new Response(JSON.stringify(urls), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
