export const POST = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();

    const response = await fetch('http://localhost:4321/_emdash/api/content/posts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'ec_pat_pr7iEYkTkc8dMx89hre6kyL6Th1J3FVjNE--fY4n72s',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};