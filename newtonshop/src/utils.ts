export const toPlural = (type: string): string => {
    switch (type.toLowerCase()) {
        case 'iphone':
            return 'iphones';
        case 'ipad':
            return 'ipads';
        case 'mac':
            return 'macs';
        case 'watch':
            return 'watches';
        default:
            return type; // Для всех остальных категорий добавляем 's'
    }
};