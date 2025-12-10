import MainHeader from '../components/MainHeader/MainHeader';
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"
import ActorDetailsComponent from "../components/Actors/ActorDetails";

function ActorDetails() {
    return (
        <>
            <MainHeader />
            <ActorDetailsComponent />
            <SimpleFooter />
        </>
    )
}

export default ActorDetails;