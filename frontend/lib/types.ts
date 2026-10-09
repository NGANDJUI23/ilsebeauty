export type Service = {
  id: string;
  cat: string;
  name: string;
  mins: number;
  price: number;
  desc: string;
  sig?: boolean;
};

/** Dimanche..Samedi : [ouverture, fermeture] en heures, ou null = fermé */
export type Hours = ([number, number] | null)[];

export type Catalog = {
  currency: string;
  freshaUrl: string;
  bookingWindowDays: number;
  services: Service[];
  hours: Hours;
};

export type BookingInfo = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  first: boolean;
};
