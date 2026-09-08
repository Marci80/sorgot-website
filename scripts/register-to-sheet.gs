/**
 * register-to-sheet.gs
 *
 * Google Apps Script Web App that appends registration-form submissions
 * (from src/pages/register.astro) as rows in a Google Sheet.
 *
 * This runs ALONGSIDE Formspree — Formspree still sends the notification
 * e-mail and the auto-reply; this script only mirrors each submission
 * into the spreadsheet.
 *
 * Full setup instructions: scripts/google-sheet-setup.md
 */

// The target spreadsheet's ID — the long token in its URL:
// https://docs.google.com/spreadsheets/d/<THIS PART>/edit
var SHEET_ID = '1Yop9osJ72FQuC6kfzhjewBWcBAFeGch7H6-CVTG4gPI';

// Tab (sheet) to write into. Created automatically if it does not exist.
var SHEET_NAME = 'הרשמות';

// Form field names, in the order they appear in the site form.
var FIELDS = ['name', 'phone', 'email', 'city', 'notes'];

// Header row written once, when the tab is empty.
var HEADERS = ['תאריך', 'שם מלא', 'טלפון', 'אימייל', 'יישוב', 'הערות'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var params = (e && e.parameter) ? e.parameter : {};
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    var row = [new Date()];
    for (var i = 0; i < FIELDS.length; i++) {
      row.push(params[FIELDS[i]] || '');
    }
    sheet.appendRow(row);

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the deploy URL in a browser to confirm it is live.
function doGet() {
  return jsonOutput({ ok: true, message: 'register-to-sheet is live' });
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
