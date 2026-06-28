
export const testimonials = [
  {
    id: 1,
    name: "Shabana",
    role: "Boutique Owner",
    location: "Mumbai",
    rating: 5,
    quote:
      "I used to sell only through WhatsApp, which made it hard to track orders. Now, local customers discover my boutique effortlessly through Needlon, and my sales have doubled!",
    isFeatured: true, // Visually highlights the central story
  },
  {
    id: 2,
    name: "Priyanka Sen",
    role: "Saree Designer",
    location: "Kolkata",
    rating: 5,
    quote:
      "Paying 15-20% commission to big e-commerce websites was killing my business. Keeping 100% of my profits here has allowed me to invest back into better fabrics.",
    isFeatured: false,
  },
  {
    id: 3,
    name: "Ramesh Kumar",
    role: "Readymade Garments",
    location: "Delhi",
    rating: 5,
    quote:
      "Setting up was incredibly simple because of the Hindi language support. I launched my home business in less than ten minutes without any technical help.",
    isFeatured: false,
  },
];

export type testMonialDataType = typeof testimonials[number];

