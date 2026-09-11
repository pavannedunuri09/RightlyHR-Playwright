export type ContactSet = {
  personalEmail: string;
  phoneNumber: string;
  workNumber: string;
  linkedInUrl: string;
};

export const CONTACT_SET_A: ContactSet = {
  personalEmail: 'indu1@yopmail.com',
  phoneNumber: '9886577745',
  workNumber: '9876543210',
  linkedInUrl: 'https://linkedin.com/in/indu-test-a',
};

export const CONTACT_SET_B: ContactSet = {
  personalEmail: 'indu2@yopmail.com',
  phoneNumber: '9886577746',
  workNumber: '9876543211',
  linkedInUrl: 'https://linkedin.com/in/indu-test-b',
};

export function alternateContactSet(current: ContactSet): ContactSet {
  const matchesA =
    current.personalEmail === CONTACT_SET_A.personalEmail &&
    current.phoneNumber === CONTACT_SET_A.phoneNumber;
  return matchesA ? CONTACT_SET_B : CONTACT_SET_A;
}
