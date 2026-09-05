/**
 * Service menu + pricing, lifted out of `services-page.ts` so it has exactly one home.
 *
 * `core/seo/schema.ts` loops over this to emit schema.org Service entries — per Steph's
 * spec, "loop over this list in code ... don't hand-type each one, so it stays correct
 * if Joey changes pricing". Edit prices here and both the page and the structured data
 * follow.
 */

export interface ServiceItem {
  name: string;
  price: string;
  description?: string;
  note?: string;
  bookingUrl: string;
}

export interface ServiceCategory {
  title: string;
  services: ServiceItem[];
}

export const SERVICES_CONTENT = {
  title: 'Our Services',
  extensions: {
    title: 'Extensions',
    services: [
      {
        name: 'Extension Consultation',
        // TODO: swap in the real price and ?serviceId= once MangoMint provides them.
        // Until then this opens the salon's generic booking page rather than a broken service link.
        price: '$50.00',
        description:
          'Temporary + Semi-Permanent Options Available: Clip-Ins, Tape-Ins, Keratin Tips (Hot + Cold Fusion), Microlinks',
        note: 'Consultation fee goes toward the cost of extensions.',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=31',
      },
      {
        name: 'Sew-In Extension Consultation',
        price: '$50.00',
        description: '',
        note: 'Consultation fee goes toward the cost of extensions.',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=109',
      },
      {
        name: 'Wig Consultation',
        price: '$100.00',
        description: '',
        note: 'Consultation fee goes toward the cost of a wig.',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=115',
      },
    ],
  },
  chemicalTreatments: {
    title: 'Chemical Treatments',
    services: [
      {
        name: 'Botanical Smoother',
        price: '$475.00+',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=45',
      },
      {
        name: 'Keratin Treatment',
        price: '$325.00+',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=48',
      },
    ],
  },
  color: {
    title: 'Color',
    services: [
      {
        name: 'Single Process',
        price: '$95.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=25',
      },
      {
        name: 'Double Process',
        price: '$150.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=26',
      },
      {
        name: 'Single Process with Full Highlights',
        price: '$400.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=28',
      },
      {
        name: 'Single Process with Partial Highlights',
        price: '$450.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=29',
      },
      {
        name: 'Eyebrow Color',
        price: '$25.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=97',
      },
      {
        name: '1/4 Highlight',
        price: '$95.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=17',
      },
      {
        name: '1/4 Balayage',
        price: '$125.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=18',
      },
      {
        name: '1/2 Balayage',
        price: '$250.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=20',
      },
      {
        name: '1/2 Highlight',
        price: '$250.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=19',
      },
      {
        name: 'Full Highlight',
        price: '$350.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=21',
      },
      {
        name: 'Full Balayage',
        price: '$400.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=22',
      },
      {
        name: 'Gloss',
        price: '$95.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=24',
      },
    ],
  },
  styling: {
    title: 'Styling',
    services: [
      {
        name: 'Blowout',
        price: '$75.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=59',
      },
      {
        name: 'Braids/Braiding',
        price: '$50.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=108',
      },
      {
        name: 'Silk Press',
        price: '$120.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=110',
      },
      {
        name: 'Style',
        price: '$125.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=63',
      },
      {
        name: 'Updo',
        price: '$250.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=65',
      },
      {
        name: 'Blowout with Clip-ins',
        price: '$95.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=111',
      },
      {
        name: 'Partial Updo',
        price: '$175.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=113',
      },
    ],
  },
  haircuts: {
    title: 'Haircuts',
    services: [
      {
        name: "Women's Haircut",
        price: '$125.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=43',
      },
      {
        name: "Men's Haircut",
        price: '$125.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=41',
      },
      {
        name: "Children's Haircut (under 12 years old)",
        price: '$100.00',
        bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=42',
      },
    ],
  },
  cta: {
    title: 'LET US TAKE CARE OF YOU',
    description:
      'Experience luxury hair care with our expert stylists. Book your appointment today and discover the perfect look for you.',
    buttonText: 'Book Appointment',
  },
};

/** Priced categories only — the CTA block is presentation, not a service. */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  SERVICES_CONTENT.extensions,
  SERVICES_CONTENT.chemicalTreatments,
  SERVICES_CONTENT.color,
  SERVICES_CONTENT.styling,
  SERVICES_CONTENT.haircuts,
];
