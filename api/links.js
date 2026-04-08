/**
 * 友链相关API
 * 处理友链的获取、提交、审核等操作
 */

// 友链API基础URL
const API_URL = '/api/links';

/**
 * 获取所有友链
 * @returns {Promise<Array>} 友链列表
 */
export async function getLinks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('获取友链失败');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取友链出错:', error);
        return [];
    }
}

/**
 * 提交新友链
 * @param {Object} link 友链数据
 * @param {string} link.name 网站名称
 * @param {string} link.url 网站URL
 * @param {string} link.description 网站描述
 * @param {string} link.email 联系人邮箱
 * @returns {Promise<Object>} 提交结果
 */
export async function submitLink(link) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(link)
        });
        
        if (!response.ok) {
            throw new Error('提交友链失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('提交友链出错:', error);
        throw error;
    }
}

/**
 * 删除友链
 * @param {number} id 友链ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteLink(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('删除友链失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('删除友链出错:', error);
        throw error;
    }
}

/**
 * 更新友链状态
 * @param {number} id 友链ID
 * @param {string} status 新状态
 * @returns {Promise<Object>} 更新结果
 */
export async function updateLinkStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('更新友链状态失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('更新友链状态出错:', error);
        throw error;
    }
}
