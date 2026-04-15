# Excel Export Implementation

## Overview

When customers submit the commission form, their details are automatically saved to an Excel file. This allows the team to easily contact customers and manage leads.

## Features

- Automatic Excel file generation on form submission
- Daily Excel files (one file per date: `commission-submissions-YYYY-MM-DD.xlsx`)
- Formatted headers and column widths for easy reading
- Admin API endpoint to retrieve submissions
- Download Excel files directly or get JSON data

## File Storage

Excel files are stored in the `/submissions` directory in the project root:
```
/submissions/
  commission-submissions-2024-04-16.xlsx
  commission-submissions-2024-04-17.xlsx
  ...
```

**Note:** This directory is added to `.gitignore` to prevent committing sensitive customer data.

## Admin API Endpoints

### Get Excel File or JSON Data

**Endpoint:** `GET /api/admin/submissions`

**Query Parameters:**
- `date` (optional): Specific date in `YYYY-MM-DD` format. If not provided, gets today's file.
- `format` (optional): Response format
  - `file` (default): Returns Excel file for download
  - `json`: Returns submissions as JSON

**Example Requests:**

```bash
# Download today's submissions as Excel file
curl http://localhost:3000/api/admin/submissions

# Download specific date's submissions
curl http://localhost:3000/api/admin/submissions?date=2024-04-16

# Get today's submissions as JSON
curl http://localhost:3000/api/admin/submissions?format=json

# Get specific date's submissions as JSON
curl http://localhost:3000/api/admin/submissions?date=2024-04-16&format=json
```

### Test Admin Functionality

**Endpoint:** `POST /api/admin/submissions`

Returns statistics about submissions:
- Total submission count
- Number of Excel files
- Recent submissions (last 5)

**Example:**
```bash
curl -X POST http://localhost:3000/api/admin/submissions
```

## Security (Optional)

For production, you can add authentication via an environment variable:

1. Create `.env.local`:
```
ADMIN_TOKEN=your-secret-token-here
```

2. Use the token in requests:
```bash
curl -H "Authorization: Bearer your-secret-token-here" \
  http://localhost:3000/api/admin/submissions
```

If `ADMIN_TOKEN` is not set, the endpoints are publicly accessible (development mode).

## Submitted Data

Each row in the Excel file contains:

| Column | Description |
|--------|-------------|
| submittedAt | ISO timestamp of submission |
| name | Customer's full name |
| email | Customer's email address |
| phone | Customer's contact number |
| desiredCar | Selected car type (coachbuilt-coupe, grand-tourer, bespoke-suv, atelier-edition) |
| investmentRange | Investment budget range |
| message | Customer's vision and description |

## Excel File Format

- **Headers:** Bold white text on blue background
- **Column Widths:** Auto-sized for readability
- **Sheet Name:** "Commissions"
- **Encoding:** UTF-8

## Local Development

1. Start the dev server:
```bash
npm run dev
```

2. Fill out the form at `http://localhost:3000/#contact`

3. Download submissions:
```bash
# Get as Excel file
curl http://localhost:3000/api/admin/submissions > submissions.xlsx

# Or view as JSON
curl http://localhost:3000/api/admin/submissions?format=json
```

## Notes

- Excel files are created once per day
- Multiple submissions on the same day are appended to the same file
- If a submission fails to save to Excel, the API still returns success to the user (graceful degradation)
- No database required - files are stored locally
