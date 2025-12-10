import MainHeader from "../components/MainHeader/MainHeader"
import SecondHeader from "../components/Watchlist/SecondHeader";
import WatchlistSection from "../components/Watchlist/WatchlistSection";
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"

function Watchlist() {
    return (
        <>
            <MainHeader />
            <SecondHeader
                title={"Your Watchlist"}
                description={"Your Watchlist is the place to track the titles you want to watch. You can sort your Watchlist by the IMDb rating or popularity score and arrange your titles in the order you want to see them."}
            />
            <WatchlistSection />
            <SimpleFooter />
        </>
    )
}

export default Watchlist;