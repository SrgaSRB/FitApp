import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {

    const [usernameOrEmail, setUsernameOrEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/home";
        }
    }, []);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!usernameOrEmail || !password) {
            setError("Molimo vas popunite sva polja.");
            return;
        }

        try {
            const res = await api.post("/auth/login", {
                usernameOrEmail,
                password,
            });

            if (res.status === 200) {
                const accessToken = res.data.accessToken as string; 
                login(accessToken);
            } else {
                setError("Pogrešno korisničko ime ili lozinka.");
            }
        } catch (err) {
            console.error(err);
            setError("Greška prilikom prijave. Molimo pokušajte ponovo.");
        }
    };

    return (
        <section className="login-section">
            <div className="w-layout-blockcontainer container w-container">
                <div className="login-wrapper">
                    <div className="form-block-2 w-form">
                        <form id="email-form-4" name="email-form-4" data-name="Email Form 4" className="form-2" onSubmit={handleSubmit}>
                            <div className="text-block-13">Fitness App</div>

                            <input className="text-field-4 w-input" maxLength={256} placeholder="Email / korisničko ime" type="text" required
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                            />

                            <input className="text-field-4 w-input" maxLength={256} placeholder="Lozinka" type="password" required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input type="submit" data-wait="Please wait..." className="submit-button-2 w-button" value="Prijavi se" />

                            {error && <div className="error-text">{error}</div>}

                            <div className="div-block-5">
                                <div>Nemate nalog?</div>
                                <Link to="/register" className="link">Napravi nalog</Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default LoginPage;