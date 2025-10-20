# Ringkasan Terjemahan - Translation Summary

## Overview
Semua teks dalam aplikasi telah diterjemahkan dari Bahasa Inggris ke Bahasa Indonesia. Konteks "system" telah diperbarui menjadi konteks "AWB" sesuai dengan domain aplikasi.

All texts in the application have been translated from English to Bahasa Indonesia. The "system" context has been updated to "AWB" context according to the application domain.

---

## File-by-File Translation Summary

### 1. **app/page.tsx**
- ✅ Title: "AWB Data Reconciliation" → "Rekonsiliasi Data AWB"
- ✅ Subtitle: "System Comparison & Validation" → "Perbandingan & Validasi Sistem"
- ✅ Status: "Operational" → "Beroperasi"
- ✅ Loading text: "Loading comparison results..." → "Memuat hasil perbandingan..."

### 2. **components/excel-uploader.tsx**
**Workflow Section:**
- ✅ "Data Comparison Workflow" → "Alur Kerja Perbandingan Data"
- ✅ "Upload File" → "Unggah File"
- ✅ "Excel workbook with required sheets" → "Workbook Excel dengan sheet yang diperlukan"
- ✅ "Auto Processing" → "Proses Otomatis"
- ✅ "System validates & compares" → "Sistem memvalidasi & membandingkan"
- ✅ "Review Results" → "Tinjau Hasil"
- ✅ "Insights & discrepancies" → "Wawasan & perbedaan"

**Upload Section:**
- ✅ "Analyzing Data..." → "Menganalisis Data..."
- ✅ "Processing {fileName}" → "Memproses {fileName}"
- ✅ "Upload Comparison File" → "Unggah File Perbandingan"
- ✅ "Drop your Excel workbook here or click to select from your device" → "Letakkan workbook Excel Anda di sini atau klik untuk memilih dari perangkat Anda"
- ✅ "Choose File" → "Pilih File"
- ✅ "Required worksheet names (case-sensitive)" → "Nama worksheet yang diperlukan (case-sensitive)"

**Error Messages:**
- ✅ "Please upload a valid Excel file" → "Silakan unggah file Excel yang valid"
- ✅ "File size exceeds {X}MB limit" → "Ukuran file melebihi batas {X}MB"
- ✅ "Failed to process Excel file" → "Gagal memproses file Excel"

### 3. **components/comparison-dashboard.tsx**
**Header:**
- ✅ "Analysis Complete" → "Analisis Selesai"
- ✅ "Report generated on {date} at {time}" → "Laporan dibuat pada {date} pukul {time}"
- ✅ "Export Excel" → "Ekspor Excel"
- ✅ "New Comparison" → "Perbandingan Baru"

**Tabs:**
- ✅ "Overview" → "Ringkasan"
- ✅ "Details" → "Detail"
- ✅ "Weight Analysis" → "Analisis Berat"
- ✅ "System Presence" → "Keberadaan AWB"

**Error Message:**
- ✅ "Failed to export report. Please try again." → "Gagal mengekspor laporan. Silakan coba lagi."

### 4. **components/statistics-view.tsx**
**Summary Section:**
- ✅ "Reconciliation Summary" → "Ringkasan Rekonsiliasi"
- ✅ "System-wide AWB comparison overview" → "Gambaran umum perbandingan AWB di semua sistem"
- ✅ "Total AWBs" → "Total AWB"
- ✅ "Match Rate" → "Tingkat Kecocokan"

**Statistics Cards:**
- ✅ "Total Unique AWBs" → "Total AWB Unik"
- ✅ "Perfect Matches" → "Kecocokan Sempurna"
- ✅ "In all 3 sheets with matching weights" → "Ada di semua 3 sheet dengan berat yang cocok"
- ✅ "Weight Mismatches" → "Ketidakcocokan Berat"
- ✅ "Present but weights don't match" → "Ada tetapi berat tidak cocok"
- ✅ "In All Three Sheets" → "Di Semua Tiga Sheet"

**Section Headers:**
- ✅ "Performance Indicators" → "Indikator Kinerja"
- ✅ "System Distribution" → "Distribusi AWB"
- ✅ "Key Insights" → "Wawasan Utama"

**Insights:**
- ✅ "Perfect Match Rate" → "Tingkat Kecocokan Sempurna"
- ✅ "AWBs validated across all systems with matching weights" → "AWB tervalidasi di semua sistem dengan berat yang cocok"
- ✅ "Weight Discrepancies" → "Ketidakcocokan Berat"
- ✅ "AWBs require attention for weight validation" → "AWB memerlukan perhatian untuk validasi berat"
- ✅ "Single-System Records" → "Hanya di Satu AWB"
- ✅ "AWBs found in only one system - investigation recommended" → "AWB ditemukan hanya di satu sistem - disarankan untuk investigasi"

