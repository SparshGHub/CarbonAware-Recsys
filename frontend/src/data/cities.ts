// City and area configuration for the RecSys Food Recommender
// All data is based on popular commercial areas in each city

export const CITIES_DATA = {
  Mumbai: {
    name: "Mumbai",
    areas: [
      "Bandra",
      "Worli",
      "Andheri",
      "Thane",
      "Borivali",
      "Powai",
      "Lower Parel",
      "Colaba"
    ]
  },
  Delhi: {
    name: "Delhi",
    areas: [
      "Connaught Place",
      "Hauz Khas",
      "Karol Bagh",
      "Saket",
      "Rajouri Garden",
      "Sector 7 Dwarka",
      "East Delhi",
      "South Extension"
    ]
  },
  Bangalore: {
    name: "Bangalore",
    areas: [
      "Koramangala",
      "Indiranagar",
      "Whitefield",
      "JP Nagar",
      "Marathahalli",
      "UB City",
      "MG Road",
      "Jayanagar"
    ]
  },
  Hyderabad: {
    name: "Hyderabad",
    areas: [
      "Jubilee Hills",
      "Banjara Hills",
      "Hitech City",
      "HITEC City",
      "Madhapur",
      "Gachibowli",
      "Kondapur",
      "Kukatpally"
    ]
  }
};

export type CityName = keyof typeof CITIES_DATA;
export type CityData = typeof CITIES_DATA[CityName];
