import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

export interface AttributeValue {
  id: number;
  value: string;
}

export interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

export interface SelectedAttribute {
  attributeId: number;
  attributeName: string;
  attributeValueId: number | null;
  valueName: string;
  attributeValue? : string;
}

@Component({
  selector: 'app-product-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit, OnChanges {
  @Input() existingAttributes: SelectedAttribute[] = [];
  @Output() attributesSelected = new EventEmitter<SelectedAttribute[]>();

  attributes: Attribute[] = [];
  selectedAttributes: SelectedAttribute[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['existingAttributes'] &&
      changes['existingAttributes'].currentValue &&
      Array.isArray(changes['existingAttributes'].currentValue)
    ) {
      this.selectedAttributes = [...changes['existingAttributes'].currentValue];
      console.log('✅ Existing attributes loaded:', changes['existingAttributes'].currentValue);
    }
  }


  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAttributes();
  }

  loadAttributes() {
    this.loading = true;
    this.error = null;

    this.http.get<Attribute[]>('https://localhost:7197/api/attributes')
      .pipe(
        catchError(err => {
          console.error('Error loading attributes:', err);
          this.error = 'Failed to load attributes. Please try again.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(data => {
        this.attributes = data;

        if (this.existingAttributes.length > 0) {
          this.selectedAttributes = this.existingAttributes.map(attr => ({
            ...attr
          }));
        }
      });
  }

  addAttribute() {
    this.selectedAttributes.push({
      attributeId: 0,
      attributeName: '',
      attributeValueId: null,
      valueName: ''
    });
    this.clearMessages();
  }

  removeAttribute(index: number) {
    this.selectedAttributes.splice(index, 1);
    this.clearMessages();
  }

  onAttributeChange(index: number, attributeId: number): void {
    const selectedAttribute = this.attributes.find(attr => attr.id === attributeId);

    this.selectedAttributes[index] = selectedAttribute
      ? {
        attributeId: selectedAttribute.id,
        attributeName: selectedAttribute.name,
        attributeValueId: null,
        valueName: ''
      }
      : {
        attributeId: 0,
        attributeName: '',
        attributeValueId: null,
        valueName: ''
      };

    this.clearMessages();
  }

  onValueChange(index: number, attributeValueId: number): void {
    const attributeId = this.selectedAttributes[index].attributeId;
    const attribute = this.attributes.find(attr => attr.id === attributeId);
    const selectedValue = attribute?.values.find(val => val.id === attributeValueId);

    if (selectedValue) {
      this.selectedAttributes[index].attributeValueId = selectedValue.id;
      this.selectedAttributes[index].valueName = selectedValue.value;
    } else {
      this.selectedAttributes[index].attributeValueId = null;
      this.selectedAttributes[index].valueName = '';
    }

    this.clearMessages();
  }

  getAvailableAttributes(currentIndex: number): Attribute[] {
    const usedIds = this.selectedAttributes
      .map((attr, i) => i !== currentIndex ? attr.attributeId : null)
      .filter(id => id !== null && id !== 0);
    return this.attributes.filter(attr => !usedIds.includes(attr.id));
  }

  getValuesForAttribute(attributeId: number): AttributeValue[] {
    return this.attributes.find(attr => attr.id === attributeId)?.values || [];
  }

  onSubmit() {
    this.clearMessages();

    const validAttributes = this.selectedAttributes.filter(
      attr => attr.attributeId > 0 && attr.attributeValueId !== null
    );

    if (validAttributes.length === 0) {
      this.error = 'Please select at least one attribute with a value';
      return;
    }

    const result: SelectedAttribute[] = validAttributes.map(attr => ({
      attributeId: attr.attributeId,
      attributeValueId: attr.attributeValueId!,
      attributeName: attr.attributeName,
      valueName: attr.valueName,
    }));

    this.successMessage = `${validAttributes.length} attributes selected for product`;
    this.attributesSelected.emit(result);
  }

  clearAll() {
    this.selectedAttributes = [];
    this.clearMessages();
  }

  private clearMessages() {
    this.error = null;
    this.successMessage = null;
  }

  retryLoad() {
    this.loadAttributes();
  }
}
