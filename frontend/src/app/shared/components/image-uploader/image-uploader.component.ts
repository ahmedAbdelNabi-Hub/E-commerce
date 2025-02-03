import { Component, EventEmitter, Input, Output } from '@angular/core';
import browserImageCompression from 'browser-image-compression';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css'],
})
export class ImageUploaderComponent {
  @Input() image: string | ArrayBuffer | null = null;
  @Output() imageFileChange = new EventEmitter<File>();
  previewImage: string | null = null;
  private readonly apiKey: string = 'MHEJSmjCzqe8fYxCqjgofPqf';
  show: boolean = false;

  constructor(private http: HttpClient) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      try {
        // Compression options
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
        const compressedFile = await browserImageCompression(file, options);

        // Remove background
        const bgRemovedImage = await this.removeBackground(compressedFile);

        // Convert to WebP
        const webpImage = await this.convertToWebP(bgRemovedImage);

        // Set preview image
        this.previewImage = webpImage;

        // Convert WebP image to Blob
        const blob = this.base64ToBlob(webpImage, 'image/webp');
        const fileName = `processed-image-${Date.now()}.webp`;
        const fileWithMetaData = new File([blob], fileName, { type: 'image/webp', lastModified: Date.now() });
        
        // Emit the File object
        this.imageFileChange.emit(fileWithMetaData);
      } catch (error) {
        console.error('Error processing the image:', error);
      }
    }
  }

  private async removeBackground(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': this.apiKey },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to remove background. Please try again.');
    }

    return response.blob(); // Return Blob for further processing
  }

  private async convertToWebP(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const fixedWidth = 300; // Desired width
          const aspectRatio = img.height / img.width;
          canvas.width = fixedWidth;
          canvas.height = fixedWidth * aspectRatio;

          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert canvas to WebP
          const webpImage = canvas.toDataURL('image/webp', 0.8);
          resolve(webpImage);
        };
        img.src = reader.result as string;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  private base64ToBlob(base64: string, mime: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mime });
  }

  clearImagePreview(): void {
    this.image = '';
    this.previewImage = null;
  }
}