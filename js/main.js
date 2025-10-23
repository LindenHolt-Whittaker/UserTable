// Main Application Entry Point
import { UserTable } from './components/UserTable.js';
import { UserDetailsModal } from './components/UserDetailsModal.js';
import { UserService } from './services/UserService.js';
import { AppLayout } from './components/AppLayout.js';
import { Pagination } from './components/Pagination.js';
import { getIcon, IconNames } from './services/IconService.js';

class UserDirectoryApp {
    constructor() {
        this.userService = new UserService();
        this.users = [];
        this.isSearchMode = false;
        this.currentSearchTerm = '';
        this.currentSortField = '';
        this.currentSortDirection = 'asc';
        this.totalUsers = 0;
        this.appContainer = document.getElementById('app');
        this.init();
    }

    async init() {
        this.layout = new AppLayout(this.appContainer);
        this.layout.render();
        
        const elements = this.layout.getElements();
        this.searchInput = elements.searchInput;
        this.userTableContainer = elements.userTableContainer;
        this.paginationContainer = elements.paginationContainer;
        this.refreshBtn = elements.refreshBtn;
        this.statsContainer = elements.statsContainer;
        
        this.userTable = new UserTable(
            this.userTableContainer,
            (user) => this.handleUserClick(user)
        );
        
        this.userTable.handleSort = async (field) => {
            if (this.currentSortField === field) {
                this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.currentSortDirection = 'asc';
                this.currentSortField = field;
            }
            
            this.userTable.currentSortField = this.currentSortField;
            this.userTable.sortDirection = this.currentSortDirection;
            this.pagination.setCurrentPage(1);
            await this.loadUsers();
        };
        
        this.userDetailsModal = new UserDetailsModal((message, type) => this.showNotification(message, type));
        
        this.pagination = new Pagination({
            itemsPerPage: 10,
            currentPage: 1,
            onPageChange: (page) => this.handlePageChange(page)
        });

        this.setupEventListeners();
        await this.loadUsers();
    }

    setupEventListeners() {
        // Search with debounce
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 500);
        });

        // Refresh button
        this.refreshBtn.addEventListener('click', () => this.refreshUsers());
    }

    async loadUsers() {
        try {
            this.showLoading(true);
            
            const skip = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
            const options = {
                limit: this.pagination.itemsPerPage,
                skip: skip,
                sortBy: this.currentSortField,
                order: this.currentSortDirection,
                useCache: true
            };
            
            let result;
            if (this.isSearchMode && this.currentSearchTerm) {
                result = await this.userService.searchUsers(this.currentSearchTerm, options);
            } else {
                result = await this.userService.fetchUsers(options);
            }
            
            this.users = result.users;
            this.totalUsers = result.total;
            
            this.userTable.setUsers(this.users);
            this.userTable.setPaginatedUsers(this.users);
            this.userTable.render();
            
            this.pagination.setTotalItems(this.totalUsers);
            this.renderPagination();
            
            this.updateStats();
        } catch (error) {
            console.error('Error loading users:', error);
            this.userTable.showError('Failed to load users. Please try again.');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async refreshUsers() {
        try {
            this.showLoading(true);
            this.userService.clearCache();
            this.pagination.setCurrentPage(1);
            await this.loadUsers();
            this.showNotification('Users refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing users:', error);
            this.showNotification('Failed to refresh users', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSearch(searchTerm) {
        this.currentSearchTerm = searchTerm;
        this.isSearchMode = !!searchTerm;
        this.pagination.setCurrentPage(1);
        await this.loadUsers();
    }

    async handlePageChange(page) {
        await this.loadUsers();
    }

    renderPagination() {
        this.pagination.render(this.paginationContainer);
    }

    handleUserClick(user) {
        this.userDetailsModal.open(user);
    }

    updateStats() {
        if (this.statsContainer) {
            const displayedStart = this.users.length > 0 ? 
                ((this.pagination.currentPage - 1) * this.pagination.itemsPerPage) + 1 : 0;
            const displayedEnd = Math.min(
                this.pagination.currentPage * this.pagination.itemsPerPage, 
                this.totalUsers
            );
            
            if (this.isSearchMode && this.currentSearchTerm) {
                this.statsContainer.innerHTML = `
                    <div class="text-sm text-gray-600">
                        <span class="text-blue-600">Search results for "${this.currentSearchTerm}"</span><br>
                        Showing <span class="font-semibold">${displayedStart}-${displayedEnd}</span> 
                        of <span class="font-semibold">${this.totalUsers}</span> matching users
                    </div>
                `;
            } else {
                this.statsContainer.innerHTML = `
                    <div class="text-sm text-gray-600">
                        Showing <span class="font-semibold">${displayedStart}-${displayedEnd}</span> 
                        of <span class="font-semibold">${this.totalUsers}</span> total users
                    </div>
                `;
            }
        }
    }

    showLoading(show) {
        this.userTable.showLoading(show);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const styles = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white',
            warning: 'bg-yellow-500 text-white'
        };
        
        notification.classList.add(...(styles[type] || styles.info).split(' '));
        notification.innerHTML = `
            <div class="flex items-center">
                ${this.getNotificationIcon(type)}
                <span class="ml-2">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const iconMap = {
            success: IconNames.SUCCESS,
            error: IconNames.ERROR,
            info: IconNames.INFO,
            warning: IconNames.WARNING
        };
        return getIcon(iconMap[type] || IconNames.INFO, 'w-5 h-5');
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new UserDirectoryApp();
    });
} else {
    new UserDirectoryApp();
}