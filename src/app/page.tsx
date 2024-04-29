import React from 'react';
import Map from './components/Map';
import { FaBars } from 'react-icons/fa';



interface Stop {
  lat: number;
  lng: number;
  name: string;
}

const Page: React.FC = () => {
  const stops: Stop[] = [
    { lat: -1.939826787816454, lng: 30.0445426438232, name: 'Nyabugogo' },
    { lat: -1.9355377074007851, lng: 30.060163829002217, name: 'Stop A' },
    { lat: -1.9358808342336546, lng: 30.08024820994666, name: 'Stop B' },
    { lat: -1.9489196023037583, lng: 30.092607828989397, name: 'Stop C' },
    { lat: -1.9592132952818164, lng: 30.106684061788073, name: 'Stop D' },
    { lat: -1.9487480402200394, lng: 30.126596781356923, name: 'Stop E' },
    // Add other stops
    { lat: -1.9365670876910166, lng: 30.13020167024439, name: 'Kimironko' },
  ];

  return (
    <div className="bg-blue-500 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center py-4 px-6">
      <div className="menu-icon">
        <FaBars size="24" /> 
      </div>
        <img src="#" alt="Startup" className=" w-12 h-8" />
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <Map stops={stops} />
      </div>

    
    </div>
  );
};

export default Page;
