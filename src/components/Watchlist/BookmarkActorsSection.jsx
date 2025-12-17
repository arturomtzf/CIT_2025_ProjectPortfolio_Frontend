import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarSection from "./SidebarSection";
import { FALLBACK_POSTER } from '../../utils/constants';
import { getProfilePicture } from '../../utils/picturesHelper';

export default function BookmarkActorsSection() {
    const API_URL = import.meta.env.VITE_API_URL;
    const TRASH_CAN = 'https://img.icons8.com/fluent-systems-regular/512/FA5252/trash.png'

    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    
    useEffect(() => {
        
        const fetchBookmarkActors = async () => {
            setLoading(true);
            setError("");
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

      const [profilePictures, setProfilePictures] = useState({});

     useEffect(() => {
        let mounted = true;

        const fetchAllPictures = async () => {
          if (!actors || actors.length === 0) return;
        
          const pics = {};
        
          await Promise.all(
            actors.map(async actor => {
              try {
                const pic = await getProfilePicture(actor.personid);
                pics[actor.personid] = pic
                  ? `https://image.tmdb.org/t/p/w300_and_h450_face${pic}`
                  : null;
              } catch {
                pics[actor.personid] = null;
              }
            })
          );
      
          if (mounted) setProfilePictures(pics);
        };
    
        fetchAllPictures();
    
        return () => { mounted = false; };
        }, [actors]);

    

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
            alert("Failed to delete an actor from the bookmarks")
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
                                const name = `${item.firstName || ''} ${item.lastname || ''}`.trim()
                                const photo = profilePictures[item.personid] || item.photo || FALLBACK_POSTER;
                                return (
                                    <div key={item.personid || ''}
                                    className="d-flex bg-white shadow-sm p-3 rounded-3 position-relative"
                                    style={{ gap: "1rem", display: "flex" }}>

                                    
                                        <img
                                          src={photo}
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
                                                        
                                          <h6 className="item-title">{name}</h6>
                                          

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