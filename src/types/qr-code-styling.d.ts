declare module "qr-code-styling" {
  interface QRCodeStylingOptions {
    width?: number
    height?: number
    type?: "svg" | "canvas" | "webp"
    data?: string
    image?: string
    dotsOptions?: {
      color?: string
      type?: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
    }
    backgroundOptions?: {
      color?: string
    }
    imageOptions?: {
      crossOrigin?: string
      margin?: number
      imageSize?: number
    }
    cornersSquareOptions?: {
      color?: string
      type?: "dot" | "square" | "extra-rounded"
    }
    cornersDotOptions?: {
      color?: string
      type?: "dot" | "square"
    }
    qrOptions?: {
      errorCorrectionLevel?: "L" | "M" | "Q" | "H"
    }
  }

  interface DownloadOptions {
    name?: string
    extension?: "png" | "jpeg" | "webp" | "svg"
    width?: number
    height?: number
  }

  class QRCodeStyling {
    constructor(options?: QRCodeStylingOptions)
    append(container: HTMLElement): void
    update(options: Partial<QRCodeStylingOptions>): void
    download(options?: DownloadOptions): Promise<void>
    getRawData(extension?: "png" | "jpeg" | "webp" | "svg"): Promise<Blob | null>
  }

  export default QRCodeStyling
}
