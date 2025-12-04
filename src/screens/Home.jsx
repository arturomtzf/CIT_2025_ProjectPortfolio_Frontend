import MainHeader from "../components/MainHeader/MainHeader"
import MainSlider from "../components/MainSlider/MainSlider"
import BornToday from "../components/BornToday/BornToday"
import TopPicks from "../components/TopPicks/TopPicks"
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"

function Home() {
    return (
        <>
            <MainHeader />
            <MainSlider />
            <TopPicks />
            <BornToday />
            <SimpleFooter />
        </>
    )
}

export default Home