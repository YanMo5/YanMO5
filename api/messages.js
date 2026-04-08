/**
 * 留言板相关API
 * 处理留言的获取、提交等操作
 */

// 留言API基础URL
const API_URL = '/api/messages';

/**
 * 获取所有留言
 * @returns {Promise<Array>} 留言列表
 */
export async function getMessages() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('获取留言失败');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取留言出错:', error);
        return [];
    }
}

/**
 * 提交新留言
 * @param {Object} message 留言数据
 * @param {string} message.name 留言人姓名
 * @param {string} message.email 留言人邮箱
 * @param {string} message.message 留言内容
 * @returns {Promise<Object>} 提交结果
 */
export async function submitMessage(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        
        if (!response.ok) {
            throw new Error('提交留言失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('提交留言出错:', error);
        throw error;
    }
}

/**
 * 删除留言
 * @param {number} id 留言ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteMessage(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('删除留言失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('删除留言出错:', error);
        throw error;
    }
}

/**
 * 更新留言状态
 * @param {number} id 留言ID
 * @param {string} status 新状态
 * @returns {Promise<Object>} 更新结果
 */
export async function updateMessageStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('更新留言状态失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('更新留言状态出错:', error);
        throw error;
    }
}
