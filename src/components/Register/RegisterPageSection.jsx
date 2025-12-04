import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";

export default function RegisterPageSection() {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 bg-white d-flex justify-content-center pt-5 pb-5 px-3">
            <div className="container" style={{ maxWidth: "960px" }}>
                <div className="row justify-content-center">

                    <div
                        className="col-12 col-md-6 d-flex flex-column align-items-start"
                        style={{ gap: "2rem", marginBottom: "3rem" }}
                    >
                        <h2
                            className="fs-4 fw-bold text-dark ps-3"
                            style={{ borderLeft: "4px solid #f5c518" }}
                        >
                            Create your account
                        </h2>

                        <RegisterForm />

                        <p className="mt-3">
                            Already have an account?{" "}
                            <span
                                role="button"
                                className="text-primary"
                                onClick={() => navigate("/login")}
                            >
                                Sign in
                            </span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
