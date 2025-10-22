// SVG Sprite Icon System

// Get an icon from the sprite
export function getIcon(iconName, className = '') {
    return `<svg class="${className}"><use href="#icon-${iconName}"></use></svg>`;
}

// Icon name constants
export const IconNames = {
    // Notifications
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    INFO_FILLED: 'info-filled',
    WARNING: 'warning',

    // UI
    CLOSE: 'close',
    SEARCH: 'search',
    REFRESH: 'refresh',
    
    // Sorting
    SORT_UNSORTED: 'sort-unsorted',
    SORT_ASC: 'sort-asc',
    SORT_DESC: 'sort-desc',
    
    // Data
    EMPTY_INBOX: 'empty-inbox',
    
    // Users
    USER: 'user',
    USERS: 'users',
    
    // Contact
    MAIL: 'mail',
    BRIEFCASE: 'briefcase',
    LOCATION: 'location',
    
    // Actions
    TRASH: 'trash',
    EDIT: 'edit',
    
    // Navigation
    CHEVRON_LEFT: 'chevron-left',
    CHEVRON_RIGHT: 'chevron-right'
};