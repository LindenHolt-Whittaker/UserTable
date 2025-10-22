// Handles API interactions for users
export class UserService {
    constructor() {
        this.baseUrl = 'https://dummyjson.com';
        this.cache = new Map();
    }

    // Fetch users with pagination
    async fetchUsers(options = {}) {
        const { limit = 10, skip = 0, sortBy = '', order = 'asc', useCache = true } = options;
        const cacheKey = `users_${limit}_${skip}_${sortBy}_${order}`;
        
        if (useCache && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            let url = `${this.baseUrl}/users?limit=${limit}&skip=${skip}`;
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
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users. Please try again later.');
        }
    }

    // Search users with pagination
    async searchUsersPaginated(query, options = {}) {
        const { limit = 10, skip = 0, sortBy = '', order = 'asc' } = options;
        const cacheKey = `search_${query}_${limit}_${skip}_${sortBy}_${order}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            let url = `${this.baseUrl}/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
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
            console.error('Error searching users:', error);
            throw new Error('Failed to search users. Please try again later.');
        }
    }

    clearCache() {
        this.cache.clear();
    }
}