import MainHeader from "../components/MainHeader/MainHeader"
import SimpleFooter from "../components/SimpleFooter/SimpleFooter"
import BookmarkActorsSection from "../components/Watchlist/BookmarkActorsSection";
import SecondBookmarkHeader from "../components/Watchlist/SecondBookmarkHeader";
import SidebarSection from "../components/Watchlist/SidebarSection";

function BookmarkedActors() {
    return (
        <>
            <MainHeader />
            <SecondBookmarkHeader />
            <BookmarkActorsSection />
            <SimpleFooter />
        </>
    )
}

export default BookmarkedActors;