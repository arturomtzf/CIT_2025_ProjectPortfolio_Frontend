import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarSection from "./SidebarSection";
import { FALLBACK_POSTER } from '../../utils/constants';

export default function BookmarkActorsSection() {
    const API_URL = import.meta.env.VITE_API_URL;
    const TRASH_CAN = 'https://img.icons8.com/fluent-systems-regular/512/FA5252/trash.png'

    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookmarkActors = async () => {
            try {
                const token = localStorage.getItem("token")

                if(!token)
                {
                    setError("You must be logged in")
                    setLoading(false)
                    return
                }

                const res = await fetch(`${API_URL}/bookmarks/actors`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if(!res.ok) {
                    setError("Failed to load bookmarked actors")
                    setLoading(false)
                    return
                }
                const data = await res.json()
                console.log("Bookmarked actors: ", data)
                setActors(data)
                localStorage.setItem("actorCount", data.length)
            }
            catch (err) {
                setError("Network error, could not load actors")
            }
            finally {
                setLoading(false)
            }

        };
        fetchBookmarkActors();
    }, []);

    const handleRemove = async (personid) => {
        try {
            const token = localStorage.getItem("token")
            if(!token) {
                return alert("You need to be logged in")
            }
            const res = await fetch(`${API_URL}/bookmarks/actors/${personid}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            if(!res.ok) {
            alrert("Failed to delete an actor from the bookmarks")
            return
            }
            setActors(prev => prev.filter(item => item.personid !== personid))
        }

        catch(err) {
            console.log(err)
            alert("Could not remove actor")
        }

    }

    if (loading) return <p>Loading your actors...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;


    return (
        
            <div className="container my-4">
            
                <div className="row">
                    
                    <div className="col-12 col-lg-8">
                    
                    <p className="text">{actors.length} saved actors</p>

                        <div className="d-flex flex-column mt-4" style={{ gap: "1.5rem" }}>
                            {actors.map((item) => {
                                const name = `${item.firstname || ''} ${item.lastname || ''}`.trim()
                                const poster = item.photo || FALLBACK_POSTER

                                return (
                                    <div key={item.personid || ''}
                                    className="d-flex bg-white shadow-sm p-3 rounded-3 position-relative"
                                    style={{ gap: "1rem", display: "flex" }}>

                                    
                                        <img
                                          src={poster}
                                          className="item-img"
                                          alt={name}
                                          onError={(e) => (e.currentTarget.src = FALLBACK_POSTER)}
                                          style={{
                                            width: "100px",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "8px"
                                            }}
                                        />
                                        <div className="d-flex flex-column flex-grow-1">
                                            <Link to={`/actor/${item.personid}`} className="text-decoration-none">
                                                <h4 className="m-0 fw-bold" style={{color: '#000'}}
                                                onMouseEnter={e => e.currentTarget.style.color = "#575656ff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "#000000ff"}>{name}</h4>
                                            </Link>
                                            </div>
                                                        
                                        <div className="item-body">
                                          <h6 className="item-title">{name}</h6>
                                          
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <img 
                                                src={TRASH_CAN} 
                                                alt="Remove"
                                                style={{ width: "24px", height: "24px", cursor: "pointer" }}
                                                onClick={() => handleRemove(item.personid)}
                                            />
                                        </div>
                                    </div>
                                    
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                                <SidebarSection totalActors={actors.length}/>
                            </div>
                </div>
                 
                
            </div>
        
        
    )
}