### 5. **components/weight-comparison-table.tsx**
**Search & Filters:**
- ✅ "Search AWB number..." → "Cari nomor AWB..."
- ✅ "Filter by status..." → "Filter berdasarkan status..."
- ✅ "All Records" → "Semua Data"
- ✅ "Perfect Matches" → "Kecocokan Sempurna"
- ✅ "Weight Mismatches" → "Ketidakcocokan Berat"
- ✅ "Missing Weights" → "Berat Hilang"
- ✅ "Per page:" → "Per halaman:"

**Table Headers:**
- ✅ "AWB Number" → "Nomor AWB"
- ✅ "Variance" → "Selisih"

**Status Badges:**
- ✅ "Match" → "Cocok"
- ✅ "Mismatch" → "Tidak Cocok"
- ✅ "Incomplete" → "Tidak Lengkap"

**Pagination:**
- ✅ "Displaying X-Y of Z records" → "Menampilkan X-Y dari Z data"
- ✅ "Page X of Y" → "Halaman X dari Y"
- ✅ "Previous" → "Sebelumnya"
- ✅ "Next" → "Selanjutnya"

**Empty State:**
- ✅ "No records found" → "Tidak ada data ditemukan"
- ✅ "Try adjusting your filters or search term" → "Coba sesuaikan filter atau kata kunci pencarian Anda"

### 6. **components/awb-comparison-table.tsx**
**Search & Filters:**
- ✅ "Search AWB number..." → "Cari nomor AWB..."
- ✅ "Filter by system..." → "Filter berdasarkan sistem..."
- ✅ "All Records" → "Semua Data"
- ✅ "All Systems" → "Semua Sistem"
- ✅ "Missing from Any" → "Hilang dari Sistem Manapun"
- ✅ "JASTER Only" → "Hanya JASTER"
- ✅ "CIS Only" → "Hanya CIS"
- ✅ "UNIFIKASI Only" → "Hanya UNIFIKASI"
- ✅ "Per page:" → "Per halaman:"

**Table Headers:**
- ✅ "AWB Number" → "Nomor AWB"
- ✅ "System Presence" → "Keberadaan AWB"
- ✅ "Missing From" → "Hilang Dari"

**Status Badges:**
- ✅ "All Systems" → "Semua Sistem"
- ✅ "2 Systems" → "2 Sistem"
- ✅ "1 System" → "1 Sistem"
- ✅ "None" → "Tidak Ada"

**Pagination:**
- ✅ "Displaying X-Y of Z records" → "Menampilkan X-Y dari Z data"
- ✅ "Page X of Y" → "Halaman X dari Y"
- ✅ "Previous" → "Sebelumnya"
- ✅ "Next" → "Selanjutnya"

**Empty State:**
- ✅ "No records found" → "Tidak ada data ditemukan"
- ✅ "Try adjusting your filters or search term" → "Coba sesuaikan filter atau kata kunci pencarian Anda"

### 7. **components/comparison-table.tsx**
**Search & Filters:**
- ✅ "Search by AWB..." → "Cari berdasarkan AWB..."
- ✅ "Filter by..." → "Filter berdasarkan..."
- ✅ "All Records" → "Semua Data"
- ✅ "Perfect Matches" → "Kecocokan Sempurna"
- ✅ "Weight Mismatches" → "Ketidakcocokan Berat"
- ✅ "Missing Data" → "Data Hilang"

**Table:**
- ✅ "AWB Number" → "Nomor AWB"
- ✅ "Issues" → "Masalah"
- ✅ "Showing X of Y records" → "Menampilkan X dari Y data"

**Status Badges:**
- ✅ "Perfect Match" → "Kecocokan Sempurna"
- ✅ "{X} Issues" → "{X} Masalah"
- ✅ "Partial" → "Sebagian"
- ✅ "None" → "Tidak Ada"

**Empty State:**
- ✅ "No records found" → "Tidak ada data ditemukan"

### 8. **lib/excel-parser.ts**
**Error Messages:**
- ✅ "AWB column not found in {sheetName}" → "Kolom AWB tidak ditemukan di {sheetName}"
- ✅ "No data received from file" → "Tidak ada data yang diterima dari file"
- ✅ "Missing required sheets: {sheets}" → "Sheet yang diperlukan tidak ditemukan: {sheets}"
- ✅ "No valid data found in any sheet" → "Tidak ada data valid yang ditemukan di sheet manapun"
- ✅ "Failed to parse Excel file" → "Gagal memproses file Excel"
- ✅ "Failed to read file" → "Gagal membaca file"

