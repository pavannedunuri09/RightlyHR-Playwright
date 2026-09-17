const FEMALE_FIRST_NAMES = new Set([
  'Kavya', 'Meera', 'Sneha', 'Pooja', 'Anjali', 'Divya', 'Isha', 'Neha', 'Shreya', 'Nandini',
  'Sindhuja', 'Priya', 'Ananya', 'Lakshmi', 'Aishwarya',
]);

export type Gender = 'Male' | 'Female';
export type Salutation = 'Mr.' | 'Miss.' | 'Mrs.';

export function isFemaleFirstName(firstName: string): boolean {
  return FEMALE_FIRST_NAMES.has(firstName);
}

export function salutationForGender(gender: Gender, maritalStatus = 'Single'): Salutation {
  if (gender === 'Male') {
    return 'Mr.';
  }
  return /^married/i.test(maritalStatus) ? 'Mrs.' : 'Miss.';
}

export function genderSalutationForFirstName(
  firstName: string,
  maritalStatus = 'Single',
): { gender: Gender; salutation: Salutation } {
  const gender: Gender = isFemaleFirstName(firstName) ? 'Female' : 'Male';
  return { gender, salutation: salutationForGender(gender, maritalStatus) };
}

export function randomMobile(): string {
  return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
}
export function randomPan(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pick = (count: number) =>
    Array.from({ length: count }, () => letters[Math.floor(Math.random() * 26)]).join('');
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${pick(5)}${digits}${pick(1)}`;
}

export function randomAadhaar(): string {
  return `8${Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')}`;
}

export function randomNumericId(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export function randomDocumentNumber(documentName: string): string | undefined {
  if (/pan/i.test(documentName)) {
    return randomPan();
  }
  if (/aadha?r/i.test(documentName)) {
    return randomAadhaar();
  }
  if (/driving\s*l/i.test(documentName)) {
    return randomNumericId(12);
  }
  if (/resume/i.test(documentName)) {
    return undefined;
  }
  return randomNumericId(12);
}
