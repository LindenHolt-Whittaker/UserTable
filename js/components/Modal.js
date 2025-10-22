// Reusable modal component
export class Modal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.escKeyListener = null;
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'fixed inset-0 z-50 hidden overflow-y-auto';
        this.modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <!-- Background overlay -->
                <div class="fixed inset-0 transition-opacity modal-overlay" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <!-- Center modal -->
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <!-- Modal panel -->
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div class="modal-content"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Click overlay to close
        const overlay = this.modal.querySelector('.modal-overlay');
        overlay.addEventListener('click', () => this.close());

        // ESC key to close
        this.escKeyListener = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.escKeyListener);
    }

    open(content) {
        const contentContainer = this.modal.querySelector('.modal-content');
        contentContainer.innerHTML = content;
        this.modal.classList.remove('hidden');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.add('hidden');
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    setContent(content) {
        const contentContainer = this.modal.querySelector('.modal-content');
        contentContainer.innerHTML = content;
    }

    destroy() {
        if (this.escKeyListener) {
            document.removeEventListener('keydown', this.escKeyListener);
            this.escKeyListener = null;
        }
        this.modal.remove();
    }
}