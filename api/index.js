module.exports = function handler(req, res) {
    res.status(200).json({
        ok: true,
        mode: 'browser-local-storage',
        route: '/api',
        method: req.method || 'GET',
        message: 'This Vercel deployment handles interactive data in the browser. Open the site pages to use guestbook, links, admin, and stats features.'
    });
};
