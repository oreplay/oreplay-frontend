export const XML_FILE_EXTENSION = ".xml"

export interface SplitXmlFiles {
  accepted: File[]
  rejected: File[]
}

export function isXmlFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(XML_FILE_EXTENSION)
}

export function splitXmlFiles(files: File[]): SplitXmlFiles {
  return {
    accepted: files.filter(isXmlFile),
    rejected: files.filter((file) => !isXmlFile(file)),
  }
}
