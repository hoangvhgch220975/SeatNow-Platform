/**
 * Trigger luồng tải xuống tự động file nhị phân báo cáo (Blob, Excel, Image)
 * @param {Blob|ArrayBuffer} blob Dữ liệu buffer file 
 * @param {string} filename Tên file cần lưu
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  
  link.href = url;
  link.setAttribute('download', filename);
  
  // Appends link to document before clicking as some browsers require it
  document.body.appendChild(link);
  link.click();
  
  // Cleanup browser memory
  link.remove();
  window.URL.revokeObjectURL(url);
};
