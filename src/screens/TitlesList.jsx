import MainHeader from '../components/MainHeader/MainHeader';
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"
import PageHeader from '../components/MainHeader/PageHeader';
import TitlesList from "../components/Movies/TitlesList";  
import ToppicksSection from '../components/Movies/ToppicksSection'; 

function Titles() {
    return (
        <>
            <MainHeader />
            <PageHeader 
              title="Explore Movies & TV — Curated Selections" 
              subtitle="Browse — find your next watch."
            />
            <ToppicksSection />
            <TitlesList />
            <SimpleFooter />
        </>
    )
}

export default Titles;