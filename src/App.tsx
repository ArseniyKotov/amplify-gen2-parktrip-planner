import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';

// Components
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import ParksPage from './pages/ParksPage';
import ParkDetailPage from './pages/ParkDetailPage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';

// Mock data
import { mockParks } from './data/mockParks';

const client = generateClient<Schema>();

function App() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [seedingError, setSeedingError] = useState<Error | null>(null);

  useEffect(() => {
    const seedDatabase = async () => {
      // Check if we've already seeded the database in this session
      const hasSeeded = sessionStorage.getItem('dbSeeded');
      if (hasSeeded === 'true') {
        console.log('Database already seeded in this session');
        return;
      }

      setIsSeeding(true);
      setSeedingError(null);

      try {
        // First check if we already have data to avoid duplicates
        const { data: existingParks, errors: listErrors } = await client.models.Park.list({
          limit: 1
        });

        if (listErrors) {
          throw new Error(`Error checking existing parks: ${listErrors[0].message}`);
        }

        // If we already have data, don't seed
        if (existingParks.length > 0) {
          console.log('Database already has parks, skipping seed');
          sessionStorage.setItem('dbSeeded', 'true');
          setIsSeeding(false);
          setSeedingComplete(true);
          return;
        }

        console.log('Seeding database with mock parks...');

        // Create each park from the mock data
        for (const park of mockParks) {
          const { errors: createErrors } = await client.models.Park.create({
            name: park.name,
            location: park.location,
            description: park.description,
            activities: park.activities,
            imageUrl: park.imageUrl
          });

          if (createErrors) {
            throw new Error(`Error creating park: ${createErrors[0].message}`);
          }
        }

        console.log(`Successfully seeded database with ${mockParks.length} parks`);
        sessionStorage.setItem('dbSeeded', 'true');
        setSeedingComplete(true);
      } catch (error) {
        console.error('Error seeding database:', error);
        setSeedingError(error instanceof Error ? error : new Error('Unknown error during seeding'));
      } finally {
        setIsSeeding(false);
      }
    };

    seedDatabase();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="parks" element={<ParksPage />} />
              <Route path="parks/:id" element={<ParkDetailPage />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="trips/:id" element={<TripDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </Authenticator>
  );
}

export default App;
