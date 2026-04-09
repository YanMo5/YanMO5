(function () {
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
        return;
    }

    var STORAGE_KEY = 'yanmo.site.data.v1';
    var SESSION_KEY = 'yanmo.site.admin.session.v1';
    var VISIT_KEY_PREFIX = 'yanmo.site.visit.';
    var nativeFetch = window.fetch.bind(window);

    var INITIAL_DATA = {
        messages: [
            {
                id: 1,
                name: '夜航',
                email: 'visitor@example.com',
                message: '站点风格很酷，安全文章也很有参考价值。',
                created_at: '2026-04-08 20:30:00'
            }
        ],
        links: [
            {
                id: 1,
                site_name: 'OpenAI',
                site_url: 'https://openai.com',
                site_description: '人工智能研究与产品团队。',
                status: 'approved',
                created_at: '2026-04-07 09:00:00'
            }
        ],
        articles: [
            {
                id: 1,
                title: 'Web应用渗透测试入门指南',
                content: '本文介绍Web应用渗透测试的基本流程和常用工具，帮助安全爱好者快速建立基础方法论。',
                category: 'Web安全',
                created_at: '2026-04-01 10:00:00'
            },
            {
                id: 2,
                title: '人工智能安全威胁与防护',
                content: '围绕提示注入、越权调用和数据泄露等常见问题，梳理AI应用的安全防护思路。',
                category: 'AI安全',
                created_at: '2026-03-28 10:00:00'
            },
            {
                id: 3,
                title: '网络安全意识培训：保护个人信息',
                content: '通过真实场景说明密码管理、设备加固和反钓鱼的实用做法。',
                category: '安全意识',
                created_at: '2026-03-25 10:00:00'
            },
            {
                id: 4,
                title: 'Python安全工具开发入门',
                content: '介绍如何用Python搭建轻量级扫描、信息收集和辅助分析脚本。',
                category: 'Python安全',
                created_at: '2026-03-20 10:00:00'
            },
            {
                id: 5,
                title: '漏洞分析与利用技术',
                content: '从漏洞成因、复现思路到修复建议，梳理分析过程中的关键检查点。',
                category: '漏洞研究',
                created_at: '2026-03-15 10:00:00'
            },
            {
                id: 6,
                title: '企业网络安全架构设计',
                content: '总结企业在边界防护、身份管理和日志审计上的常见设计策略。',
                category: '企业安全',
                created_at: '2026-03-10 10:00:00'
            }
        ],
        contact_messages: [],
        stats: {
            total_views: 1200
        },
        admin: {
            username: 'admin',
            password: 'admin'
        }
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function now() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    function normalizeText(value) {
        return String(value || '').trim();
    }

    function parseJson(value) {
        if (!value) {
            return {};
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return {};
        }
    }

    function isValidUrl(value) {
        try {
            var url = new URL(value);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

    function nextId(items) {
        return items.reduce(function (maxId, item) {
            return Math.max(maxId, Number(item.id) || 0);
        }, 0) + 1;
    }

    function sortByCreatedAtDesc(items) {
        return items.slice().sort(function (left, right) {
            return String(right.created_at).localeCompare(String(left.created_at));
        });
    }

    function normalizeData(rawData) {
        var safeData = rawData && typeof rawData === 'object' ? rawData : {};
        var data = {
            messages: Array.isArray(safeData.messages) ? safeData.messages : clone(INITIAL_DATA.messages),
            links: Array.isArray(safeData.links) ? safeData.links : clone(INITIAL_DATA.links),
            articles: Array.isArray(safeData.articles) ? safeData.articles : clone(INITIAL_DATA.articles),
            contact_messages: Array.isArray(safeData.contact_messages) ? safeData.contact_messages : [],
            stats: {
                total_views: Number(
                    safeData.stats && safeData.stats.total_views
                ) || INITIAL_DATA.stats.total_views
            },
            admin: {
                username: normalizeText(safeData.admin && safeData.admin.username) || INITIAL_DATA.admin.username,
                password: normalizeText(safeData.admin && safeData.admin.password) || INITIAL_DATA.admin.password
            }
        };

        return data;
    }

    function readData() {
        var rawValue = window.localStorage.getItem(STORAGE_KEY);
        var parsedData = normalizeData(parseJson(rawValue));

        if (!rawValue) {
            saveData(parsedData);
        }

        return parsedData;
    }

    function saveData(data) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    }

    function isAdminLoggedIn() {
        return window.sessionStorage.getItem(SESSION_KEY) === '1';
    }

    function setAdminLoggedIn(loggedIn) {
        if (loggedIn) {
            window.sessionStorage.setItem(SESSION_KEY, '1');
        } else {
            window.sessionStorage.removeItem(SESSION_KEY);
        }
    }

    function requireAdmin() {
        if (!isAdminLoggedIn()) {
            return jsonResponse({ error: '请先登录管理员账户' }, 401);
        }

        return null;
    }

    function jsonResponse(payload, statusCode) {
        return Promise.resolve(
            new Response(JSON.stringify(payload), {
                status: statusCode || 200,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
        );
    }

    async function getRequestDetails(input, init) {
        var requestInit = init || {};
        var requestUrl;
        var requestMethod = 'GET';
        var rawBody = requestInit.body;

        if (input instanceof Request) {
            requestUrl = new URL(input.url, window.location.origin);
            requestMethod = requestInit.method || input.method || 'GET';
            if (rawBody === undefined && requestMethod !== 'GET' && requestMethod !== 'HEAD') {
                try {
                    rawBody = await input.clone().text();
                } catch (error) {
                    rawBody = '';
                }
            }
        } else {
            requestUrl = new URL(String(input), window.location.origin);
            requestMethod = requestInit.method || 'GET';
        }

        return {
            url: requestUrl,
            method: String(requestMethod).toUpperCase(),
            body: parseRequestBody(rawBody)
        };
    }

    function parseRequestBody(rawBody) {
        if (!rawBody) {
            return {};
        }

        if (typeof rawBody === 'string') {
            return parseJson(rawBody);
        }

        if (rawBody instanceof FormData) {
            return Object.fromEntries(rawBody.entries());
        }

        if (typeof rawBody === 'object') {
            return rawBody;
        }

        return {};
    }

    function trackVisit() {
        try {
            var visitKey = VISIT_KEY_PREFIX + window.location.pathname;
            if (window.sessionStorage.getItem(visitKey)) {
                return;
            }

            var data = readData();
            data.stats.total_views += 1;
            saveData(data);
            window.sessionStorage.setItem(visitKey, '1');
        } catch (error) {
            // Ignore storage errors so the rest of the page can still run.
        }
    }

    function getArticles(data) {
        return sortByCreatedAtDesc(data.articles);
    }

    function getMessages(data) {
        return sortByCreatedAtDesc(data.messages);
    }

    function getLinks(data) {
        return sortByCreatedAtDesc(data.links);
    }

    function findItem(items, id) {
        var numericId = Number(id);
        return items.find(function (item) {
            return Number(item.id) === numericId;
        });
    }

    async function handleApiRequest(input, init) {
        var request = await getRequestDetails(input, init);
        var pathname = request.url.pathname;

        if (request.url.origin !== window.location.origin || !pathname.startsWith('/api/')) {
            return null;
        }

        var data = readData();
        var body = request.body;
        var messageIdMatch = pathname.match(/^\/api\/messages\/(\d+)(?:\/status)?$/);
        var linkIdMatch = pathname.match(/^\/api\/links\/(\d+)(?:\/status)?$/);
        var articleIdMatch = pathname.match(/^\/api\/articles\/(\d+)$/);

        if (pathname === '/api/messages' && request.method === 'GET') {
            return jsonResponse(getMessages(data));
        }

        if (pathname === '/api/messages' && request.method === 'POST') {
            var name = normalizeText(body.name);
            var email = normalizeText(body.email);
            var message = normalizeText(body.message);

            if (!name || !email || !message) {
                return jsonResponse({ error: '请完整填写留言信息' }, 400);
            }

            var newMessage = {
                id: nextId(data.messages),
                name: name,
                email: email,
                message: message,
                created_at: now()
            };
            data.messages.unshift(newMessage);
            saveData(data);
            return jsonResponse(newMessage, 201);
        }

        if (messageIdMatch && request.method === 'DELETE') {
            var deleteMessageAuth = requireAdmin();
            if (deleteMessageAuth) {
                return deleteMessageAuth;
            }

            var messageId = Number(messageIdMatch[1]);
            data.messages = data.messages.filter(function (item) {
                return Number(item.id) !== messageId;
            });
            saveData(data);
            return jsonResponse({ id: messageId, deleted: true });
        }

        if (pathname === '/api/links' && request.method === 'GET') {
            return jsonResponse(getLinks(data));
        }

        if (pathname === '/api/links' && request.method === 'POST') {
            var siteName = normalizeText(body['site-name'] || body.site_name || body.siteName);
            var siteUrl = normalizeText(body['site-url'] || body.site_url || body.siteUrl);
            var siteDescription = normalizeText(body['site-description'] || body.site_description || body.siteDescription);

            if (!siteName || !siteUrl || !siteDescription) {
                return jsonResponse({ error: '请完整填写友链信息' }, 400);
            }

            if (!isValidUrl(siteUrl)) {
                return jsonResponse({ error: '请输入有效的网站链接' }, 400);
            }

            var newLink = {
                id: nextId(data.links),
                site_name: siteName,
                site_url: siteUrl,
                site_description: siteDescription,
                status: 'pending',
                created_at: now()
            };
            data.links.unshift(newLink);
            saveData(data);
            return jsonResponse(newLink, 201);
        }

        if (linkIdMatch && request.method === 'PUT') {
            var updateLinkAuth = requireAdmin();
            if (updateLinkAuth) {
                return updateLinkAuth;
            }

            var targetLink = findItem(data.links, linkIdMatch[1]);
            if (!targetLink) {
                return jsonResponse({ error: '友链不存在' }, 404);
            }

            targetLink.status = normalizeText(body.status) || targetLink.status;
            saveData(data);
            return jsonResponse(targetLink);
        }

        if (linkIdMatch && request.method === 'DELETE') {
            var deleteLinkAuth = requireAdmin();
            if (deleteLinkAuth) {
                return deleteLinkAuth;
            }

            var linkId = Number(linkIdMatch[1]);
            data.links = data.links.filter(function (item) {
                return Number(item.id) !== linkId;
            });
            saveData(data);
            return jsonResponse({ id: linkId, deleted: true });
        }

        if (pathname === '/api/articles' && request.method === 'GET') {
            return jsonResponse(getArticles(data));
        }

        if (pathname === '/api/articles' && request.method === 'POST') {
            var createArticleAuth = requireAdmin();
            if (createArticleAuth) {
                return createArticleAuth;
            }

            var title = normalizeText(body.title);
            var content = normalizeText(body.content);
            var category = normalizeText(body.category);

            if (!title || !content || !category) {
                return jsonResponse({ error: '请完整填写文章信息' }, 400);
            }

            var newArticle = {
                id: nextId(data.articles),
                title: title,
                content: content,
                category: category,
                created_at: now()
            };
            data.articles.unshift(newArticle);
            saveData(data);
            return jsonResponse(newArticle, 201);
        }

        if (articleIdMatch && request.method === 'GET') {
            var article = findItem(data.articles, articleIdMatch[1]);
            if (!article) {
                return jsonResponse({ error: '文章不存在' }, 404);
            }

            return jsonResponse(article);
        }

        if (articleIdMatch && request.method === 'PUT') {
            var updateArticleAuth = requireAdmin();
            if (updateArticleAuth) {
                return updateArticleAuth;
            }

            var targetArticle = findItem(data.articles, articleIdMatch[1]);
            if (!targetArticle) {
                return jsonResponse({ error: '文章不存在' }, 404);
            }

            targetArticle.title = normalizeText(body.title) || targetArticle.title;
            targetArticle.content = normalizeText(body.content) || targetArticle.content;
            targetArticle.category = normalizeText(body.category) || targetArticle.category;
            saveData(data);
            return jsonResponse(targetArticle);
        }

        if (articleIdMatch && request.method === 'DELETE') {
            var deleteArticleAuth = requireAdmin();
            if (deleteArticleAuth) {
                return deleteArticleAuth;
            }

            var articleId = Number(articleIdMatch[1]);
            data.articles = data.articles.filter(function (item) {
                return Number(item.id) !== articleId;
            });
            saveData(data);
            return jsonResponse({ id: articleId, deleted: true });
        }

        if (pathname === '/api/stats' && request.method === 'GET') {
            return jsonResponse({
                pending_links: data.links.filter(function (item) {
                    return item.status === 'pending';
                }).length,
                published_articles: data.articles.length,
                total_views: data.stats.total_views
            });
        }

        if (pathname === '/api/login' && request.method === 'POST') {
            var username = normalizeText(body.username);
            var password = normalizeText(body.password);

            if (username === data.admin.username && password === data.admin.password) {
                setAdminLoggedIn(true);
                return jsonResponse({ success: true, message: '登录成功' });
            }

            return jsonResponse({ success: false, message: '用户名或密码错误' }, 401);
        }

        if (pathname === '/api/change-password' && request.method === 'POST') {
            var changePasswordAuth = requireAdmin();
            if (changePasswordAuth) {
                return changePasswordAuth;
            }

            var currentPassword = normalizeText(body.current_password);
            var newPassword = normalizeText(body.new_password);

            if (currentPassword !== data.admin.password) {
                return jsonResponse({ success: false, message: '当前密码不正确' }, 401);
            }

            if (!newPassword) {
                return jsonResponse({ success: false, message: '请输入新密码' }, 400);
            }

            data.admin.password = newPassword;
            saveData(data);
            return jsonResponse({ success: true, message: '密码修改成功' });
        }

        if (pathname === '/api/contact' && request.method === 'POST') {
            var contactName = normalizeText(body.name);
            var contactEmail = normalizeText(body.email);
            var contactSubject = normalizeText(body.subject);
            var contactMessage = normalizeText(body.message);

            if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
                return jsonResponse({ error: '请完整填写联系表单' }, 400);
            }

            data.contact_messages.unshift({
                id: nextId(data.contact_messages),
                name: contactName,
                email: contactEmail,
                subject: contactSubject,
                message: contactMessage,
                created_at: now()
            });
            saveData(data);
            return jsonResponse({ success: true, message: '消息已发送' }, 201);
        }

        if (pathname === '/api/contact' && request.method === 'GET') {
            var contactAuth = requireAdmin();
            if (contactAuth) {
                return contactAuth;
            }

            return jsonResponse(sortByCreatedAtDesc(data.contact_messages));
        }

        return jsonResponse({ error: '接口不存在' }, 404);
    }

    window.fetch = async function (input, init) {
        var handledResponse = await handleApiRequest(input, init);
        if (handledResponse) {
            return handledResponse;
        }

        return nativeFetch(input, init);
    };

    window.SiteLocalApi = {
        isAdminLoggedIn: isAdminLoggedIn,
        logout: function () {
            setAdminLoggedIn(false);
        },
        reset: function () {
            saveData(clone(INITIAL_DATA));
            setAdminLoggedIn(false);
        },
        getData: function () {
            return clone(readData());
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        var logoutLink = document.querySelector('.logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', function (event) {
                event.preventDefault();
                window.SiteLocalApi.logout();
                if (window.location.pathname.indexOf('/pages/') === 0) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = '/pages/admin.html';
                }
            });
        }
    });

    trackVisit();
})();
