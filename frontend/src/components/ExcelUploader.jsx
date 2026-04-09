import * as XLSX from "xlsx";
import { CloudUpload, FileSpreadsheet } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ExcelUploader({ setData, setFile, resetTrigger }) {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // useEffect(() => {
  //   setFileName("");
  //   setFile(null);

  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // }, [resetTrigger, setFile]);

  useEffect(() => {
    if (resetTrigger) {
      const resetForm = () => {
        setFileName("");
        setFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };

      resetForm();
    }
  }, [resetTrigger, setFile]);

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target.result;

        const workbook = XLSX.read(binaryStr, {
          type: "binary",
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);

        setData(jsonData);
      } catch (error) {
        console.error("อ่านไฟล์ผิดพลาด:", error);
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl p-8 cursor-pointer bg-white hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 shadow-sm"
    >
      {fileName ? (
        <>
          <FileSpreadsheet className="w-10 h-10 text-green-500 mb-3" />

          <span className="text-sm font-semibold text-green-700 text-center break-all">
            {fileName}
          </span>

          <span className="text-xs text-slate-400 mt-1">
            ไฟล์พร้อมนำเข้า ✅
          </span>
        </>
      ) : (
        <>
          <CloudUpload className="w-10 h-10 text-blue-500 mb-3" />

          <span className="text-sm font-medium text-slate-700">
            ลากไฟล์มาวาง หรือคลิกเลือกไฟล์ Excel
          </span>

          <span className="text-xs text-slate-400 mt-1">
            รองรับ .xlsx .xls .csv
          </span>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>
  );
}