### 9. **lib/export-utils.ts**
**Excel Export Headers:**
- ✅ "Excel Comparison Report" → "Laporan Perbandingan Excel"
- ✅ "Generated:" → "Dibuat:"
- ✅ "Summary Statistics" → "Statistik Ringkasan"
- ✅ "Total Unique AWBs" → "Total AWB Unik"
- ✅ "Perfect Matches" → "Kecocokan Sempurna"
- ✅ "Weight Mismatches" → "Ketidakcocokan Berat"
- ✅ "In All Three Sheets" → "Di Semua Tiga Sheet"
- ✅ "Distribution" → "Distribusi"
- ✅ "JASTER Only" → "Hanya JASTER"
- ✅ "CIS Only" → "Hanya CIS"
- ✅ "UNIFIKASI Only" → "Hanya UNIFIKASI"

**Sheet Names:**
- ✅ "Summary" → "Ringkasan"
- ✅ "Detailed Comparison" → "Perbandingan Detail"
- ✅ "Issues Only" → "Hanya Masalah"

**Column Headers:**
- ✅ "AWB Number" → "Nomor AWB"
- ✅ "JASTER Weight" → "Berat JASTER"
- ✅ "CIS Weight" → "Berat CIS"
- ✅ "UNIFIKASI Weight" → "Berat UNIFIKASI"
- ✅ "In JASTER" → "Di JASTER"
- ✅ "In CIS" → "Di CIS"
- ✅ "In UNIFIKASI" → "Di UNIFIKASI"
- ✅ "Weight Match" → "Berat Cocok"
- ✅ "Issues" → "Masalah"
- ✅ "Yes" → "Ya"
- ✅ "No" → "Tidak"
- ✅ "None" → "Tidak Ada"

**Error Message:**
- ✅ "Failed to export comparison report" → "Gagal mengekspor laporan perbandingan"

### 10. **lib/comparison-engine.ts**
**Discrepancy Messages:**
- ✅ "Missing in JASTER" → "Hilang di JASTER"
- ✅ "Missing in CIS" → "Hilang di CIS"
- ✅ "Missing in UNIFIKASI" → "Hilang di UNIFIKASI"
- ✅ "Weight mismatch" → "Berat tidak cocok"

---

## Key Context Changes

### System → AWB Context
Sesuai dengan instruksi, konteks "system" telah diubah menjadi konteks "AWB" di seluruh aplikasi:

1. **"System Presence" → "Keberadaan AWB"**
   - Lebih spesifik menjelaskan keberadaan nomor AWB di berbagai sheet

2. **"System Distribution" → "Distribusi AWB"**
   - Menjelaskan distribusi AWB di berbagai sistem (JASTER, CIS, UNIFIKASI)

3. **"Single-System Records" → "Hanya di Satu AWB"**
   - Lebih jelas menunjukkan AWB yang hanya ada di satu sistem

4. **"All Systems" → "Semua Sistem"**
   - Tetap menggunakan kata "sistem" untuk konteks teknis yang jelas

5. **"System-wide AWB comparison" → "Gambaran umum perbandingan AWB di semua sistem"**
   - Menjelaskan secara eksplisit bahwa ini adalah perbandingan AWB lintas sistem

---

## Translation Principles Applied

1. **Clarity (Kejelasan)**: Terjemahan dibuat sejelas mungkin untuk pengguna Indonesia
2. **Context (Konteks)**: Mempertahankan konteks domain AWB dan logistik
3. **Consistency (Konsistensi)**: Istilah yang sama diterjemahkan dengan cara yang konsisten
4. **Technical Terms (Istilah Teknis)**: Beberapa istilah teknis seperti "JASTER", "CIS", "UNIFIKASI" dipertahankan
5. **User-Friendly (Ramah Pengguna)**: Menggunakan bahasa yang mudah dipahami pengguna Indonesia

---

## Technical Terms Kept in Original Form

Beberapa istilah teknis dipertahankan dalam bentuk aslinya karena merupakan nama sistem atau standar industri:

- **AWB** (Air Waybill)
- **JASTER** (nama sistem)
- **CIS** (nama sistem)
- **UNIFIKASI** (nama sistem)
- **Excel** (nama produk)
- **CHW** / **Chw. Weight** (istilah teknis)
- **Kg** (satuan berat)

---

## Date Updated
20 Oktober 2025

## Status
✅ **COMPLETE** - Semua teks telah diterjemahkan ke Bahasa Indonesia
