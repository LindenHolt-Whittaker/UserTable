// Handles API interactions for users
export class UserService {
    constructor() {
        this.baseUrl = 'https://dummyjson.com';
        this.cache = new Map();
    }

    async fetchData(searchQuery, options = {}) {
        const { limit = 10, skip = 0, sortBy = '', order = 'asc', useCache = true } = options;
        
        const isSearch = !!searchQuery;
        const cacheKey = isSearch
            ? `search_${searchQuery}_${limit}_${skip}_${sortBy}_${order}`
            : `users_${limit}_${skip}_${sortBy}_${order}`;
        
        if (useCache && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            let url = isSearch
                ? `${this.baseUrl}/users/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&skip=${skip}`
                : `${this.baseUrl}/users?limit=${limit}&skip=${skip}`;
            
            if (sortBy) {
                url += `&sortBy=${sortBy}&order=${order}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const result = {
                users: data.users || [],
                total: data.total || 0,
                limit: data.limit || limit,
                skip: data.skip || skip
            };
            
            this.cache.set(cacheKey, result);
            return result;
        } catch (error) {
            const action = isSearch ? 'searching' : 'fetching';
            console.error(`Error ${action} users:`, error);
            throw new Error(`Failed to ${isSearch ? 'search' : 'fetch'} users. Please try again later.`);
        }
    }

    async fetchUsers(options = {}) {
        return this.fetchData(null, options);
    }

    async searchUsers(query, options = {}) {
        return this.fetchData(query, { ...options, useCache: true });
    }

    clearCache() {
        this.cache.clear();
    }
}