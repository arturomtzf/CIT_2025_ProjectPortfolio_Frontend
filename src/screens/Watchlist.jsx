import MainHeader from "../components/MainHeader/MainHeader"
import SecondHeader from "../components/Watchlist/SecondHeader";
import WatchlistSection from "../components/Watchlist/WatchlistSection";
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"

function Watchlist() {
    return (
        <>
            <MainHeader />
            <SecondHeader />
            <WatchlistSection />
            <SimpleFooter />
        </>
    )
}

export default Watchlist;