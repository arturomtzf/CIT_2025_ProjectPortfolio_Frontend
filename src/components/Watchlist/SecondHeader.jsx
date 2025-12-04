export default function SecondHeader() {
    return (
        <div className="bg-dark text-white py-5 px- border-bottom border-secondary">
            <div 
                className="container d-flex justify-content-between align-items-center"
                style={{ maxWidth: "1200px" }}
            >
                
                <div>
                    <h1 className="fs-3 fw-bold m-0">Your Watchlist</h1>
                    <p className="text-secondary m-0">
                        Your Watchlist is the place to track the titles you want to watch. You can sort your Watchlist by the IMDb rating or popularity score and arrange your titles in the order you want to see them.
                    </p>
                </div>

                <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
                    
            

                    <button className="btn btn-warning d-flex justify-content-center align-items-center py-1 fw-bold rounded-5 shadow-sm transition-opacity"
                    style={{width: "200px"}}>
                    
                        Create a new list
                    </button>
                </div>
            </div>
        </div>
    );
}
