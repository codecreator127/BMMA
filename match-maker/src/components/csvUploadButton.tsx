import React, { useCallback } from 'react';

interface CSVUploaderProps {
  onProcessCSV: (data: string[][]) => void;
  accept?: string;
  className?: string;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({
  onProcessCSV,
  accept = '.csv',
  className = ''
}) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const data = lines.map(line => 
        line.split(',').map(cell => cell.trim())
      ).filter(row => row.some(cell => cell !== ''));
      
      onProcessCSV(data);
    };
    
    reader.readAsText(file);
  }, [onProcessCSV]);

  return (
    <div className={`flex ${className}`}>
      <button
        onClick={() => document.getElementById('csv-upload')?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Upload CSV
      </button>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="csv-upload"
      />
    </div>
  );
};

export default CSVUploader;