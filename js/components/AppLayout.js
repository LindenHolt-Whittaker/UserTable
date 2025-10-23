// Handles the overall application layout
import { getIcon, IconNames } from '../services/IconService.js';

export class AppLayout {
    constructor(container) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <!-- Header -->
            <header class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            ${getIcon(IconNames.USERS, 'w-8 h-8 text-blue-600 mr-3')}
                            <h1 class="text-2xl font-bold text-gray-800">User Directory</h1>
                        </div>
                        <button id="refreshBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-transition flex items-center">
                            ${getIcon(IconNames.REFRESH, 'w-4 h-4 sm:mr-2')}
                            <span class="hidden sm:inline">
                                Refresh
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto px-4 py-8">
                <!-- Stats and Search Bar -->
                <div class="mb-6 bg-white rounded-lg shadow-sm p-6 fade-in">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div id="stats" class="text-gray-600"></div>
                        <div class="flex-1 max-w-md">
                            <div class="relative">
                                <input 
                                    type="text" 
                                    id="searchInput" 
                                    placeholder="Search name or email..." 
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                ${getIcon(IconNames.SEARCH, 'absolute left-3 top-2.5 w-5 h-5 text-gray-400')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Table Container -->
                <div id="userTable" class="bg-white rounded-lg shadow-sm overflow-hidden fade-in"></div>

                <!-- Instructions -->
                <div class="mt-8 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg fade-in">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            ${getIcon(IconNames.INFO_FILLED, 'h-5 w-5 text-blue-400')}
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-blue-800">How to use User Directory:</h3>
                            <div class="mt-2 text-sm text-blue-700">
                                <ul class="list-disc list-inside space-y-1">
                                    <li>Click on any user row to view detailed information</li>
                                    <li>Use the search bar to filter users by name, email, username</li>
                                    <li>Click on column headers to sort the table</li>
                                    <li>In the user details modal, you can perform mock edit and delete actions</li>
                                    <li>Click the Refresh button to reload the user data</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="mt-12 py-6 bg-white border-t">
                <div class="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
                    <p>Built with JavaScript and Tailwind CSS</p>
                    <p class="mt-1">Data provided by <a href="https://dummyjson.com" target="_blank" class="text-blue-600 hover:underline">DummyJSON API</a></p>
                </div>
            </footer>
        `;
    }

    getElements() {
        return {
            searchInput: document.getElementById('searchInput'),
            userTableContainer: document.getElementById('userTable'),
            // loadingIndicator: document.getElementById('loadingIndicator'),
            refreshBtn: document.getElementById('refreshBtn'),
            statsContainer: document.getElementById('stats')
        };
    }
}