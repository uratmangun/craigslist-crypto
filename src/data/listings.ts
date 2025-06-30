import { Listing } from '../types/listing';

export const listings: Listing[] = [
  {
    id: 1,
    title: "MacBook Pro 16\" M3 Max - Like New",
    price: "$2,899",
    location: "San Francisco, CA",
    time: "2 hours ago",
    image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Barely used MacBook Pro with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for creative professionals. This laptop has been my daily driver for only 3 months and is in pristine condition. Comes with original box, charger, and documentation. No scratches or dents, screen is perfect. Ideal for video editing, 3D rendering, and software development.",
    verified: true,
    category: "Electronics",
    seller: {
      name: "TechEnthusiast92",
      rating: 4.9,
      verified: true
    },
    specifications: {
      "Processor": "Apple M3 Max",
      "RAM": "32GB Unified Memory",
      "Storage": "1TB SSD",
      "Display": "16-inch Liquid Retina XDR",
      "Condition": "Like New",
      "Warranty": "AppleCare+ until 2025"
    }
  },
  {
    id: 2,
    title: "Vintage Gibson Les Paul Standard 1959",
    price: "$8,500",
    location: "Austin, TX",
    time: "4 hours ago",
    image: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Authentic vintage Gibson Les Paul in excellent condition. Original case and documentation included. This is a rare find for collectors and professional musicians. The guitar has been well-maintained with regular setups and proper storage. All original hardware and electronics are intact.",
    verified: false,
    category: "Musical Instruments",
    seller: {
      name: "VintageGuitarCollector",
      rating: 4.7,
      verified: false
    },
    specifications: {
      "Year": "1959",
      "Model": "Les Paul Standard",
      "Finish": "Sunburst",
      "Pickups": "Original PAF Humbuckers",
      "Condition": "Excellent",
      "Case": "Original Gibson Case Included"
    }
  },
  {
    id: 3,
    title: "Herman Miller Aeron Chair - Size B",
    price: "$450",
    location: "New York, NY",
    time: "6 hours ago",
    image: "https://images.pexels.com/photos/586996/pexels-photo-586996.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Ergonomic office chair in great condition. Perfect for home office or workspace. This chair has been used in a smoke-free office environment and shows minimal wear. All adjustments work perfectly, and the mesh is in excellent condition with no tears or stains.",
    verified: true,
    category: "Furniture",
    seller: {
      name: "OfficeUpgrade",
      rating: 4.8,
      verified: true
    },
    specifications: {
      "Size": "B (Medium)",
      "Color": "Graphite",
      "Condition": "Very Good",
      "Features": "Fully Adjustable",
      "Age": "2 years",
      "Original Price": "$1,395"
    }
  },
  {
    id: 4,
    title: "Canon EOS R5 Camera Body + 24-70mm Lens",
    price: "$3,200",
    location: "Miami, FL",
    time: "8 hours ago",
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Professional mirrorless camera with RF 24-70mm f/2.8L lens. Low shutter count, mint condition. This camera has been used primarily for studio work and has less than 5,000 actuations. Includes original boxes, manuals, battery, charger, and lens hood.",
    verified: true,
    category: "Photography",
    seller: {
      name: "ProPhotographer",
      rating: 5.0,
      verified: true
    },
    specifications: {
      "Model": "Canon EOS R5",
      "Lens": "RF 24-70mm f/2.8L IS USM",
      "Shutter Count": "4,832",
      "Condition": "Mint",
      "Includes": "Body, Lens, Battery, Charger, Boxes",
      "Warranty": "6 months remaining"
    }
  },
  {
    id: 5,
    title: "Peloton Bike+ with Accessories",
    price: "$1,800",
    location: "Seattle, WA",
    time: "12 hours ago",
    image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Complete Peloton setup with bike, shoes, weights, and heart rate monitor. Excellent condition. This bike has been well-maintained and regularly serviced. Perfect for home workouts. Includes premium accessories and will help with delivery setup.",
    verified: false,
    category: "Fitness",
    seller: {
      name: "FitnessEnthusiast",
      rating: 4.6,
      verified: false
    },
    specifications: {
      "Model": "Peloton Bike+",
      "Screen": "23.8\" HD Touchscreen",
      "Condition": "Excellent",
      "Includes": "Shoes (Size 9), Weights, Heart Rate Monitor",
      "Subscription": "Not Included",
      "Delivery": "Available for extra fee"
    }
  },
  {
    id: 6,
    title: "Mid-Century Modern Dining Set",
    price: "$1,200",
    location: "Dallas, TX",
    time: "1 day ago",
    image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Beautiful walnut dining table with 6 matching chairs. Authentic 1960s design in pristine condition. This set has been professionally restored and is ready for immediate use. The walnut finish is rich and lustrous, and all joints are solid and stable.",
    verified: true,
    category: "Furniture",
    seller: {
      name: "VintageModern",
      rating: 4.9,
      verified: true
    },
    specifications: {
      "Era": "1960s",
      "Material": "Solid Walnut",
      "Table Size": "72\" x 36\"",
      "Chairs": "6 matching chairs",
      "Condition": "Restored",
      "Style": "Mid-Century Modern"
    }
  }
];