import { Component, inject, OnInit, signal } from '@angular/core';
import { AttributeDto, AttributeService } from '../../../core/services/Attribute.service';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from '../../../core/services/Message.service';

export interface IBaseApiResponse {
  message: string;
  statusCode: number;
}

interface AttributeValue {
  id: number;
  value: string;
}

interface ProductAttribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attribute.component.html',
  styleUrls: ['./product-attribute.component.css']
})
export class ProductAttributeComponent implements OnInit {
  attributes = signal<ProductAttribute[]>([]);
  showModal = false;
  isEditing = false;
  currentAttribute: ProductAttribute | null = null;
  attributeService = inject(AttributeService);

  attributeName = '';
  attributeValues: string[] = [''];
  attributeId: number = 0;

  constructor(private toast: MessageService) { }

  ngOnInit() {
    this.loadAttributesFromServer();
  }

  loadAttributesFromServer() {
    this.attributeService.getAll().subscribe({
      next: (data) => {
        this.attributes.set(data);
        console.log('✅ Attributes loaded:', data);
      },
      error: (err) => {
        console.error('❌ Failed to fetch attributes:', err);
      }
    });
  }

  openModal(attribute?: ProductAttribute) {
    this.showModal = true;
    this.isEditing = !!attribute;
    this.currentAttribute = attribute ?? null;
    this.attributeId = attribute?.id ?? 0;
    this.attributeName = attribute?.name ?? '';
    this.attributeValues = attribute?.values.map(v => v.value) ?? [''];
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.attributeName = '';
    this.attributeValues = [''];
    this.currentAttribute = null;
    this.isEditing = false;
    this.attributeId = 0;
  }

  addValueField() {
    this.attributeValues.push('');
  }

  removeValueField(index: number) {
    if (this.attributeValues.length > 1) {
      this.attributeValues.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  saveAttribute() {
    if (!this.attributeName.trim()) return;

    const validValues = this.attributeValues
      .map(val => val.trim())
      .filter(val => val.length > 0);

    if (validValues.length === 0) return;

    const dto: AttributeDto = {
      id: this.attributeId,
      name: this.attributeName.trim(),
      values: validValues
    };
   console.log(dto);
    const request$ = this.isEditing
      ? this.attributeService.update(dto, this.attributeId)
      : this.attributeService.create(dto);

    request$.pipe(
      tap((res: IBaseApiResponse) => {
        this.toast.showSuccess(`${this.isEditing ? 'Updated' : 'Created'} successfully:${res.message}`);
        this.loadAttributesFromServer();
        this.closeModal();
      }),
      catchError(err => {
        this.toast.showError(`Failed to ${this.isEditing ? 'update' : 'create'} attribute:${err?.error?.message ?? err}`);
        this.closeModal();
        return of(null);
      })
    ).subscribe();
  }

  deleteAttribute(id: number) {
    if (!confirm('Are you sure you want to delete this attribute?')) return;

    this.attributeService.delete(id).pipe(
      tap((res: IBaseApiResponse) => {
        console.log('🗑️ Deleted successfully:', res.message);
        this.loadAttributesFromServer();
      }),
      catchError(err => {
        console.error('❌ Failed to delete attribute:', err?.error?.message ?? err);
        return of(null);
      })
    ).subscribe();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getValuesString(values: AttributeValue[]): string {
    return values.map(v => v.value).join(', ');
  }
}
