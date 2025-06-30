import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {
  @ViewChild('invoice', { static: false }) invoiceElement!: ElementRef;
  isLoading = signal<boolean>(false); 

   downloadPDF(): void {
    this.isLoading.set(true); 
    const element = this.invoiceElement.nativeElement;
    html2canvas(element, {
      scale: 1.5,
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.3); 
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 20, 20, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
      this.isLoading.set(false); 
    }).catch(error => {
      console.error('Error generating PDF:', error);
      this.isLoading.set(false); 
    });
  }
}
