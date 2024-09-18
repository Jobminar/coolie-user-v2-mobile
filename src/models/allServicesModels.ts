export interface Service {
  name: string;
  imageKey: string;
  uiVariant: string[];
  _id: string;
}
export interface mostBookings {
  image: string;
  name: string;
  price: number;
  serviceId: string;
  _id: String;
}

export interface coreServices {
  description: string;
  image: string;
  serviceName: string;
  _id: string;
  price:number;
}
