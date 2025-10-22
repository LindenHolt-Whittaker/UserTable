// Modal for displaying detailed user information
import { Modal } from './Modal.js';
import { getIcon, IconNames } from '../services/IconService.js';

export class UserDetailsModal {
    constructor(showNotification) {
        this.modal = new Modal();
        this.currentUser = null;
        this.showNotification = showNotification || (() => {});
    }

    open(user) {
        this.currentUser = user;
        const content = this.renderContent(user);
        this.modal.open(content);
        this.attachEventListeners();
    }

    close() {
        this.modal.close();
        this.currentUser = null;
    }

    renderContent(user) {
        return `
            <div class="bg-white">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-white">User Details</h2>
                        <button class="modal-close text-white hover:text-gray-200 transition-colors">
                            ${getIcon(IconNames.CLOSE, 'w-6 h-6')}
                        </button>
                    </div>
                </div>

                <!-- User Info -->
                <div class="px-6 py-4">
                    <div class="flex items-center space-x-4 mb-6">
                        <img class="h-20 w-20 rounded-full border-4 border-gray-200" 
                             src="${user.image}" 
                             alt="${user.firstName} ${user.lastName}">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900">
                                ${user.firstName} ${user.lastName}
                            </h3>
                            <p class="text-gray-500">@${user.username}</p>
                        </div>
                    </div>

                    <!-- Details Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <!-- Personal Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-700 mb-3 flex items-center">
                                ${getIcon(IconNames.USER, 'w-5 h-5 mr-2')}
                                Personal Information
                            </h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Age:</span>
                                    <span class="font-medium">${user.age}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Gender:</span>
                                    <span class="font-medium capitalize">${user.gender}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Birth Date:</span>
                                    <span class="font-medium">${user.birthDate}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Height:</span>
                                    <span class="font-medium">${user.height} cm</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Weight:</span>
                                    <span class="font-medium">${user.weight} kg</span>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-700 mb-3 flex items-center">
                                ${getIcon(IconNames.MAIL, 'w-5 h-5 mr-2')}
                                Contact Information
                            </h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Email:</span>
                                    <span class="font-medium text-blue-600 truncate max-w-[180px]">${user.email}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Phone:</span>
                                    <span class="font-medium">${user.phone}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">University:</span>
                                    <span class="font-medium truncate max-w-[180px]">${user.university}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Work Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-700 mb-3 flex items-center">
                                ${getIcon(IconNames.BRIEFCASE, 'w-5 h-5 mr-2')}
                                Work Information
                            </h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Company:</span>
                                    <span class="font-medium">${user.company.name}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Position:</span>
                                    <span class="font-medium">${user.company.title}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Department:</span>
                                    <span class="font-medium">${user.company.department}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Address Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-700 mb-3 flex items-center">
                                ${getIcon(IconNames.LOCATION, 'w-5 h-5 mr-2')}
                                Address
                            </h4>
                            <div class="space-y-2 text-sm">
                                <div>
                                    <span class="font-medium">${user.address.address}</span>
                                </div>
                                <div>
                                    <span class="font-medium">${user.address.city}, ${user.address.state} ${user.address.postalCode}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Country:</span>
                                    <span class="font-medium">${user.address.country}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                ${getIcon(IconNames.INFO_FILLED, 'h-5 w-5 text-blue-400')}
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-blue-700">
                                    <strong>User ID:</strong> ${user.id} | 
                                    <strong>MAC Address:</strong> ${user.macAddress} | 
                                    <strong>IP:</strong> ${user.ip}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button class="btn-delete px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 btn-transition flex items-center">
                        ${getIcon(IconNames.TRASH, 'w-4 h-4 mr-2')}
                        Delete User
                    </button>
                    <button class="btn-edit px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-transition flex items-center">
                        ${getIcon(IconNames.EDIT, 'w-4 h-4 mr-2')}
                        Edit Details
                    </button>
                    <button class="modal-cancel px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 btn-transition">
                        Cancel
                    </button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Close buttons
        const closeBtn = this.modal.modal.querySelector('.modal-close');
        const cancelBtn = this.modal.modal.querySelector('.modal-cancel');
        
        closeBtn?.addEventListener('click', () => this.close());
        cancelBtn?.addEventListener('click', () => this.close());

        const editBtn = this.modal.modal.querySelector('.btn-edit');
        editBtn?.addEventListener('click', () => {
            this.showNotification('Edit functionality is not yet available', 'info');
        });

        const deleteBtn = this.modal.modal.querySelector('.btn-delete');
        deleteBtn?.addEventListener('click', () => {
            this.showNotification('Delete functionality is not yet available', 'info');
        });
    }

    destroy() {
        this.modal.destroy();
    }
}