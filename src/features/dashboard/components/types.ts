export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Lead' | 'Active' | 'Inactive';
  lastContact: string;
}

export type NewContact = Omit<Contact, 'id'>; 