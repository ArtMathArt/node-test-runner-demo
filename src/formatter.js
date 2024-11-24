function formatFileSize(sizeBytes) {
    /* node:coverage disable */
    if (sizeBytes === 0) {
        return '0B';
    }
    /* node:coverage enable */
    const sizeName = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(sizeBytes) / Math.log(1024));
    const p = Math.pow(1024, i);
    const s = (sizeBytes / p).toFixed(2);
    return `${s} ${sizeName[i]}`;
}

export { formatFileSize };
