import React from "react";
import api from "../api";
import Loader from "../components/Shared/Loader";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [gender, setGender] = React.useState("");
    const [birthDate, setBirthDate] = React.useState("");
    const [weight, setWeight] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");


    const [error, setError] = React.useState("");
    const [usernameError, setUsernameError] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [passwordCheckError, setpasswordCheckError] = React.useState("");
    const [weightError, setWeightError] = React.useState("");
    const [heightError, setHeightError] = React.useState("");

    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (usernameError || emailError || passwordCheckError) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(`auth/register`, {
                firstName,
                lastName,
                username,
                email,
                gender,                          
                birthday : birthDate, 
                weight,
                height, 
                password
            });


            if (response.status === 200) {
                alert("Uspešno ste se registrovali!");
                window.location.href = "/login";
            }

        } catch (error) {
            setError("Grreška prilikom registracije. Pokušajte ponovo.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckUsername = async (username: string) => {
        try {
            const response = await api.get(`auth/check-username/${username}`);
            setUsernameError("");
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setUsernameError("Korisničko ime je zauzeto!");
            } else {
                setUsernameError("");
                setError("Greška prilikom provere korisničkog imena. Pokušajte ponovo.");
            }
        }
    };


    const handleCheckEmail = async (email: string) => {
        try {
            const response = await api.get(`auth/check-email/${email}`);
            setEmailError("");
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setEmailError("E-mail adresa je zauzeta!");
            } else {
                setEmailError("");
                setError("Greška prilikom provere e-mail adrese. Pokušajte ponovo.");
            }
        }
    };

    const handleCheckPassword = (confirmPassword: string) => {
        if (password !== confirmPassword) {
            setpasswordCheckError("Lozinke se ne poklapaju!");
        } else {
            setpasswordCheckError("");
        }
    };

    const handleCheckWeight = (weight: number) => {
        if (weight < 30 || weight > 300) {
            setWeightError("Kilaža mora biti između 30 i 300 kg!");
        } else {
            setWeightError("");
        }
    };

    const handleCheckHeight = (height: number) => {
        if (height < 100 || height > 250) {
            setHeightError("Visina mora biti između 100 i 250 cm!");
        } else {
            setHeightError("");
        }
    };

    const handlePassword = (password: string) => {
        if (password.length < 3) {
            setPasswordError("Lozinka mora imati najmanje 3 karaktera!");
        }
        else {
            setPasswordError("");
        }
    }


    if (loading) {
        return <Loader />
    }


    return (
        <section className="register-section">
            <div className="w-layout-blockcontainer container w-container">
                <div className="register-wrapper">
                    <div className="form-block-3 w-form">
                        <form className="form-3" onSubmit={handleSubmit}>

                            <label >Ime</label>
                            <input className="text-field-7 w-input" maxLength={256} placeholder="Unesi ime" type="text" required name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />

                            <label >Prezime</label>
                            <input className="text-field-7 w-input" maxLength={256} placeholder="Unesi prezime" type="text" required name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />

                            <label >Korisničko ime</label>
                            <input className="text-field-6 text-field-7 w-input" maxLength={256} placeholder="Unesi Korisničko ime" type="text" required name="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    handleCheckUsername(e.target.value);
                                }}
                            />
                            {usernameError && <div className="error-text">Korisničko ime je zauzeto!</div>}

                            <label className="field-label-4" >E-mail adresa</label>
                            <input className="text-field-5 text-field-7 w-input" maxLength={256} placeholder="Unesi e-mail adresu" type="email" required name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleCheckEmail(e.target.value);
                                }}
                            />
                            {emailError && <div className="error-text">E-mail adresa je zauzata!</div>}

                            <label className="field-label-3">Pol</label>
                            <select className="text-field-7 w-select" required
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Izaberi pol</option>
                                <option value="Male">Muški</option>
                                <option value="Female">Ženski</option>
                            </select>

                            <label >Datum rođenja</label>
                            <input className="text-field-7 w-input" maxLength={256} placeholder="Example Text" type="date" required
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />

                            <label >Kilaža</label>
                            <input className="text-field-7 w-input" maxLength={256} placeholder="Unesi kilažu u kg" type="number" required
                                value={weight}
                                onChange={(e) => {
                                    setWeight(parseFloat(e.target.value))
                                    handleCheckWeight(parseFloat(e.target.value));
                                }}
                            />
                            {weightError && <div className="error-text">Kilaža mora biti između 30 i 300 kg!</div>}


                            <label >Visina</label>
                            <input className="text-field-7 w-input" maxLength={256} placeholder="Unesi visinu u cm" type="number" required
                                value={height}
                                onChange={(e) => {
                                    setHeight(parseInt(e.target.value))
                                    handleCheckHeight(parseInt(e.target.value));
                                }}
                            />
                            {heightError && <div className="error-text">Visina mora biti između 100 i 250 cm!</div>}

                            <label >Lozinka</label>
                            <input className="text-field-7 w-input" maxLength={256} placeholder="Unesi lozinku" type="password" required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    handlePassword(e.target.value);
                                }}
                            />
                            {passwordError && <div className="error-text">Lozinka mora imati najmanje 3 karaktera!</div>}

                            <label >Ponovi lozinku</label>
                            <input className="text-field-7 w-input" maxLength={256} placeholder="Unesi ponovo lozinku" type="password" required
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    handleCheckPassword(e.target.value);
                                }}
                            />
                            {passwordCheckError && <div className="error-text">Lozinke se ne poklapaju!</div>}


                            <input type="submit" data-wait="Please wait..." className="submit-button-3 w-button" value="Napravi nalog" />

                            <div className="div-block-6">
                                <div>Već imaš nalog?</div>
                                <Link to="/login" className="link-2">Prijavi se</Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default RegisterPage;