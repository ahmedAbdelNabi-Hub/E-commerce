import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value <= 0 ? { positiveNumber: 'Price must be a positive number' } : null;
  };
}

export function dimensionsFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const regex = /^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?$/;  // Regex for (Length x Width x Height)
    return regex.test(value) ? null : { dimensionsFormat: 'Dimensions must be in the format: Length x Width x Height' };
  };
}



export function strongNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasValidCharacters = /^[a-zA-Z0-9\s]+$/.test(value);
    const hasLetters = /[a-zA-Z]/.test(value);  // Ensure there's at least one letter
    return null;
  };
}

// Strong custom validator for the 'description' field
export function strongDescriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const minLength = 10;
    const maxLength = 200;
    if (value && (value.length < minLength || value.length > maxLength)) {
      return { strongDescription: `Description must be between ${minLength} and ${maxLength} characters` };
    }
    return null;
  };
}

// Strong custom validator for the 'brand' field
export function strongBrandValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    const Brands = [
      'Samsung', 'LG','Haier ', 'Jac','Sony', 'Tornado','Panasonic', 'Philips', 'Sharp', 'Toshiba', 'Hisense', 'Vizio', 'Haier',
      'Electrolux', 'Whirlpool', 'GE Appliances', 'Bosch', 'Siemens', 'Miele', 'Frigidaire', 'Maytag', 'Kenmore', 'Amana',
      'Smeg', 'KitchenAid', 'Sub-Zero', 'Thermador', 'Viking', 'Samsung Appliances', 'Dyson', 'Hoover', 'Bissell', 'Eureka',
      'Midea', 'Hitachi', 'Fujitsu', 'Daikin', 'Carrier', 'Trane', 'Honeywell', 'Nest', 'Rheem', 'Lennox',
      'Breville', 'DeLonghi', 'Krups', 'Nespresso', 'Keurig', 'Cuisinart', 'Black+Decker', 'Oster', 'Hamilton Beach', 'Instant Pot',
      'Zojirushi', 'Tiger Corporation', 'Sunbeam', 'Rowenta', 'Tefal', 'Braun', 'Anova', 'Ninja', 'Shark', 'iRobot',
      'Sanyo', 'Pioneer', 'Denon', 'Marantz', 'Yamaha', 'Onkyo', 'JBL', 'Bose', 'Harman Kardon', 'Sonos',
      'Beats by Dre', 'Logitech', 'Corsair', 'Razer', 'SteelSeries', 'Asus', 'Acer', 'HP', 'Dell', 'Lenovo',
      'MSI', 'Apple', 'Microsoft', 'Intel', 'AMD', 'NVIDIA', 'Roku', 'Amazon Fire TV', 'Google Nest', 'TP-Link',
      'Netgear', 'Linksys', 'Ubiquiti', 'Arlo', 'Ring', 'Eufy', 'Sceptre', 'Westinghouse', 'JVC', 'Magnavox'
    ];

    if (Brands.map(brand => brand?.toLowerCase()).includes(value?.toLowerCase())) {
      return null;  // Brand is valid
    }
    return { strongBrand: 'The brand name provided is not allowed' };  // Invalid brand
  };
}
