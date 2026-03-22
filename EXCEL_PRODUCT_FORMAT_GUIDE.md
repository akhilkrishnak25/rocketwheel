# Excel Product Upload Format Guide

## Overview
This guide explains how to prepare an Excel file for bulk uploading products with the category field.

## Required & Optional Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| **Name** | Text | ✅ Yes | Product name |
| **Price** | Number | ✅ Yes | Product price in ₹ |
| **Category** | Text | ❌ No | Product category (e.g., Biryani, Dosa, etc.) |
| **ImageUrl** | Text | ❌ No | Full image URL or /uploads/products/filename.jpg |

## Column Name Variations

The system recognizes variations of column names:
- **Name**: `name`, `Name`, `productName`, `ProductName`, `product`, `Product`
- **Price**: `price`, `Price`, `amount`, `Amount`, `cost`, `Cost`
- **Category**: `category`, `Category`, `cat`, `Cat`
- **Image**: `imageUrl`, `ImageUrl`, `imageURL`, `ImageURL`, `image`, `Image`

## Excel File Format

### Example Header Row
```
Name | Price | Category | ImageUrl
```

### Example Data Rows
```
Biryani | 250 | Biryani | https://example.com/biryani.jpg
Dosa | 120 | Dosa | /uploads/products/dosa.jpg
Samosa | 50 | Snacks | 
Chai | 20 | Beverages | https://example.com/chai.jpg
```

## Important Notes

1. **Price Validation**:
   - Price must be a valid number greater than 0
   - Commas and currency symbols are automatically removed

2. **Category Usage**:
   - Category is optional
   - Will be used for filtering in the customer menu
   - Empty categories are allowed

3. **Image URLs**:
   - Can be full remote URL (starts with http:// or https://)
   - Can be local path (e.g., /uploads/products/image.jpg)
   - Optional field - product works without image

4. **File Format**:
   - Supported formats: `.xlsx`, `.xls`, `.csv`
   - Maximum file size: 5MB
   - Only first sheet is processed

## Upload Process

1. Go to **Vendor Dashboard** → **Bulk Upload** tab
2. Select your Excel file
3. Click **Upload File**
4. System will show:
   - Number of products added
   - Number of rows skipped (if any)
   - Reason for skipped rows

## Troubleshooting

### Rows Skipped - Invalid Name or Price
- **Cause**: Missing name or invalid price
- **Solution**: Ensure every product has a name and valid price > 0

### No Valid Products Found
- **Cause**: All rows have errors
- **Solution**: Check that the file has at least one valid product with name and price

### File Too Large
- **Cause**: File exceeds 5MB
- **Solution**: Reduce file size or split into multiple files

## Tips for Success

1. **Use consistent column names** - Use the standard names for best results
2. **Test locally first** - Upload a small batch to test the format
3. **Add categories** - Using categories enables customer filtering
4. **Unique filenames** - If uploading images, use unique filenames
5. **Validate prices** - Make sure all prices are valid numbers

## Example: Complete Excel File

### Sheet 1 (First Sheet)

| Name | Price | Category | ImageUrl |
|------|-------|----------|----------|
| Chicken Biryani | 250 | Biryani | /uploads/products/chicken_biryani.jpg |
| Mutton Biryani | 300 | Biryani | /uploads/products/mutton_biryani.jpg |
| Masala Dosa | 120 | Dosa | https://example.com/masala_dosa.jpg |
| Plain Dosa | 80 | Dosa | |
| Samosa | 50 | Snacks | |
| Chai | 20 | Beverages | /uploads/products/chai.jpg |
| Coffee | 30 | Beverages | |

---

**Note**: This guide is for vendors who want to bulk upload products. For manual single product addition, use the "Add Product" form in the Vendor Dashboard.
