import { useState } from "react";

export default function PreviewTable({ data = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data.length) return null;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      {/* top control */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          แสดง {startIndex + 1} -{" "}
          {Math.min(startIndex + rowsPerPage, data.length)} จาก {data.length} รายการ
        </div>

        <select
          value={rowsPerPage}
          onChange={handleRowsChange}
          className="border rounded-lg px-3 py-1 text-sm"
        >
          <option value={10}>10 แถว</option>
          <option value={20}>20 แถว</option>
          <option value={50}>50 แถว</option>
          <option value={100}>100 แถว</option>
        </select>
      </div>

      {/* table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 sticky top-0">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-4 py-2 whitespace-nowrap">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          หน้า {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}