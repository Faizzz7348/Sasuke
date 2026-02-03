# Duplicate Code Detection Feature

## Overview
Sistem pengesan duplicate code telah diimplementasikan untuk membantu pengguna mengesan kod yang sama dalam table yang sama atau di table-table lain.

## Features

### 1. **Numeric Only Input**
- Field `code` hanya menerima input numeric (angka sahaja)
- Sebarang karakter non-numeric akan automatik di-remove

### 2. **Real-time Duplicate Detection**
- Sistem akan check duplicate secara automatik ketika user menaip kod
- Menggunakan debouncing (500ms) untuk mengelakkan terlalu banyak API request
- Check dilakukan untuk:
  - Duplicate dalam table yang sama
  - Duplicate di table lain (cross-table)

### 3. **Visual Indicators**

#### Duplicate dalam Table yang Sama
- Input field akan mempunyai **border merah tebal (2px)**
- Background bertukar ke **merah muda** (red-50)
- Tooltip warning muncul di bawah input: "⚠️ Duplicate in this table!"
- Button "Add Row" akan di-disable

#### Duplicate di Table Lain
- Input field akan mempunyai **border kuning tebal (2px)**
- Background bertukar ke **kuning muda** (yellow-50)
- Warning banner muncul di atas form dengan maklumat detail:
  - Nama table yang mengandungi duplicate
  - Region table tersebut (Selangor/KL)
  - Location yang berkenaan
- Tooltip warning: "⚠️ Duplicate in: [Table Name]"

### 4. **Warning Messages**

#### Format Warning
```
⚠️ Duplicate! This code already exists in this table.
```
atau
```
⚠️ Duplicate! This code already exists in: Table Name (region)
```

#### Detail Information
Bila duplicate dijumpai di table lain, sistem akan show:
- Table name
- Region (Selangor/Kuala Lumpur)
- Location entry yang duplicate

## API Endpoints

### Check Duplicate
```
GET /api/tables/:tableId/check-duplicate?code=123&rowId=abc
```

**Parameters:**
- `code` (required): Kod yang ingin dicek
- `rowId` (optional): ID row yang sedang di-edit (untuk exclude dari check)

**Response:**
```json
{
  "hasDuplicate": true,
  "sameTable": false,
  "otherTables": true,
  "duplicateInfo": [
    {
      "tableId": "xyz",
      "tableName": "Kuala Lumpur Zone 1",
      "region": "kl",
      "location": "KLCC"
    }
  ]
}
```

## Usage Examples

### Scenario 1: Add New Row dengan Duplicate di Table Sama
1. User buka dialog "Add New Row"
2. User taip code "123" 
3. Sistem detect code "123" sudah wujud dalam table yang sama
4. Input field bertukar merah dengan border tebal
5. Warning muncul: "⚠️ Duplicate! This code already exists in this table."
6. Button "Add Row" di-disable
7. User kena tukar kod kepada value yang berbeza

### Scenario 2: Edit Row dengan Duplicate di Table Lain
1. User enable Edit Mode
2. User edit code dari "456" kepada "789"
3. Sistem detect code "789" wujud di table lain (contoh: "Selangor Zone 2")
4. Input field bertukar kuning dengan border tebal
5. Tooltip muncul di bawah input dengan nama table
6. User masih boleh save (sebagai warning sahaja, bukan error)

### Scenario 3: Add New Row dengan Duplicate di Multiple Tables
1. User buka dialog "Add New Row"
2. User taip code "999"
3. Sistem detect code "999" wujud di 2 table lain:
   - "Selangor Zone 3" (Selangor) - Shah Alam
   - "KL Central" (KL) - Bukit Bintang
4. Warning banner muncul dengan detail list:
   ```
   ⚠️ Duplicate! This code already exists in: Selangor Zone 3 (selangor), KL Central (kl)
   
   • Selangor Zone 3 (selangor) - Shah Alam
   • KL Central (kl) - Bukit Bintang
   ```
5. User masih boleh add row (sebagai warning)

## Technical Implementation

### Files Modified
1. **`/workspaces/Lasttable/api/lib/tables.ts`**
   - Added `checkDuplicateCode()` function

2. **`/workspaces/Lasttable/api/server.ts`**
   - Added endpoint handler for duplicate checking

3. **`/workspaces/Lasttable/src/pages/TableDetail.tsx`**
   - Added duplicate detection states
   - Added `checkDuplicate()` function with debouncing
   - Added visual indicators (red/yellow borders)
   - Added warning messages and tooltips
   - Modified `handleInputChange()` and `handleEditCell()` to validate numeric input
   - Disabled "Add Row" button when duplicate exists in same table

### Key Functions
- `checkDuplicateCode(code, currentTableId?, currentRowId?)` - API function to check duplicates
- `checkDuplicate(code, rowId?)` - Frontend function to call API
- `debouncedCheckDuplicate()` - Debounced version with 500ms delay
- `useDebounce()` - Custom hook for debouncing

## Color Coding

| Condition | Border Color | Background Color | Action |
|-----------|--------------|------------------|--------|
| Same Table Duplicate | Red (#ef4444) | Red-50 | Block Save/Add |
| Other Table Duplicate | Yellow (#eab308) | Yellow-50 | Warning Only |
| No Duplicate | Default | Default | Allow Save/Add |

## Browser Compatibility
- Input dengan `inputMode="numeric"` untuk better mobile experience
- Pattern `[0-9]*` untuk HTML5 validation
- Fully responsive design untuk mobile dan desktop

## Future Enhancements
1. Option untuk allow/force duplicate di table lain
2. History tracking untuk duplicate codes
3. Bulk duplicate checking untuk import feature
4. Custom duplicate rules per region
5. Export report untuk duplicate codes
