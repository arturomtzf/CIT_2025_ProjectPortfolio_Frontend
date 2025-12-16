import MainHeader from '../components/MainHeader/MainHeader';
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"
import ActorsList from "../components/Actors/ActorsList";   
import PageHeader from '../components/MainHeader/PageHeader';

function Actors() {
    return (
        <>
            <MainHeader />
            <PageHeader 
                title="Actors & Actresses — Explore Talent" 
              subtitle="Discover the stars behind your favorite movies and shows."
            />
            <ActorsList />
            <SimpleFooter />
        </>
    )
}

export default Actors;