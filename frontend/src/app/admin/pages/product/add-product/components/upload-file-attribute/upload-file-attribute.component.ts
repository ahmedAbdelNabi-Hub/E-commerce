import { Component, EventEmitter, Output } from '@angular/core';
import { IProductAttribute } from '../../../../../../core/models/interfaces/IProductAttribute';
import { fadeInOut } from '../../../../../../shared/animations/fadeInOut';

@Component({
  selector: 'app-upload-file-attribute',
  templateUrl: './upload-file-attribute.component.html',
  styleUrls: ['./upload-file-attribute.component.css'],
  animations: [fadeInOut]
})
export class UploadFileAttributeComponent {
  isDisplay = false; // Controls the display of the modal
  productAttributes: IProductAttribute[] = []; // Holds extracted attributes
  textInput: string = ''; // Binds to the textarea content

  @Output() productAttributesChanged: EventEmitter<IProductAttribute[]> = new EventEmitter<IProductAttribute[]>();

  // Toggles modal visibility
  toggleModal(): void {
    this.isDisplay = !this.isDisplay;
  }

  // Process the textarea content and extract attributes
  processText(): void {
    if (this.textInput.trim()) {
      this.productAttributes = this.extractAttributes(this.textInput);
      this.productAttributesChanged.emit(this.productAttributes); // Emit the attributes
      this.toggleModal(); 
    }
  }

  // Extract attributes from text
  extractAttributes(text: string): IProductAttribute[] {
    const lines = text.split('\n');
    const attributes: IProductAttribute[] = [];

    lines.forEach((line) => {
      // Split line into key-value pairs based on tab or colon
      const [key, value] = line.split(/\t|:/).map((item) => item.trim());
      if (key && value) {
        const isFilterable = this.isFilterableKey(key); // Define filterable logic
        attributes.push({
          attributeName: key,
          attributeValue: value,
          isFilterable: isFilterable,
          productId:0,
          id:0,
        });
      }
    });

    return attributes;
  }
  isFilterableKey(key: string): boolean {
    const filterableKeys = ['Brand', 'RAM Size', 'Processor Type', 'Screen Resolution']; // Example keys
    return filterableKeys.some((filterKey) => key?.toLowerCase().includes(filterKey?.toLowerCase()));
  }
}
