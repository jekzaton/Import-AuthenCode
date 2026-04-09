import { useState } from "react";
import axios from "axios";
import ExcelUploader from "../components/ExcelUploader";
import PreviewTable from "../components/PreviewTable";
import { toast } from "react-toastify";
import { CalendarDays, FolderOpen } from "lucide-react";

export default function ImportPage() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [importDate, setImportDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetUploader, setResetUploader] = useState(false);

  const handleImport = async () => {
    if (!importDate) {
      toast.warning("กรุณาเลือกวันที่ก่อนนำเข้า ⚠️");
      return;
    }

    if (!file) {
      toast.warning("กรุณาเลือกไฟล์ Excel 📂");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("importDate", importDate);

    try {
      setLoading(true);

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/api/import-authcode",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(res.data.message || "Import สำเร็จ 🎉");

      setData([]);
      setFile(null);
      setImportDate("");

      setResetUploader((prev) => !prev); // สำคัญ
    } catch (err) {
      toast.error(err.response?.data?.message || "Import ไม่สำเร็จ ❌");
    } finally {
      setLoading(false);
    }
  };

  {
    loading && (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium text-gray-700">
            กำลัง Import ข้อมูล...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/images/logo_web.png"
            alt="Hospital Logo"
            className="w-24 h-24 object-contain mb-4 drop-shadow"
          />

          <h1 className="text-3xl font-bold text-blue-700 tracking-tight">
            ระบบ Import Excel AuthenCode
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            โรงพยาบาลยางตลาด Yangtalad Hospital
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
            <label className="flex items-center gap-2 mb-3 font-semibold text-blue-700">
              <CalendarDays /> เลือกวันที่นำเข้า{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={importDate}
              onChange={(e) => setImportDate(e.target.value)}
              className="w-full border border-blue-200 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
            <label className="flex items-center gap-2 mb-3 font-semibold text-slate-700">
              <FolderOpen size={20} /> อัปโหลดไฟล์ Excel
            </label>

            <ExcelUploader
              setData={setData}
              setFile={setFile}
              resetTrigger={resetUploader}
            />
          </div>
        </div>

        {data.length > 0 && (
          <>
            <div className="bg-slate-50 rounded-2xl p-4 shadow-inner border border-slate-100">
              <PreviewTable data={data} />
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleImport}
                disabled={loading}
                className={`px-10 py-3 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-3
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
    }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังประมวลผล...
                  </>
                ) : (
                  "Import Data 🚀"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
