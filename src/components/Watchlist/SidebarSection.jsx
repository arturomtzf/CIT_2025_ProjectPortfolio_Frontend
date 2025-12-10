
export default function SidebarSection ({totalTitles}) {

    return (
        <aside className="d-none d-lg-block" style={{witdh: "280px"}}>
            <h4 className="fw-bold mb-3">More to explore</h4>
            <div className="d-flex flex-column" style={{ gap: "1rem"}}>

                <div className="p-3 bg-white shadow-sm rounded-3" style={{cursor:"pointer"}}>
                    <h6 className="text-muted fw-bold mb-3">Your ratings</h6>
                    <p className="text-muted small m-0">Titles you have rated</p>
                </div>

                <div className="p-3 bg-white shadow-sm rounded-3" style={{cursor: "pointer"}}>
                    <h6 className="text-muted fw-bold mb-3">Your watchlist</h6>
                    <p className="text-muted small m-0"><strong>{totalTitles} </strong>titles</p>
                </div>

                <div className="p-3 bg-white shadow-sm rounded-3" style={{ cursor: "pointer" }}>
                    <h6 className="text-muted fw-bold mb-3">Watch history</h6>
                    <p className="text-muted small m-0">Titles you've viewed recently.</p>
                </div>
            </div>
        </aside>
    )
}

