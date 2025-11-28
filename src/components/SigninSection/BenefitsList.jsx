const benefits = [
    { title: "Personalized recommendations", description: "Titles tailored to your taste." },
    { title: "Your Watchlist", description: "Track your future views and get reminders." },
    { title: "Your ratings", description: "Rate and remember what you watch." },
    // Maybe add some more benefits?
];

const BenefitList = () => (
    <div className="d-flex flex-column align-items-start" style={{ gap: '1.5rem' }}>
        <h2 className="fs-4 fw-bold text-dark">
            It's so much better when you sign in
        </h2>

        <div className="d-flex flex-column" style={{ gap: '1rem' }}>
            {benefits.map((item, index) => (
                <div key={index}>
                    <h3 className="fs-6 fw-semibold text-dark">
                        {item.title}
                    </h3>
                    <p className="small text-secondary">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

export default BenefitList;