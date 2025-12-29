import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
  // Generate the Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
