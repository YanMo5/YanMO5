/**
 * 网站统计相关API
 * 处理网站访问量、待审核内容等统计数据
 */

// 统计API基础URL
const API_URL = '/api/stats';

/**
 * 获取网站统计数据
 * @returns {Promise<Object>} 统计数据
 */
export async function getStats() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('获取统计数据失败');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取统计数据出错:', error);
        return {
            pending_links: 0,
            published_articles: 0,
            total_views: 0
        };
    }
}
