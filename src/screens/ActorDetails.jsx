import MainHeader from '../components/MainHeader/MainHeader';
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"
import ActorDetailsComponent from "../components/Actors/ActorDetails";
import PageHeader from '../components/MainHeader/PageHeader';

function ActorDetails() {
    return (
        <>
            <MainHeader />
            <PageHeader 
              title="Actor Details & Information" 
              subtitle="Discover the stars behind your favorite movies and shows."
            />
            <ActorDetailsComponent />
            <SimpleFooter />
        </>
    )
}

export default ActorDetails;