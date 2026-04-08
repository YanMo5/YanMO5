/**
 * 文章相关API
 * 处理文章的获取、发布、编辑等操作
 */

// 文章API基础URL
const API_URL = '/api/articles';

/**
 * 获取所有文章
 * @returns {Promise<Array>} 文章列表
 */
export async function getArticles() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('获取文章失败');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取文章出错:', error);
        return [];
    }
}

/**
 * 获取单篇文章
 * @param {number} id 文章ID
 * @returns {Promise<Object>} 文章详情
 */
export async function getArticle(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('获取文章详情失败');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取文章详情出错:', error);
        throw error;
    }
}

/**
 * 发布新文章
 * @param {Object} article 文章数据
 * @param {string} article.title 文章标题
 * @param {string} article.content 文章内容
 * @param {string} article.category 文章分类
 * @returns {Promise<Object>} 发布结果
 */
export async function publishArticle(article) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(article)
        });
        
        if (!response.ok) {
            throw new Error('发布文章失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('发布文章出错:', error);
        throw error;
    }
}

/**
 * 更新文章
 * @param {number} id 文章ID
 * @param {Object} article 文章数据
 * @returns {Promise<Object>} 更新结果
 */
export async function updateArticle(id, article) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(article)
        });
        
        if (!response.ok) {
            throw new Error('更新文章失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('更新文章出错:', error);
        throw error;
    }
}

/**
 * 删除文章
 * @param {number} id 文章ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteArticle(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('删除文章失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('删除文章出错:', error);
        throw error;
    }
}
