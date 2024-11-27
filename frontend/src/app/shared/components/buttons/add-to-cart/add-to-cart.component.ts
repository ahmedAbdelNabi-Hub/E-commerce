import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css'
})
export class AddToCartComponent implements OnInit{
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    const cartButtons = document.querySelectorAll('.cart-button');
    
    cartButtons.forEach(button => {
      button.addEventListener('click', this.cartClick.bind(this));
    });
  }

  // Handle the click event and add the class
  cartClick(event: Event): void {
    const buttonElement = (event.target as HTMLElement).closest('.cart-button');
    
    if (buttonElement) {
      // Do your logic here, such as adding the 'clicked' class
      buttonElement.classList.add('clicked');
    }
  }
}
