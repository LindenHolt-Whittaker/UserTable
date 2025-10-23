// Pagination Component
import { getIcon, IconNames } from '../services/IconService.js';

export class Pagination {
    constructor(options = {}) {
        this.currentPage = options.currentPage || 1;
        this.itemsPerPage = options.itemsPerPage || 10;
        this.totalItems = options.totalItems || 0;
        this.onPageChange = options.onPageChange || (() => {});
        this.maxVisibleButtons = options.maxVisibleButtons || 5;
    }

    setTotalItems(total) {
        this.totalItems = total;
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }
    }

    setCurrentPage(page) {
        const newPage = Math.max(1, Math.min(page, this.totalPages));
        if (newPage !== this.currentPage) {
            this.currentPage = newPage;
            this.onPageChange(this.currentPage);
        }
    }

    get totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    get startIndex() {
        return (this.currentPage - 1) * this.itemsPerPage;
    }

    get endIndex() {
        return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    }

    getPageNumbers() {
        const total = this.totalPages;
        const current = this.currentPage;
        const max = this.maxVisibleButtons;

        if (total <= max) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const half = Math.floor(max / 2);
        let start = current - half;
        let end = current + half;

        if (start < 1) {
            start = 1;
            end = max;
        }

        if (end > total) {
            end = total;
            start = total - max + 1;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    render(container) {
        if (this.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const pageNumbers = this.getPageNumbers();
        const showEllipsisStart = pageNumbers[0] > 1;
        const showEllipsisEnd = pageNumbers[pageNumbers.length - 1] < this.totalPages;

        container.innerHTML = `
            <nav class="flex items-center justify-between px-4 py-3 md:px-6">
                <div class="flex flex-1 justify-between md:hidden">
                    <button 
                        class="pagination-prev relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${this.currentPage === 1 ? 'disabled' : ''}
                    >
                        Previous
                    </button>
                    <span class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                        Page ${this.currentPage} of ${this.totalPages}
                    </span>
                    <button 
                        class="pagination-next relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 ${this.currentPage === this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${this.currentPage === this.totalPages ? 'disabled' : ''}
                    >
                        Next
                    </button>
                </div>
                <div class="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing <span class="font-medium">${this.startIndex + 1}</span> to 
                            <span class="font-medium">${this.endIndex}</span> of 
                            <span class="font-medium">${this.totalItems}</span> results
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button 
                                class="pagination-prev relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${this.currentPage === 1 ? 'disabled' : ''}
                            >
                                ${getIcon(IconNames.CHEVRON_LEFT, 'h-5 w-5')}
                            </button>

                            ${showEllipsisStart ? `
                                <button class="pagination-page relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" data-page="1">1</button>
                                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                            ` : ''}
                            
                            ${pageNumbers.map(num => `
                                <button 
                                    class="pagination-page relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        num === this.currentPage 
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                    }"
                                    data-page="${num}"
                                >
                                    ${num}
                                </button>
                            `).join('')}
                            
                            ${showEllipsisEnd ? `
                                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                                <button class="pagination-page relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" data-page="${this.totalPages}">${this.totalPages}</button>
                            ` : ''}

                            <button 
                                class="pagination-next relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${this.currentPage === this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${this.currentPage === this.totalPages ? 'disabled' : ''}
                            >
                                ${getIcon(IconNames.CHEVRON_RIGHT, 'h-5 w-5')}
                            </button>
                        </nav>
                    </div>
                </div>
            </nav>
        `;

        this.attachEventListeners(container);
    }

    attachEventListeners(container) {
        const prevButtons = container.querySelectorAll('.pagination-prev');
        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.setCurrentPage(this.currentPage - 1);
                }
            });
        });

        const nextButtons = container.querySelectorAll('.pagination-next');
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.setCurrentPage(this.currentPage + 1);
                }
            });
        });

        const pageButtons = container.querySelectorAll('.pagination-page');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                this.setCurrentPage(page);
            });
        });
    }

    paginate(items) {
        const start = this.startIndex;
        const end = this.endIndex;
        return items.slice(start, end);
    }
}