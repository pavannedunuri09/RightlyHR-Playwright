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
    Buffer.concat([
      Buffer.from(
        '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n5 0 obj<</Length 44>>stream\nBT /F1 12 Tf 72 720 Td (Resume) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n0000000343 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n435\n%%EOF\n',
      ),
      Buffer.alloc(2048, 0),
    ]),
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
