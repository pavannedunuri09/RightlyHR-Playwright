export type NameSet = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export const NAME_SET_A: NameSet = {
  firstName: 'Indhu',
  middleName: 'sree',
  lastName: 'Kumari',
};

export const NAME_SET_B: NameSet = {
  firstName: 'Indu',
  middleName: '',
  lastName: 'Priya',
};

export function alternateNameSet(current: NameSet): NameSet {
  const matchesA =
    current.firstName.trim() === NAME_SET_A.firstName &&
    current.middleName.trim() === NAME_SET_A.middleName &&
    current.lastName.trim() === NAME_SET_A.lastName;
  return matchesA ? NAME_SET_B : NAME_SET_A;
}

export const INVALID_DOB_UNDERAGE = '2020-07-08';
export const VALID_DOB_A = '2001-07-08';
export const VALID_DOB_B = '1998-05-15';
export const AGE_VALIDATION_PATTERN = /Age must be between 18 and/i;

export function alternateValidDob(current: string): string {
  const normalized = current.trim();
  if (normalized === VALID_DOB_A) {
    return VALID_DOB_B;
  }
  if (normalized === VALID_DOB_B) {
    return VALID_DOB_A;
  }
  return VALID_DOB_A;
}

export type BloodGroup = 'A+' | 'B+' | 'O+' | 'AB+';

export const BLOOD_GROUP_A: BloodGroup = 'B+';
export const BLOOD_GROUP_B: BloodGroup = 'A+';

export function parseBloodGroup(value: string): BloodGroup | null {
  const match = value.match(/(A|B|O|AB)[+-]/i);
  if (!match) {
    return null;
  }
  const token = match[0].toUpperCase();
  if (token === 'A+' || token === 'B+' || token === 'O+' || token === 'AB+') {
    return token;
  }
  return null;
}

export function alternateBloodGroup(current: string): BloodGroup {
  const normalized = parseBloodGroup(current);
  if (normalized === BLOOD_GROUP_A) {
    return BLOOD_GROUP_B;
  }
  if (normalized === BLOOD_GROUP_B) {
    return BLOOD_GROUP_A;
  }
  return BLOOD_GROUP_A;
}

export type MaritalStatus = 'Single' | 'Married';

export const MARRIAGE_ANNIVERSARY_A = '2018-06-15';
export const MARRIAGE_ANNIVERSARY_B = '2020-03-10';

export function parseMaritalStatus(value: string): MaritalStatus | null {
  if (/married/i.test(value)) {
    return 'Married';
  }
  if (/single/i.test(value)) {
    return 'Single';
  }
  return null;
}

export function alternateMaritalStatus(current: string): MaritalStatus {
  return parseMaritalStatus(current) === 'Married' ? 'Single' : 'Married';
}

export function alternateMarriageAnniversary(current: string): string {
  const normalized = current.trim();
  if (normalized === MARRIAGE_ANNIVERSARY_A) {
    return MARRIAGE_ANNIVERSARY_B;
  }
  if (normalized === MARRIAGE_ANNIVERSARY_B) {
    return MARRIAGE_ANNIVERSARY_A;
  }
  return MARRIAGE_ANNIVERSARY_A;
}
