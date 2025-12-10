export default function SecondHeader({ title, description }) {
    return (
        <div className="bg-dark text-white py-5 px- border-bottom border-secondary">
            <div
                className="container d-flex justify-content-between align-items-center"
                style={{ maxWidth: "1200px" }}>

                <div>
                    <h1 className="fs-3 fw-bold m-0">{title}</h1>
                    <p className="text-secondary m-0">
                        {description}
                    </p>
                </div>

            </div>
        </div>
    );
}
