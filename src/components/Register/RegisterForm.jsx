import { useState } from "react";
import { data, useNavigate } from "react-router-dom";

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

    
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            username: formData.username,
            password: formData.password
        })
    });
        
        
    if(res.ok) {
        alert("Registered successfully!")

    }
    else {
        const msg = await res.text();
        setErrorMessage(msg || "Something went wrong");
    }
    } catch (err) {
            setErrorMessage(err.message);
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
        
        {errorMessage && <p className="text-danger small mb-3">{errorMessage}</p>}
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
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => 
                    setFormData({...formData, lastName: e.target.value})
                }
            />
         </div>   
          
         <div className="mb-3">
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => 
                    setFormData({...formData, email: e.target.value})
                }
            />
         </div>
          
         <div className="mb-3">
             <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => 
                    setFormData({...formData, username: e.target.value})
                }
            />
         </div>
         
         <div className="mb-3">
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => 
                    setFormData({...formData, password: e.target.value})
                }
            />
         </div>
           

            <button type="submit" disabled={isRegistering}>
                {isRegistering ? "Creating..." : "Create Account"}
            </button>
        </form>
    )
}

