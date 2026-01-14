import { apiToken } from '../api/ApiToken';
import HeroAdmin from '../components/landing/HeroAdmin';
import HeroClient from '../components/landing/HeroClient';
import PageBg from '../components/layout/PageBg';

export default function LandingPage() {
  const isAuthenticated = apiToken.isAuthenticated();
  const isAdmin = apiToken.isAdmin();
  const userRole = isAdmin ? 'admin' : 'client';


    if(isAuthenticated) {
        if(userRole === 'admin') {
            
            return(
            <PageBg>
                <HeroAdmin />
            </PageBg>);
        }else{
            return(
            
                <HeroClient />
            );
        }
    }
}
