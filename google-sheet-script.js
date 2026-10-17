/**
 * Google Apps Script to automatically capture website leads from Abhinav's portfolio
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Name your sheet: "Assurance Digital Inquiries"
 * 3. In Row 1, set these headers:
 *    A1: Name | B1: Email | C1: Service | D1: Message | E1: Date
 * 4. In the top menu, click Extensions -> Apps Script
 * 5. Delete everything in Code.gs, paste this entire file, and click Save (Ctrl+S)
 * 6. Click Deploy -> New deployment
 * 7. Click the gear icon (Select type) -> Web app
 * 8. Set:
 *    - Description: "Website Lead Collector"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (IMPORTANT!)
 * 9. Click Deploy -> Authorize access
 * 10. Copy the Web app URL (looks like: https://script.google.com/macros/s/.../exec)
 * 11. Paste that URL into your abhinav-react-app/.env file as:
 *     VITE_GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;

    var name = data.Name || data.name || '';
    var email = data.Email || data.email || '';
    var service = data.Service || data.service || '';
    var message = data.Message || data.message || '';
    var date = data.Date || data.date || new Date().toLocaleString();

    sheet.appendRow([name, email, service, message, date]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
