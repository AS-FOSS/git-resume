self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('/pdf') && url.searchParams.has('url')) {
    event.respondWith(proxyPdf(url.searchParams.get('url')));
  }
});

async function proxyPdf(targetUrl) {
  try {
    const response = await fetch(targetUrl);
    const headers = new Headers(response.headers);
    headers.delete('Content-Disposition');
    headers.set('Content-Type', 'application/pdf');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch {
    return new Response('Proxy error', { status: 502 });
  }
}
