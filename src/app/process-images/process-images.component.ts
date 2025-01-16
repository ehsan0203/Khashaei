import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-process-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-images.component.html',
  styleUrls: ['./process-images.component.scss']
})
export class ProcessImagesComponent {
  productImages: File[] = [];
  processedImages: { data: string, name: string }[] = [];
  logoImageSrc: string = '/logo.png'; // مسیر صحیح برای فایل در public

  onProductImagesChange(event: any): void {
    this.productImages = Array.from(event.target.files);
  }

  async processImages(): Promise<void> {
    if (this.productImages.length === 0) {
      alert('Please select product images.');
      return;
    }

    this.processedImages = [];

    try {
      const logoBitmap = await this.loadImage(this.logoImageSrc);

      for (const productImage of this.productImages) {
        const productBitmap = await this.fileToImage(productImage);
        const processedImage = this.addLogoAndWatermark(productBitmap, logoBitmap);
        this.processedImages.push({ data: processedImage, name: productImage.name });
      }
    } catch (error) {
      console.error('Error processing images:', error);
      alert('There was an error processing the images. Please try again.');
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  }

  private fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private addLogoAndWatermark(productImage: HTMLImageElement, logoImage: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas context is not available.');

    // تنظیم اندازه بوم به اندازه تصویر اصلی
    canvas.width = productImage.width;
    canvas.height = productImage.height;

    // رسم تصویر محصول
    ctx.drawImage(productImage, 0, 0);

    // اضافه کردن لوگو
    const logoWidth = canvas.width / 5;
    const logoHeight = (logoImage.height * logoWidth) / logoImage.width;
    ctx.drawImage(logoImage, 10, 10, logoWidth, logoHeight);

    // اضافه کردن چندین واترمارک
    ctx.font = '42px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'center';

    const watermarkText = 'خاشعی';
    const watermarkPositions = [
      { x: canvas.width * 0.2, y: canvas.height * 0.2 },
      { x: canvas.width * 0.4, y: canvas.height * 0.4 },
      { x: canvas.width * 0.6, y: canvas.height * 0.6 },
      { x: canvas.width * 0.8, y: canvas.height * 0.8 },
      { x: canvas.width * 0.3, y: canvas.height * 0.7 },
      { x: canvas.width * 0.7, y: canvas.height * 0.3 },
      { x: canvas.width * 0.5, y: canvas.height * 0.1 },
      { x: canvas.width * 0.1, y: canvas.height * 0.5 },
      { x: canvas.width * 0.9, y: canvas.height * 0.5 },
      { x: canvas.width * 0.5, y: canvas.height * 0.9 },
    ];

    watermarkPositions.forEach((position) => {
      ctx.fillText(watermarkText, position.x, position.y);
    });

    // خروجی به‌عنوان Data URL
    return canvas.toDataURL('image/jpeg');
  }

  downloadImage(imageData: string, fileName: string): void {
    const link = document.createElement('a');
    const newFileName = fileName.replace(/(\.[\w\d_-]+)$/i, '-with-Logo$1');
    link.href = imageData;
    link.download = newFileName;
    link.click();
  }
  
  downloadAllImages(): void {
    if (this.processedImages.length === 0) {
      alert('No images to download.');
      return;
    }
  
    this.processedImages.forEach((image) => {
      const link = document.createElement('a');
      const newFileName = image.name.replace(/(\.[\w\d_-]+)$/i, '-with-Logo$1');
      link.href = image.data;
      link.download = newFileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
