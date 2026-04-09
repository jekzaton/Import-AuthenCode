const { pool } = require("../config/db");
const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");

const storage = multer.memoryStorage();

exports.upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

exports.ImportAuth = async (req, res) => {
  try {
    const { importDate } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบไฟล์",
      });
    }

    if (!importDate) {
      return res.status(400).json({
        success: false,
        message: "กรุณาเลือกวันที่",
      });
    }

    // console.log("เริ่ม import...");
    // console.log("วันที่ import:", importDate);

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // console.log("จำนวน rows:", rows.length);

    if (rows.length > 0) {
      // console.log("Header:", Object.keys(rows[0]));
    }

    let totalUpdated = 0;

    for (const row of rows) {
      const cid = String(
        row.cid || row.CID || row["เลขบัตร"] || row["เลขบัตรประชาชน"] || "",
      ).trim();

      const auth_code = String(
        row.auth_code ||
          row.AUTH_CODE ||
          row.authcode ||
          row["CLAIM CODE"] ||
          "",
      ).trim();

      const vstdate = importDate;

      const thaiDate = row["วันที่บันทึก Authen Code"];

      let authDateTime = null;

      if (thaiDate) {
        const [datePart, timePart] = thaiDate.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hour, minute, second] = timePart.split(":");

        authDateTime = `${parseInt(year) - 543}-${month}-${day} ${hour}:${minute}:${second}`;
      }

      if (!cid || !auth_code) {
        // console.log("skip row:", row);
        continue;
      }

      // console.log("CID:", cid);
      // console.log("AUTH:", auth_code);
      // console.log("DATETIME:", authDateTime);

      const [result] = await pool.execute(
        `
        UPDATE visit_pttype v
        LEFT JOIN vn_stat vn ON vn.vn = v.vn
        LEFT JOIN patient p ON p.hn = vn.hn
        SET v.auth_code = ?,
            v.staff = 'API',
            v.Auth_DateTime = ?
        WHERE vn.vstdate = ?
          AND p.cid = ?
          AND (v.auth_code = '' OR v.auth_code IS NULL)
        `,
        [auth_code, authDateTime, vstdate, cid],
      );

      totalUpdated += result.affectedRows;

      // console.log("Updated:", result.affectedRows, cid);
    }

    // console.log("Import เสร็จทั้งหมด:", totalUpdated);

    res.json({
      success: true,
      message: `Import สำเร็จ 🎉 update ${totalUpdated} รายการ`,
    });
  } catch (err) {
    console.error("Import Error:", err);

    res.status(500).json({
      success: false,
      message: "Import ไม่สำเร็จ",
      error: err.message,
    });
  }
};
