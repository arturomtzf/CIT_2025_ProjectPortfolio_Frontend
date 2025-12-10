import MainHeader from "../components/MainHeader/MainHeader"
import SecondHeader from "../components/Watchlist/SecondHeader";
import ActivitySection from "../components/Activity/ActivitySection";
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"

function YourActivity() {
    return (
        <>
            <MainHeader />
            <SecondHeader
                title={"Your Activity"}
                description={"Everything you've checked into.."}
            />
            <ActivitySection />
            <SimpleFooter />
        </>
    )
}

export default YourActivity;