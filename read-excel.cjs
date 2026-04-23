const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '小车修改需求.xlsx');

try {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  console.log('=== Excel文件内容 ===\n');
  
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`\n--- 工作表 ${index + 1}: ${sheetName} ---\n`);
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    jsonData.forEach((row, rowIndex) => {
      const rowStr = row.map(cell => {
        if (cell === null || cell === undefined) return '';
        return String(cell);
      }).join(' | ');
      console.log(`行 ${rowIndex + 1}: ${rowStr}`);
    });
  });
  
} catch (error) {
  console.error('读取Excel文件失败:', error.message);
  console.error(error.stack);
}
