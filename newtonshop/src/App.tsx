import React, { useEffect, useState } from 'react';
import { getCategoriesInfo, getAirpods } from './api';
import { CategoryInfo, AirpodsDto } from './types';

const App: React.FC = () => {
  const [categoriesInfo, setCategoriesInfo] = useState<CategoryInfo[]>([]);
  const [airpods, setAirpods] = useState<AirpodsDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesInfoData = await getCategoriesInfo();
        const airpodsData = await getAirpods();

        setCategoriesInfo(categoriesInfoData);
        setAirpods(airpodsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
      <div>
        <h1>Categories Info</h1>
        <pre>{JSON.stringify(categoriesInfo, null, 2)}</pre>

        <h1>Airpods</h1>
        <pre>{JSON.stringify(airpods, null, 2)}</pre>
      </div>
  );
};

export default App;
