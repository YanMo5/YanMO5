module.exports = function handler(req, res) {
    var route = Array.isArray(req.query.route) ? req.query.route.join('/') : '';

    res.status(200).json({
        ok: true,
        mode: 'browser-local-storage',
        route: route ? '/api/' + route : '/api',
        method: req.method || 'GET',
        message: 'This Vercel deployment handles interactive data in the browser. Use the site pages instead of calling this endpoint directly.'
    });
};
