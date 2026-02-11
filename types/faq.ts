export interface FAQItem {
  title: string;
  content: string[];
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}
