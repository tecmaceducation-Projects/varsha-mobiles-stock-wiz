// CSV/Excel export utility
export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? "";
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
      }).join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

// Simple PDF-like text export
export function exportToPDF(title: string, sections: { heading: string; rows: string[][] }[]) {
  let content = `${title}\n${"=".repeat(title.length)}\nGenerated: ${new Date().toLocaleString()}\n\n`;
  sections.forEach(section => {
    content += `${section.heading}\n${"-".repeat(section.heading.length)}\n`;
    section.rows.forEach(row => {
      content += row.join(" | ") + "\n";
    });
    content += "\n";
  });
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  downloadBlob(blob, `${title.replace(/\s+/g, "_")}.txt`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
