export default {
  async fetch(request) {
    const url = new URL(request.url);
    const subdomain = url.hostname.split('.')[0];
    url.hostname = subdomain === 'dev'
      ? 'develop.candy-store-frontend.pages.dev'
      : 'candy-store-frontend.pages.dev';
    return fetch(new Request(url.toString(), request));
  }
}
