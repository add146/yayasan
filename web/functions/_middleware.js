export async function onRequest(context) {
    const { request, next, env } = context;

    // Get the original response
    const response = await next();

    // Only modify HTML responses for the root/index
    const url = new URL(request.url);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) {
        return response;
    }

    try {
        // Fetch konfigurasi from API
        const apiUrl = 'https://sekolah-api.khibrohstudio.workers.dev/api/konfigurasi';
        const configResponse = await fetch(apiUrl);

        if (!configResponse.ok) {
            return response;
        }

        const configData = await configResponse.json();
        const config = configData.data || {};

        // Get original HTML
        let html = await response.text();

        // Prepare OG meta tags
        const siteName = config.nama_website || 'Sekolah';
        const title = config.meta_title || config.nama_website || 'Sekolah';
        const description = config.meta_description || config.deskripsi || 'Website Profil dan Manajemen Sekolah';
        const ogImage = config.og_image ? `https://sekolah-api.khibrohstudio.workers.dev/api/upload/${config.og_image}` : '';
        const siteUrl = url.origin;

        // Create OG meta tags
        const ogTags = `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${siteUrl}${url.pathname}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:site_name" content="${siteName}" />
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
    ${ogImage ? `<meta property="og:image:width" content="1200" />` : ''}
    ${ogImage ? `<meta property="og:image:height" content="630" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${siteUrl}${url.pathname}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ''}
    `;

        // Update existing title and description
        html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
        html = html.replace(
            /<meta name="description" content="[^"]*" \/>/,
            `<meta name="description" content="${description}" />`
        );

        // Inject OG tags before </head>
        html = html.replace('</head>', `${ogTags}</head>`);

        return new Response(html, {
            status: response.status,
            headers: {
                ...Object.fromEntries(response.headers.entries()),
                'content-type': 'text/html;charset=UTF-8',
            },
        });
    } catch (error) {
        console.error('Error injecting OG tags:', error);
        return response;
    }
}
