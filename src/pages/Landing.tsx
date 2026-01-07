import { apiToken } from '../api/ApiToken';
import HeroAdmin from '../components/landing/HeroAdmin';
import HeroClient from '../components/landing/HeroClient';

export default function LandingPage() {
  const isAuthenticated = apiToken.isAuthenticated();
  const isAdmin = apiToken.isAdmin();
  const userRole = isAdmin ? 'admin' : 'client';


    if(isAuthenticated) {
        if(userRole === 'admin') {
            return(<HeroAdmin />);
        }else{
            return(<HeroClient />);
        }
    }
}
