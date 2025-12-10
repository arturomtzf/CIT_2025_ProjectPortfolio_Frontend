import MainHeader from '../components/MainHeader/MainHeader';
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"
import TitlesList from "../components/Movies/TitlesList";   

function Titles() {
    return (
        <>
            <MainHeader />
            <TitlesList />
            <SimpleFooter />
        </>
    )
}

export default Titles;