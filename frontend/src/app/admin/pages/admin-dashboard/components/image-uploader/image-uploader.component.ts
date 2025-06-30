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
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];

    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await browserImageCompression(file, options);

      const bgRemovedBlob = await this.removeBackground(compressedFile);

      const webpImage = await this.convertToWebP(bgRemovedBlob);

      this.previewImage = webpImage;

      const finalFile = this.base64ToFile(webpImage, 'processed-image.webp');
      this.imageFileChange.emit(finalFile);

    } catch (error) {
      console.error('Error processing the image:', error);
    }
  }

  private async removeBackground(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': this.apiKey },
        body: formData,
      });

      if (!response.ok) throw new Error('Background removal failed.');
      return response.blob(); 
      
    } catch (error) {
      console.error('Remove.bg API error:', error);
      return file; 
    }
  }

  private async convertToWebP(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = new OffscreenCanvas(600, 600); // Use OffscreenCanvas for speed
        const ctx = canvas.getContext('2d')!;
        
        const aspectRatio = img.height / img.width;
        canvas.width = 600;
        canvas.height = 600 * aspectRatio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.convertToBlob({ type: 'image/webp', quality: 0.8 }).then((webpBlob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(webpBlob);
        }).catch(reject);
      };
      img.src = URL.createObjectURL(blob);
    });
  }

  private base64ToFile(base64: string, fileName: string): File {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], fileName, { type: 'image/webp', lastModified: Date.now() });
  }

  clearImagePreview(): void {
    this.image = '';
    this.previewImage = null;
  }
}
