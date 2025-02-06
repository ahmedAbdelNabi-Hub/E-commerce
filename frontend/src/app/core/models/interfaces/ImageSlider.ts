export interface Iadvertisement {
    id:number,
    largeImage: string,
    smallImage: string,
    linkUrl: string,
    title: string,
    subtitle: string,
    section:string,
    targetPage: string, 
    isActive: boolean,  
    description: string,
    direction: string,
    createdAt: Date,
    updatedAt: Date
  }