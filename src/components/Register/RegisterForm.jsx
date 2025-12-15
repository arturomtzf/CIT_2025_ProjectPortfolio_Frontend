import { useState } from "react";
import Alert from "react-bootstrap/Alert";

export default function RegisterForm() {

    const API_URL = import.meta.env.VITE_API_URL
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: ""
    })

    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false)

    
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsRegistering(true);
        
        try {
            const res = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
    });
        
        
    if(res.ok) {
        setShowSuccess(true)
        setErrorMessage("")
        setFormData({
            firstName: "",
            lastName: "",
            email:"",
            username:"",
            password:""
        })
        

    }
    else {
        const msg = await res.text();
        setErrorMessage(msg || "Something went wrong");
        setShowSuccess(false)
    }
    } catch (err) {
            setErrorMessage(err.message);
            setShowSuccess(false);
        } finally {
            setIsRegistering(false);
        }
    }

    

    return (
        <form 
        className="w-100" 
        style={{maxWidth:"380px"}} 
        onSubmit={handleRegister}
        >
        {showSuccess && (<Alert variant= "success" onClose={() => setShowSuccess(false)} dismissible>
            <Alert.Heading>Registered successfully!</Alert.Heading>
            <p>Your account has been created</p>
        </Alert>)}
        {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                    {errorMessage}
                </Alert>
            )}

        <div className="mb-3">
            <input
                type="text"
                required
                className="form-control rounded-3 shadow-sm py-3"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => 
                    setFormData({...formData, firstName: e.target.value})
                }
                disabled={isRegistering}
            />
        </div>
         <div className="mb-3">
            <input
                type="text"
                required
                className="form-control rounded-3 shadow-sm py-3"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => 
                    setFormData({...formData, lastName: e.target.value})
                }
                disabled = {isRegistering}
            />
         </div>   
          
         <div className="mb-3">
            <input
                type="email"
                required
                className="form-control rounded-3 shadow-sm py-3"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => 
                    setFormData({...formData, email: e.target.value})
                }
                disabled = {isRegistering}
            />
         </div>
          
         <div className="mb-3">
             <input
                type="text"
                required
                className="form-control rounded-3 shadow-sm py-3"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => 
                    setFormData({...formData, username: e.target.value})
                }
                disabled = {isRegistering}
            />
         </div>
         
         <div className="mb-3">
            <input
                type="password"
                required
                className="form-control rounded-3 shadow-sm py-3"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => 
                    setFormData({...formData, password: e.target.value})
                }
                disabled = {isRegistering}
            />
         </div>
           

            <button type="submit" className="btn btn-warning w-100 d-flex justify-content-center align-items-center py-3 fw-bold rounded-3 shadow-sm transition-opacity" disabled={isRegistering}>
                {isRegistering ? "Creating..." : "Create Account"}
            </button>
        </form>
    )
}

