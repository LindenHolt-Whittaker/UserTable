// Handles rendering and interactions for the user table
import { getIcon, IconNames } from '../services/IconService.js';

export class UserTable {
    constructor(container, onUserClick) {
        this.container = container;
        this.onUserClick = onUserClick || (() => {});
        this.users = [];
        this.paginatedUsers = [];
        this.sortDirection = 'asc';
        this.currentSortField = '';
        
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Mobile beneath lg breakpoint
            const isMobile = window.innerWidth < 1024;
            const currentIsMobile = this.container.querySelector('.mobile-user-list') !== null;
            
            // Only re-render if the view type has changed
            if ((isMobile && !currentIsMobile) || (!isMobile && currentIsMobile)) {
                this.render();
            }
        }, 100);
    }

    setUsers(users) {
        this.users = users;
    }

    setPaginatedUsers(users) {
        this.paginatedUsers = users;
    }

    render(usersToRender = this.paginatedUsers) {
        // Mobile beneath lg breakpoint
        const isMobile = window.innerWidth < 1024;
        
        if (isMobile) {
            this.renderMobileList(usersToRender);
        } else {
            this.renderDesktopTable(usersToRender);
        }
    }

    renderDesktopTable(usersToRender) {
        const getTableHeaderClassnames = (className) => `group cursor-pointer w-1/5 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 ${className}`;
        
        const tableHTML = `
            <table class="w-full">
                <thead class="border-b">
                    <tr>
                        <th class="${getTableHeaderClassnames('rounded-tl-lg hover:bg-gray-100 px-3')}" data-sort="firstName">
                            <div class="flex items-center">
                                Name
                                ${this.getSortIcon('firstName')}
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('hover:bg-gray-100')}" data-sort="email">
                            <div class="flex items-center">
                                Email
                                ${this.getSortIcon('email')}
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('pl-1 pr-3 w-1/6')}">
                            <div class="flex items-center">
                                Company
                                <span class="ml-1 text-gray-400" title="Sorting not available">
                                    ${getIcon(IconNames.INFO, 'w-4 h-4 invisible group-hover:visible')}
                                </span>
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('pl-1 pr-3 w-1/6')}">
                            <div class="flex items-center">
                                Role
                                <span class="ml-1 text-gray-400" title="Sorting not available">
                                    ${getIcon(IconNames.INFO, 'w-4 h-4 invisible group-hover:visible')}
                                </span>
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('rounded-tr-lg hover:bg-gray-100 w-1/6')}" data-sort="role">
                            <div class="flex items-center">
                                User role
                                ${this.getSortIcon('role')}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${usersToRender.map(user => `
                        <tr class="hover:bg-gray-50 cursor-pointer transition-colors" data-user-id="${user.id}">
                            <td class="px-3 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <img class="h-10 w-10 rounded-full object-cover" src="${user.image}" alt="${user.firstName}">
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">${user.firstName} ${user.lastName}</div>
                                        <div class="text-sm text-gray-500">@${user.username}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-500 truncate" title="${user.email}">${user.email}</td>
                            <td class="pl-1 pr-3 py-4 whitespace-nowrap text-sm text-gray-900">${user.company.name}</td>
                            <td class="pl-1 pr-3 py-4 whitespace-nowrap text-sm text-gray-500">${user.company.title}</td>
                            <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-500">${user.role}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${usersToRender.length === 0 ? `
                <div class="text-center py-8 text-gray-500">
                    ${getIcon(IconNames.EMPTY_INBOX, 'mx-auto h-12 w-12 text-gray-400 mb-4')}
                    <p>No users found</p>
                </div>
            ` : ''}
        `;
        
        this.container.innerHTML = tableHTML;
        this.attachDesktopEventListeners();
    }

    renderMobileList(usersToRender) {
        const mobileHTML = `
            <div class="mobile-user-list">
                <!-- Mobile Sort Header -->
                <div class="rounded-t-lg bg-gray-50 border-b px-4 py-3">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium text-gray-700">Sort by:</div>
                        <div class="flex items-center space-x-2">
                            <select id="mobile-sort-field" class="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                                <option value="firstName" ${this.currentSortField === 'firstName' ? 'selected' : ''}>Name</option>
                                <option value="email" ${this.currentSortField === 'email' ? 'selected' : ''}>Email</option>
                                <option value="role" ${this.currentSortField === 'role' ? 'selected' : ''}>Role</option>
                            </select>
                            <button id="mobile-sort-direction" class="p-1 rounded border border-gray-300 bg-white hover:bg-gray-50" data-direction="${this.sortDirection}">
                                ${
                                    this.currentSortField === '' ?
                                        getIcon(IconNames.SORT_UNSORTED, 'w-4 h-4 text-gray-400') :
                                            this.sortDirection === 'asc' ?
                                            getIcon(IconNames.SORT_ASC, 'w-4 h-4 text-gray-600') :
                                            getIcon(IconNames.SORT_DESC, 'w-4 h-4 text-gray-600')
                                }
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile User List -->
                <div class="divide-y divide-gray-200">
                    ${usersToRender.map(user => `
                        <div class="user-card p-4 hover:bg-gray-50 cursor-pointer transition-colors" data-user-id="${user.id}">
                            <div class="flex items-start space-x-3">
                                <img class="h-12 w-12 rounded-full object-cover flex-shrink-0" src="${user.image}" alt="${user.firstName}">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-sm font-semibold text-gray-900 truncate">${user.firstName} ${user.lastName}</h3>
                                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">${user.role}</span>
                                    </div>
                                    <div class="flex items-center mt-1 text-xs text-gray-500">
                                        <span class="truncate">@${user.username}</span>
                                        <span class="mx-2">•</span>
                                        <span class="truncate">${user.company.name}</span>
                                    </div>
                                    <p class="text-sm text-gray-600 truncate mt-1">${user.email}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${usersToRender.length === 0 ? `
                    <div class="text-center py-12 text-gray-500">
                        ${getIcon(IconNames.EMPTY_INBOX, 'mx-auto h-16 w-16 text-gray-400 mb-4')}
                        <p class="text-gray-600">No users found</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        this.container.innerHTML = mobileHTML;
        this.attachMobileEventListeners();
    }

    getSortIcon(field) {
        const getSortClassnames = (className) => `w-4 h-4 ml-1 ${className}`;
        
        if (this.currentSortField !== field) {
            return getIcon(IconNames.SORT_UNSORTED, getSortClassnames('invisible group-hover:visible text-gray-400'));
        }
        
        return this.sortDirection === 'asc'
            ? getIcon(IconNames.SORT_ASC, getSortClassnames('text-blue-500'))
            : getIcon(IconNames.SORT_DESC, getSortClassnames('text-blue-500'));
    }

    attachDesktopEventListeners() {
        // Sort headers
        const headers = this.container.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', () => this.handleSort(header.dataset.sort));
        });

        // Row clicks
        const rows = this.container.querySelectorAll('tbody tr[data-user-id]');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const userId = parseInt(row.dataset.userId);
                const user = this.users.find(u => u.id === userId);
                if (user) {
                    this.onUserClick(user);
                }
            });
        });
    }

    attachMobileEventListeners() {
        // Mobile sort field change
        const sortFieldSelect = this.container.querySelector('#mobile-sort-field');
        if (sortFieldSelect) {
            sortFieldSelect.addEventListener('change', (e) => {
                this.currentSortField = e.target.value;
                this.handleSort(this.currentSortField);
            });
        }

        // Mobile sort direction toggle
        const sortDirectionBtn = this.container.querySelector('#mobile-sort-direction');
        if (sortDirectionBtn) {
            sortDirectionBtn.addEventListener('click', () => {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                sortDirectionBtn.setAttribute('data-direction', this.sortDirection);
                this.handleSort(this.currentSortField || 'firstName');
            });
        }

        // Mobile user card clicks
        const userCards = this.container.querySelectorAll('.user-card[data-user-id]');
        userCards.forEach(card => {
            card.addEventListener('click', () => {
                const userId = parseInt(card.dataset.userId);
                const user = this.users.find(u => u.id === userId);
                if (user) {
                    this.onUserClick(user);
                }
            });
        });
    }

    handleSort(field) {
        if (this.onSort) {
            this.onSort(field);
        }
    }

    showLoading(show) {
        if (!show) return;
        this.container.innerHTML = `
            <div class="flex justify-center items-center py-12 h-[835px]">
                <div class="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-500"></div>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="flex justify-center items-center py-12 h-[835px]">
                <div class="text-center">
                    ${getIcon(IconNames.ERROR, 'mx-auto h-12 w-12 text-red-500 mb-4')}
                    <p class="text-red-600 font-semibold">${message}</p>
                </div>
            </div>
        `;
    }
}