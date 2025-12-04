import { useState, useEffect } from "react";
import BornTodayItem from "./BornTodayItem";

const API_URL = import.meta.env.VITE_API_URL;
const BORN_TODAY_LIST = [
    {
        "personId": "nm0000225",
        "firstname": "Christian",
        "lastname": "Slater",
        "birthdate": "1969-12-03",
        "yearsOld": 56
    },
    {
        "personId": "nm0000830",
        "firstname": "Oksana",
        "lastname": "Baiul",
        "birthdate": "1977-12-03",
        "yearsOld": 48
    },
    {
        "personId": "nm0000880",
        "firstname": "Meredith",
        "lastname": "Baxter",
        "birthdate": "1947-12-03",
        "yearsOld": 78
    },
];

const getTodayString = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const BornToday = () => {
    const [bornToday, setBornToday] = useState(BORN_TODAY_LIST);

    useEffect(() => {
        const getPeopleBornToday = async () => {
            if (!API_URL) {
                console.warn("API_URL not defined. Using mock data.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/actors/bornToday?page=1&pageSize=100`);
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();

                // Only update if we actually got an array
                if (Array.isArray(data) && data.length > 0) {
                    setBornToday(data);
                }
            } catch (error) {
                console.error("Error fetching people born today, using fallback:", error);
            } finally {

            }
        }
        getPeopleBornToday();
    }, []);

    return (
        <div className="py-5" style={{ backgroundColor: '#000000' }}>
            <div className="container">

                <div className="mb-4">
                    <h3 className="text-white fw-bold m-0 mb-1" style={{ borderLeft: '4px solid #f5c518', paddingLeft: '12px' }}>
                        Born today
                    </h3>
                    <p className="text-secondary ms-3 mb-0">
                        People born on {getTodayString()}
                    </p>
                </div>

                <div
                    className="d-flex overflow-auto pb-3 align-items-start"
                    style={{
                        gap: '2rem',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#333 #000'
                    }}
                >
                    {bornToday.map((person) => (
                        <BornTodayItem key={person.personId} person={person} />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BornToday;