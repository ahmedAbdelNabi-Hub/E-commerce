import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  deliveryMethods = [
    {
      id: 'dhl',
      name: 'DHL Fast Delivery',
      price: 15,
      estimatedTime: 'Get it by Tomorrow',
      logo: '../../../assets/aaws3etof.webp'
    },
    {
      id: 'aramex',
      name: 'Aramex Standard Shipping',
      price: 12,
      estimatedTime: 'Delivery within 2-3 days',
      logo: '../../../assets/download.png'
    },
    {
      id: 'egyptpost',
      name: 'Egypt Post',
      price: 8,
      estimatedTime: 'Delivery within 4-6 days',
      logo: '../../../assets/post.png'
    },
    {
      id: 'bosta',
      name: 'Bosta Express',
      price: 10,
      estimatedTime: 'Same-day delivery in Cairo',
      logo: '../../../assets/bosta.jpg'
    },
    {
      id: 'free',
      name: 'Free Shipping',
      price: 0,
      estimatedTime: 'Available for Cairo & Giza',
      logo: '../../../assets/download (1).png'
    }
  ];

  selectedDeliveryMethod: any; // Store the selected method

  ngOnInit(): void {
    // Automatically select Free Shipping if available
    this.selectedDeliveryMethod = this.deliveryMethods.find(method => method.id === 'free') || this.deliveryMethods[0];
  }

  choiessDeliveryMethod(deliveryMethod: any): void {
    this.selectedDeliveryMethod = deliveryMethod;
    console.log('Selected Delivery Method:', deliveryMethod);
  }
}
