import { Link } from "react-router-dom";

export default function SidebarSection () {
    const totalTitles = Number(localStorage.getItem("titleCount")) || 0;
    const totalActors = Number(localStorage.getItem("actorCount")) || 0;
    
    return (
        <aside className="d-none d-lg-block" style={{witdh: "280px"}}>
            <h4 className="fw-bold mb-3">More to explore</h4>
            <div className="d-flex flex-column" style={{ gap: "1rem"}}>

                <div className="p-3 bg-white shadow-sm rounded-3" style={{cursor:"pointer"}}>
                    <h6 className="text-muted fw-bold mb-3">Your ratings</h6>
                    <p className="text-muted small m-0">Titles you have rated</p>
                </div>

                <div className="p-3 bg-white shadow-sm rounded-3" style={{cursor: "pointer"}}>
                    <Link to={`/watchlist`} className="text-decoration-none">
                         <h6 className=" fw-bold mb-3 " style={{color: '#575656ff'}} 
                        onMouseEnter={e => e.currentTarget.style.color = "#868484ff"}
                        onMouseLeave={e => e.currentTarget.style.color = "#575656ff"}>Your Watchlist</h6>
                        
                    </Link>
                   <p className="text-muted small m-0"><strong>{totalTitles} </strong>titles</p>
                </div>
                
                <div className="p-3 bg-white shadow-sm rounded-3" style={{cursor: "pointer"}}>
                   <Link to={`/bookmarked-actors`} className="text-decoration-none">
                        <h6 className=" fw-bold mb-3 " style={{color: '#575656ff'}} 
                        onMouseEnter={e => e.currentTarget.style.color = "#868484ff"}
                        onMouseLeave={e => e.currentTarget.style.color = "#575656ff"}>Your Actors</h6>
                   </Link> 
                    <p className="text-muted small m-0"><strong>{totalActors} </strong>actors</p>
                </div>
                
                
                <div className="p-3 bg-white shadow-sm rounded-3" style={{ cursor: "pointer" }}>
                    <h6 className="text-muted fw-bold mb-3">Watch history</h6>
                    <p className="text-muted small m-0">Titles you've viewed recently.</p>
                </div>

                
            </div>
        </aside>
    )
}

