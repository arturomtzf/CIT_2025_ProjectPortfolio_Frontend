import MainHeader from "../components/MainHeader/MainHeader"
import SecondHeader from "../components/Watchlist/SecondHeader";
import RatingSection from "../components/Activity/RatingSection";
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"

function YourRatings() {
    return (
        <>
            <MainHeader />
            <SecondHeader
                title={"Your Ratings"}
                description={"Everything you've rated.."}
            />
            <RatingSection />
            <SimpleFooter />
        </>
    )
}

export default YourRatings;