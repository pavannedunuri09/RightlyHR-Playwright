import fs from 'fs';
import path from 'path';

export type SavedOnboardingEmployee = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  designation?: string;
  employmentType?: string;
  location?: string;
  sublocation?: string;
  username?: string;
  password?: string;
  employeeId?: string;
  workEmail?: string;
};

const STORE_PATH = path.resolve(process.cwd(), 'tests', 'fixtures', 'last-onboarding-employee.json');

export function loadLastOnboardingEmployee(): SavedOnboardingEmployee | null {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return null;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw) as SavedOnboardingEmployee;
  } catch {
    return null;
  }
}

export function saveLastOnboardingEmployee(employee: SavedOnboardingEmployee) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(employee, null, 2));
  console.log(`Saved onboarding employee for reuse: ${employee.email}`);
}
