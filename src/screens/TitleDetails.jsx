import MainHeader from '../components/MainHeader/MainHeader';
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"
import TitleDetailsComponent from "../components/Movies/Details";
import PageHeader from '../components/MainHeader/PageHeader';

function TitleDetails() {
    return (
        <>
            <MainHeader />
            <PageHeader 
              title="Movie Details & Information" 
              subtitle="Browse — find your next watch."
            />
            <TitleDetailsComponent />
            <SimpleFooter />
        </>
    )
}

export default TitleDetails;