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

// Header row written once, when the tab is empty. The last column is filled by hand.
var HEADERS = ['תאריך', 'שם מלא', 'טלפון', 'אימייל', 'יישוב', 'הערות', 'הודעת ווטסאפ'];

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

    // Same phone number already registered -> skip (the Formspree e-mail still arrives).
    var phone = normalizePhone_(params.phone);
    if (phone && isDuplicatePhone_(sheet, phone)) {
      return jsonOutput({ ok: true, duplicate: true });
    }

    var row = [new Date()];
    for (var i = 0; i < FIELDS.length; i++) {
      var value = params[FIELDS[i]] || '';
      row.push(FIELDS[i] === 'phone' ? phone : value);
    }

    // The phone column is plain text so the leading 0 is never dropped.
    var target = sheet.getLastRow() + 1;
    sheet.getRange(target, 3).setNumberFormat('@');
    sheet.getRange(target, 1, 1, row.length).setValues([row]);

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

// Israeli numbers -> 0XXXXXXXXX (digits only). Anything that does not look Israeli is kept as typed.
function normalizePhone_(p) {
  var raw = String(p == null ? '' : p).trim();
  if (/^\+/.test(raw) && !/^\+972/.test(raw)) return raw;
  var d = raw.replace(/\D/g, '');
  if (d.indexOf('972') === 0) d = d.slice(3);
  if (d && d.charAt(0) !== '0') d = '0' + d;
  return (d.length === 9 || d.length === 10) ? d : raw;
}

function isDuplicatePhone_(sheet, phone) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var values = sheet.getRange(2, 3, last - 1, 1).getDisplayValues();
  for (var i = 0; i < values.length; i++) {
    if (normalizePhone_(values[i][0]) === phone) return true;
  }
  return false;
}
