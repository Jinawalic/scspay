import "server-only";

export function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeDepartmentCode(facultySlug: string, departmentName: string) {
  const facultyPart = facultySlug.replace(/-/g, "").toUpperCase();
  const departmentPart = makeSlug(departmentName).replace(/-/g, "").toUpperCase();
  return `${facultyPart}-${departmentPart}`.slice(0, 32);
}
