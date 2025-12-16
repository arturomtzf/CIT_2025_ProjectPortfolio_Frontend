import { useEffect, useState } from "react";
import SidebarSection from "../Watchlist/SidebarSection";
import { addSecondPoster } from "../../utils/picturesHelper";
import ActivityItem from "./ActivityItem";


export default function RatingSection() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("You must be logged in to view your activity.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${API_URL}/movies/ratings`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    setError("Failed to load activity.");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                const newData = await addSecondPoster(data);
                console.log(newData);

                setActivity(newData);
            } catch (err) {
                setError("Network error. Could not load activity.");
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, []);

    if (loading) return <p>Loading your ratings...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-12 col-lg-8">
                    <p className="text">{activity.length} titles</p>

                    <div className="d-flex flex-column mt-4" style={{ gap: "1.5rem" }}>
                        {activity.map(item => <ActivityItem item={item} />)}
                    </div>
                </div>

                <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                    <SidebarSection totalTitles={activity.length} />
                </div>
            </div>

        </div>
    );
}
