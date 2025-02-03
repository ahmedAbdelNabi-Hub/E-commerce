export function groupProductByName(data: any[]): { [key: string]: any[] } {
    return data.reduce((acc, product) => {
      const name = product.name;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(product);
      return acc;
    }, {} as { [key: string]: any[] });
  }
  