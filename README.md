# Excel → Database Importer

ระบบนำเข้าข้อมูลจาก Excel เข้า MySQL พร้อม UI สวยงาม

## โครงสร้างโปรเจค

```
excel-to-db/
├── backend/
│   ├── server.js       ← Express API server
│   ├── db.js           ← MySQL connection pool
│   ├── package.json
│   └── .env.example    ← copy เป็น .env แล้วแก้ค่า
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Toast.jsx        ← Toast notification system
│   │   │   ├── Uploader.jsx     ← Drag & Drop file uploader
│   │   │   └── TableViewer.jsx  ← ดูข้อมูลในตาราง
│   │   └── services/
│   │       └── api.js           ← axios API calls
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── setup.sql           ← สร้าง MySQL database
```

## วิธีติดตั้งและรัน

### 1. ตั้งค่า MySQL

```sql
-- รันใน MySQL client
mysql -u root -p < setup.sql
```

### 2. ตั้งค่า Backend

```bash
cd backend

# copy .env
cp .env.example .env

# แก้ค่าใน .env
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=รหัสผ่าน MySQL ของคุณ
# DB_NAME=excel_import_db
# PORT=3001

# ติดตั้ง dependencies
npm install

# รัน server (development)
npm run dev

# หรือ production
npm start
```

### 3. ตั้งค่า Frontend

```bash
cd frontend

# ติดตั้ง dependencies
npm install

# รัน dev server
npm run dev
```

เปิด browser ไปที่ **http://localhost:5173**

## ฟีเจอร์

- 📁 **Drag & Drop** อัปโหลดไฟล์ .xlsx, .xls, .csv
- 👁 **Preview** ดูข้อมูลก่อนนำเข้า
- 🔄 **3 โหมด**: สร้างใหม่ / แทนที่ / ต่อท้าย
- 🏷 **Auto Type Detection** ตรวจจับ INT, DOUBLE, TEXT อัตโนมัติ
- 📊 **Table Viewer** ดูข้อมูลพร้อม Pagination
- 🗑 **Delete Table** ลบตารางได้
- 🔔 **Toast Notifications** แจ้งเตือนสวยงาม
- 💚 **Database Status** ตรวจสอบการเชื่อมต่อ real-time

## API Endpoints

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | /api/health | ตรวจสอบการเชื่อมต่อ DB |
| GET | /api/tables | รายชื่อตารางทั้งหมด |
| GET | /api/tables/:name | ดูข้อมูลในตาราง (paginated) |
| DELETE | /api/tables/:name | ลบตาราง |
| POST | /api/preview | Preview ไฟล์ Excel |
| POST | /api/import | นำเข้าข้อมูลจาก Excel |

## Environment Variables

```env
DB_HOST=localhost      # MySQL host
DB_PORT=3306           # MySQL port
DB_USER=root           # MySQL username
DB_PASSWORD=           # MySQL password
DB_NAME=excel_import_db # Database name
PORT=3001              # Backend port
```
