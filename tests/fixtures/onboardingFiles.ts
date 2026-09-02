import fs from 'fs';
import path from 'path';

export type OnboardingFiles = {
  pdf: string;
  image: string;
  invalidType: string;
  oversized: string;
};

export function createOnboardingFiles(dir: string): OnboardingFiles {
  fs.mkdirSync(dir, { recursive: true });

  const pdf = path.join(dir, 'resume.pdf');
  const image = path.join(dir, 'document.png');
  const invalidType = path.join(dir, 'invalid.txt');
  const oversized = path.join(dir, 'oversized.pdf');

  fs.writeFileSync(
    pdf,
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 200 200]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF\n',
  );
  fs.writeFileSync(
    image,
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    ),
  );
  fs.writeFileSync(invalidType, 'this is not a pdf or image');
  fs.writeFileSync(oversized, Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(26 * 1024 * 1024, 65)]));

  return { pdf, image, invalidType, oversized };
}
