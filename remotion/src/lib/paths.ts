import path from 'path';

// Resolve paths relative to the onionreel repo root.
export const OR_DIR = path.resolve(process.cwd(), '..');

export function autoeditClip(projectId: string, filename: string){
  return path.join(OR_DIR, 'autoedit', 'cache', projectId, filename);
}
