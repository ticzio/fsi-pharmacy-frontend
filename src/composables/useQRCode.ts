import * as QRCode from 'qrcode'

/**
 * Interface for QR Code options.
 * Based on qrcode library documentation.
 */
interface QRCodeOptions {
  version?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  maskPattern?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  margin?: number
  scale?: number
  width?: number
  color?: {
    dark?: string
    light?: string
  }
}

export function useQRCode() {
  /**
   * Generates a Data URL for the given text.
   * @param text The text to encode in the QR code.
   * @param options QRCode generation options.
   * @returns A promise that resolves to the Data URL.
   */
  const generateDataURL = async (text: string, options?: QRCodeOptions): Promise<string> => {
    try {
      return await QRCode.toDataURL(text, options)
    } catch (error) {
      console.error('Error generating QR Code Data URL:', error)
      throw error
    }
  }

  /**
   * Renders the QR code to a canvas element.
   * @param text The text to encode in the QR code.
   * @param canvas The canvas element to render to.
   * @param options QRCode generation options.
   */
  const generateCanvas = async (
    text: string,
    canvas: HTMLCanvasElement,
    options?: QRCodeOptions,
  ): Promise<void> => {
    try {
      await QRCode.toCanvas(canvas, text, options)
    } catch (error) {
      console.error('Error generating QR Code on canvas:', error)
      throw error
    }
  }

  /**
   * Generates a string representation (e.g., SVG) for the given text.
   * @param text The text to encode in the QR code.
   * @param options QRCode generation options.
   * @returns A promise that resolves to the string.
   */
  const generateString = async (text: string, options?: QRCodeOptions): Promise<string> => {
    try {
      return await QRCode.toString(text, options)
    } catch (error) {
      console.error('Error generating QR Code string:', error)
      throw error
    }
  }

  return {
    generateDataURL,
    generateCanvas,
    generateString,
  }
}
