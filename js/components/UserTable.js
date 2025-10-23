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
    }

    setUsers(users) {
        this.users = users;
    }

    setPaginatedUsers(users) {
        this.paginatedUsers = users;
    }

    render(usersToRender = this.paginatedUsers) {
        const getTableHeaderClassnames = (className) => `group cursor-pointer w-1/8 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`;
        
        const tableHTML = `
            <table class="w-full">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="${getTableHeaderClassnames('hover:bg-gray-100 w-2/5 lg:w-1/3 xl:w-1/4 px-3')}" data-sort="firstName">
                            <div class="flex items-center">
                                Name
                                ${this.getSortIcon('firstName')}
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('hover:bg-gray-100 w-2/5 lg:w-1/4')}" data-sort="email">
                            <div class="flex items-center">
                                Email
                                ${this.getSortIcon('email')}
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('hidden sm:table-cell pl-1 pr-3 w-1/5 md:w-1/8')}">
                            <div class="flex items-center">
                                Company
                                <span class="ml-1 text-gray-400" title="Sorting not available">
                                    ${getIcon(IconNames.INFO, 'w-4 h-4 invisible group-hover:visible')}
                                </span>
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('hidden lg:table-cell pl-1 pr-3')}">
                            <div class="flex items-center">
                                Role
                                <span class="ml-1 text-gray-400" title="Sorting not available">
                                    ${getIcon(IconNames.INFO, 'w-4 h-4 invisible group-hover:visible')}
                                </span>
                            </div>
                        </th>
                        <th class="${getTableHeaderClassnames('hover:bg-gray-100 hidden xl:table-cell')}" data-sort="role">
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
                            <td class="hidden sm:table-cell pl-1 pr-3 py-4 whitespace-nowrap text-sm text-gray-900">${user.company.name}</td>
                            <td class="hidden lg:table-cell pl-1 pr-3 py-4 whitespace-nowrap text-sm text-gray-500">${user.company.title}</td>
                            <td class="hidden xl:table-cell px-1 py-4 whitespace-nowrap text-sm text-gray-500">${user.role}</td>
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
        this.attachEventListeners();
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

    attachEventListeners() {
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