function isValidName(value) {
  if (typeof value !== 'string') return false;
  const s = value.trim();
  if (!s) return false;
  // Allow Turkish letters, spaces, hyphens and apostrophes. Disallow digits.
  const re = /^[A-Za-zÇçĞğİıÖöŞşÜü' -]+$/u;
  return re.test(s);
}

function onlyLettersFilter(value) {
  if (typeof value !== 'string') return '';
  // Remove any digits
  return value.replace(/[0-9]/g, '');
}

function normalizePhoneTr(raw) {
  if (typeof raw !== 'string') return null;
  // Keep digits only
  let digits = raw.replace(/\D+/g, '');

  // Strip leading country code 90 if present
  if (digits.startsWith('90')) {
    digits = digits.slice(2);
  }
  // If 10 digits, prepend leading 0
  if (digits.length === 10) {
    digits = '0' + digits;
  }
  // Now must be 11 digits starting with 0
  if (digits.length !== 11 || digits[0] !== '0') return null;

  // Validate Turkish numbering plan roughly:
  // 0 5xx yyy zz zz (mobile) or 0 [234]xx yyy zz zz (landline)
  const re = /^0(5\d{2}|[234]\d{2})\d{7}$/;
  if (!re.test(digits)) return null;
  return digits;
}

function isValidPhoneTr(raw) {
  return normalizePhoneTr(raw) !== null;
}

module.exports = { isValidName, onlyLettersFilter, normalizePhoneTr, isValidPhoneTr };

