# Export Data Feature - Vendor Panel

## Overview
Vendors can now export their product data in CSV format directly from the VendorDashboard. This includes two export options:
1. **Export Current Products** - Download all your existing products
2. **Download Template** - Get a sample template to prepare for bulk uploads

## Features

### 1. Export Current Products
**Location**: Products Tab → "Your Products" section
- **Button**: 📥 Export as CSV
- **Only visible when**: You have products in the system
- **Downloads**: All your products with columns: Name, Price, Category, ImageUrl
- **Filename format**: `products-{RestaurantName}-{timestamp}.csv`

**Use Cases**:
- Backup your product data
- Prepare for bulk updates
- Share product list with team
- Import to other systems

### 2. Download Template
**Location**: Bulk Upload Tab
- **Button**: 📋 Download Template
- **Downloads**: Sample CSV file with example products
- **Includes sample data**:
  - Biryani (₹250)
  - Dosa (₹120)
  - Samosa (₹50)
  - Chai (₹20)

**Use Cases**:
- Understand CSV format before bulk uploading
- Quick template to get started
- Reference for column structure

## CSV Format Details

### Column Format
```
Name,Price,Category,ImageUrl
"Product Name",Price,"Category Name","Image URL or path"
```

### Example Export
```
Name,Price,Category,ImageUrl
"Biryani",250,"Biryani","/uploads/products/biryani.jpg"
"Dosa",120,"Dosa","https://example.com/dosa.jpg"
"Samosa",50,"Snacks",""
"Chai",20,"Beverages",""
```

## How to Use

### Exporting Your Products
1. Go to **Vendor Dashboard** → **Products** tab
2. Scroll to **Your Products** section
3. Click **📥 Export as CSV** button
4. CSV file downloads to your computer
5. Open in Excel, Google Sheets, or any spreadsheet app

### Downloading Template
1. Go to **Vendor Dashboard** → **Bulk Upload** tab
2. Click **📋 Download Template** button
3. CSV template downloads to your computer
4. Edit it with your own products
5. Upload using the bulk upload form

## Editing Exported Data

### In Excel
1. Open the exported CSV in Excel
2. Edit any columns (Name, Price, Category, ImageUrl)
3. Save as CSV format: File → Save As → Format: CSV UTF-8
4. Upload back to Vendor Dashboard

### In Google Sheets
1. Open Google Drive
2. Click **New** → **File Upload**
3. Upload your CSV file
4. Edit in Google Sheets
5. Download as CSV: **File** → **Download** → **CSV**
6. Upload to Vendor Dashboard

## Important Notes

1. **Text in Commas**: Text containing commas or quotes is automatically quoted/escaped
2. **Empty Fields**: Category and ImageUrl can be empty
3. **Price**: Must be a valid number > 0
4. **Image URLs**: Can be:
   - Full URLs: `https://example.com/image.jpg`
   - Relative paths: `/uploads/products/image.jpg`
   - Empty (product works without image)

## CSV Compatibility

These exports are compatible with:
- ✅ Microsoft Excel
- ✅ Google Sheets
- ✅ Apple Numbers
- ✅ LibreOffice Calc
- ✅ Online spreadsheet tools
- ✅ Any text editor

## File Size

- **Single export**: < 100KB (for typical product counts)
- **Template**: < 1KB
- No size restrictions

## Tips

1. **Version your exports**: Filenames include timestamps for easy versioning
2. **Regular backups**: Export periodically to backup product data
3. **Batch updates**: Export → Edit → Upload back for bulk changes
4. **Team sharing**: Share CSV with team using email or shared drives
5. **Data validation**: Always review exported data before uploading

---

**Last Updated**: March 21, 2026
