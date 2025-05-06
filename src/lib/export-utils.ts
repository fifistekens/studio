import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import for side effects

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export function downloadCsv(data: any[], columns: string[], filename: string = 'export.csv') {
  const header = columns.join(',') + '\n';
  const csv = data.map(row => 
    columns.map(col => JSON.stringify(row[col] ?? '')).join(',')
  ).join('\n');
  
  const csvFile = new Blob([header + csv], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function downloadExcel(data: any[], columns: string[], filename: string = 'export.xlsx') {
  const worksheetData = data.map(item => {
    const row: { [key: string]: any } = {};
    columns.forEach(col => {
      row[col] = item[col];
    });
    return row;
  });
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: columns });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
}

export function downloadPdf(data: any[], columns: string[], title: string = 'Report', filename: string = 'export.pdf') {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  const tableColumn = columns.map(col => ({ header: col, dataKey: col }));
  const tableRows = data.map(item => {
    const row: { [key: string]: any } = {};
    columns.forEach(col => {
      row[col] = item[col] ?? ''; // Ensure values are not undefined/null for jspdf-autotable
    });
    return row;
  });

  doc.autoTable({
    columns: tableColumn,
    body: tableRows,
    startY: 30,
    headStyles: { fillColor: [0, 77, 64] }, // Dark Green: #004d40
    alternateRowStyles: { fillColor: [224, 242, 241] }, // Light Teal for alternating rows
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      // You can set specific column widths if needed
      // Example: UserId: { cellWidth: 20 },
    }
  });
  
  doc.save(filename);
}
