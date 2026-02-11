import { useEffect } from 'react';
import Landing from './Landing';

export default function Index() {
  useEffect(() => {
    console.info('[Index] Home page mounted, rendering Landing component');
  }, []);

  return <Landing />;
}
