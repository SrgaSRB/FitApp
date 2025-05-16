import React, { useEffect } from "react";
import Loader from "../Shared/Loader";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import TrainingHistoryView from "../Shared/TrainingHistoryView";

interface JwtPayload {
    unique_name: string;
}

interface UserInfoDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    gender: "Male" | "Female" | "";
    birthday: string;
    weight: number;
    height: number;
}

const UserPage = () => {

    const [userInfo, setUserInfo] = React.useState<UserInfoDto>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        gender: "",
        birthday: "",
        weight: 0,
        height: 0,
    });

    const { logout } = useAuth();

    const [initialUsername, setInitialUsername] = React.useState<string>("");
    const [initialEmail, setInitialEmail] = React.useState<string>("");
    const [usernameEror, setUsernameError] = React.useState<string | null>(null);
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isTrainingHistoryViewOpen, setIsTrainingHistoryViewOpen] = React.useState(false);

    useEffect(() => {
        fetchUserInfo();
    }, []);


    const fetchUserInfo = async () => {

        setIsLoading(true);

        try {
            const response = await api.get("/user/info");
            setUserInfo(response.data);
            setInitialUsername(response.data.username);
            setInitialEmail(response.data.email);
        } catch (error) {
            console.error("Error fetching user info:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const newUsername = e.target.value;
        setUserInfo(prev => ({
            ...prev!,
            username: newUsername
        }));

        if (newUsername === initialUsername) {
            setUsernameError("");
            return;
        }

        setUsernameError("");

        try {
            await api.get(`/user/check-username/${newUsername}`);
        } catch (error: any) {
            if (error.response?.status === 400) {
                setUsernameError("Korisničko ime je zauzeto.");
            }
            console.error("Error checking username availability:", error);
        }

    }

    const handleEmailCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const newEmail = e.target.value;
        setUserInfo(prev => ({
            ...prev!,
            email: newEmail
        }));

        if (newEmail === initialEmail) {
            setEmailError("");
            return;
        }

        setEmailError("");

        try {
            await api.get(`/user/check-email/${newEmail}`);
        } catch (error: any) {
            if (error.response?.status === 400) {
                setEmailError("Email je zauzet.");
            }
            console.error("Error checking username availability:", error);
        }

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.put("/user/update", userInfo);
            if (response.status === 204) {
                alert("Uspešno ste sačuvali izmene.");
                fetchUserInfo();
            } else {
                alert("Došlo je do greške prilikom čuvanja izmena.");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        logout();
        window.location.href = "/login";
    }


    if (isLoading) {
        return <Loader />;
    }

    return (

        <>
            {isTrainingHistoryViewOpen && (
                <TrainingHistoryView 
                    onClose={() => setIsTrainingHistoryViewOpen(false)}
                />
                )}

            <section className="user-profile-section">
                <div className="w-layout-blockcontainer container w-container">
                    <div className="user-profile-wrapper">
                        <div className="up-user-card-div">

                            <div className="up-user-card-image-div">
                                <img src={userInfo.gender === "Female" ? "assets/images/female-placeholder.webp" : "assets/images/male-placeholder.avif"} loading="lazy" alt="" className="image-2" />
                                <a className="button-5 trainings-history-button-for-mobile w-button" onClick={() => setIsTrainingHistoryViewOpen(true)}>Istorija treninga</a>
                            </div>

                            <div className="form-block w-form">
                                <form id="email-form-3" name="email-form-3" className="form" onSubmit={handleSubmit}>

                                    <div className="up-user-card-user-info-left-div">

                                        <div className="div-block-4">
                                            <div className="div-block-3">
                                                <div className="text-block-11">Ime</div>
                                                <input className="text-field-3 w-input" maxLength={256} placeholder="Unesi ime" type="text" required
                                                    value={userInfo.firstName}
                                                    onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="div-block-3">
                                                <div className="text-block-11">Prezime</div>
                                                <input className="text-field-3 w-input" maxLength={256} placeholder="Unesi prezime" type="text" required
                                                    value={userInfo.lastName}
                                                    onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="div-block-3">
                                            <div className="text-block-11">Korisničko ime</div>
                                            <input className="text-field-3 w-input" maxLength={256} placeholder="Unesi Korisničko ime" type="text" required
                                                value={userInfo.username}
                                                onChange={(e) => handleUsernameCheck(e)}
                                            />
                                            {usernameEror && <div className="error-text">{usernameEror}</div>}
                                        </div>

                                        <div className="div-block-3">
                                            <div className="text-block-11">E-mail adresa</div>
                                            <input className="text-field-3 w-input" maxLength={256} placeholder="Unesi e-mail adresu" type="email" required
                                                value={userInfo.email}
                                                onChange={(e) => handleEmailCheck(e)}
                                            />
                                            {emailError && <div className="error-text">{emailError}</div>}
                                        </div>

                                    </div>

                                    <div className="up-user-card-user-info-right-div">

                                        <div className="div-block-3">
                                            <div className="text-block-11">Pol</div>
                                            <select id="field-9" name="field-9" data-name="Field 9" className="text-field-3 w-select"
                                                value={userInfo.gender}
                                                onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value as "Male" | "Female" })}
                                            >
                                                <option value="">Izaberi pol</option>
                                                <option value="Male">Muški</option>
                                                <option value="Female">Ženski</option>
                                            </select>
                                        </div>

                                        <div className="div-block-3">
                                            <div className="text-block-11">Datum rodjenja</div>
                                            <input className="text-field-3 w-input" maxLength={256} placeholder="Example Text" type="date" required
                                                value={new Date(userInfo.birthday).toISOString().split("T")[0]}
                                                onChange={(e) => setUserInfo({ ...userInfo, birthday: e.target.value })}
                                            />
                                        </div>

                                        <div className="div-block-3">
                                            <div className="text-block-11">Kilaza</div>
                                            <input className="text-field-3 w-input" maxLength={256} placeholder="Unesi kilazu u kg" type="number" required
                                                value={userInfo.weight}
                                                onChange={(e) => setUserInfo({ ...userInfo, weight: parseFloat(e.target.value) })}
                                            />
                                        </div>

                                        <div className="div-block-3">
                                            <div className="text-block-11">Visina</div>
                                            <input className="text-field-3 w-input" maxLength={256} placeholder="Unesi visinu u cm" type="number" required
                                                value={userInfo.height}
                                                onChange={(e) => setUserInfo({ ...userInfo, height: parseFloat(e.target.value) })}
                                            />
                                        </div>

                                    </div>

                                    <input type="submit" className="button btn-3 w-button" value="Sačuvaj izmene" />

                                </form>

                                <a className="button-3 w-button" onClick={handleLogout}>Odjavi se</a>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default UserPage;