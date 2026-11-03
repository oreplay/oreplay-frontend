export const XML_FILE_EXTENSION = ".xml"

export interface SplitXmlFiles {
  accepted: File[]
  rejected: File[]
}

/**
 * Tells whether a file name carries the `.xml` extension, ignoring its case.
 * @param name the file name, with its extension.
 * @returns true for names such as `results.xml` or `START.XML`.
 */
export function hasXmlExtension(name: string): boolean {
  return name.toLowerCase().endsWith(XML_FILE_EXTENSION)
}

/**
 * Tells whether a file is an XML file, judging by its name.
 * @param file the file picked or dropped by the user.
 * @returns true when its name ends in `.xml`.
 */
export function isXmlFile(file: File): boolean {
  return hasXmlExtension(file.name)
}

/**
 * Splits files into the XML ones that can be uploaded and the rest.
 * @param files the files picked or dropped by the user, in their order.
 * @returns the XML files as `accepted` and every other file as `rejected`.
 */
export function splitXmlFiles(files: File[]): SplitXmlFiles {
  return {
    accepted: files.filter(isXmlFile),
    rejected: files.filter((file) => !isXmlFile(file)),
  }
}
