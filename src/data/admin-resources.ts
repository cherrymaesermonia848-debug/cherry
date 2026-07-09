export type AdminTransportation = {
  type: string;
  description: string;
};

export type AdminResourceRecord = {
  id: number;
  name: string;
  locations: string;
  facebook_page: string;
  gmail: string;
  transportations: AdminTransportation[];
  about: string;
  image_src: string;
  iframe_link: string;
};

export const adminResources = {
  barangay: {
    id: 1,
    name: "Sample Barangay",
    locations: "Pontevedra, Capiz",
    facebook_page: "https://facebook.com/samplebarangay",
    gmail: "samplebarangay@gmail.com",
    transportations: [
      {
        type: "Tricycle",
        description: "Ride a tricycle from the town proper to the barangay center.",
      },
    ],
    about: "A local barangay record with contact details, travel options, and visitor notes.",
    image_src: "/background_image/g5.jpg",
    iframe_link: "https://www.google.com/maps/embed?pb=",
  },
  beaches: {
    id: 1,
    name: "Sample Beach",
    locations: "Pontevedra shoreline",
    facebook_page: "https://facebook.com/samplebeach",
    gmail: "samplebeach@gmail.com",
    transportations: [
      {
        type: "Motor",
        description: "You can ride a motor from the town proper.",
      },
      {
        type: "Bus",
        description: "Take a bus, then transfer to a local ride near the beach.",
      },
    ],
    about: "A quiet beach destination for swimming, sunset viewing, and family trips.",
    image_src: "/background_image/b6.jpg",
    iframe_link: "https://www.google.com/maps/embed?pb=",
  },
  resort: {
    id: 1,
    name: "Sample Resort",
    locations: "Pontevedra, Capiz",
    facebook_page: "https://facebook.com/sampleresort",
    gmail: "sampleresort@gmail.com",
    transportations: [
      {
        type: "Van",
        description: "Ride a van to Pontevedra and ask for a drop-off near the resort access road.",
      },
      {
        type: "Private vehicle",
        description: "Private vehicles can follow the map link directly to the resort.",
      },
    ],
    about: "A resort listing for amenities, access, contact details, and guest information.",
    image_src: "/background_image/f16.jpg",
    iframe_link: "https://www.google.com/maps/embed?pb=",
  },
  touristspot: {
    id: 1,
    name: "Sample Tourist Spot",
    locations: "Pontevedra destination area",
    facebook_page: "https://facebook.com/sampletouristspot",
    gmail: "sampletouristspot@gmail.com",
    transportations: [
      {
        type: "Bus",
        description: "Ride a bus to Pontevedra, then use a tricycle or motor to reach the spot.",
      },
      {
        type: "Motor",
        description: "A motor ride is useful for narrower local roads near the destination.",
      },
    ],
    about: "A tourist spot record for travel details, attraction notes, and public contact information.",
    image_src: "/background_image/g13.jpg",
    iframe_link: "https://www.google.com/maps/embed?pb=",
  },
  cafe: {
    id: 1,
    name: "Sample Cafe",
    locations: "Town proper, Pontevedra",
    facebook_page: "https://facebook.com/samplecafe",
    gmail: "samplecafe@gmail.com",
    transportations: [
      {
        type: "Walk",
        description: "Walk from the municipal plaza if you are already in the town proper.",
      },
      {
        type: "Tricycle",
        description: "Take a tricycle for a direct ride to the cafe entrance.",
      },
    ],
    about: "A cafe listing for food, drinks, opening details, and visitor information.",
    image_src: "/background_image/f6.jpg",
    iframe_link: "https://www.google.com/maps/embed?pb=",
  },
  heritage: {
    id: 1,
    name: "Sample Heritage Site",
    locations: "Historic area, Pontevedra",
    facebook_page: "https://facebook.com/sampleheritage",
    gmail: "sampleheritage@gmail.com",
    transportations: [
      {
        type: "Bus",
        description: "Ride a bus to Pontevedra, then take a local tricycle to the heritage site.",
      },
    ],
    about: "A heritage destination record for history, location, access, and visitor guidance.",
    image_src: "/background_image/g8.jpg",
    iframe_link: "https://www.google.com/maps/embed?pb=",
  },
} satisfies Record<string, AdminResourceRecord>;
