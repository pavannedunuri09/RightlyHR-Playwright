import fs from 'fs';
import path from 'path';

export type SavedTrainee = {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password?: string;
  employeeId?: string;
  designation?: string;
  salutation?: string;
  middleName?: string;
  gender?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
};

const STORE_PATH = path.resolve(process.cwd(), 'tests', 'fixtures', 'last-trainee.json');

export function loadLastTrainee(): SavedTrainee | null {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return null;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw) as SavedTrainee;
  } catch {
    return null;
  }
}

export function saveLastTrainee(trainee: SavedTrainee) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(trainee, null, 2));
  console.log(`Saved trainee for reuse: ${trainee.email}`);
}

export function isTraineeReusable(rowText: string) {
  return !/documents submitted|documents verified|offer letter/i.test(rowText);
}

export function needsDocumentRequest(rowText: string) {
  return /employee created/i.test(rowText);
}
