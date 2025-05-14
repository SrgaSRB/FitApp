import React, { useEffect } from "react";
import CountUp from 'react-countup';
import AOS from 'aos';
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import Loader from "../Shared/Loader";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import TodayTrainingsView from "./TodayTrainingsView";
import LastTrainingsHistoryView from "./LastTrainingsHistoryView";

type JwtPayload = {
    sub: string;
    unique_name: string;
};

interface WorkoutSummaryDto {
    totalTrainings: number;
    totalBurnedCalories: number;
    totalTrainingTimeMinutes: number;
    averageTrainingIntensity: number;
    averageTrainingFatigue: number;
}

interface WorkoutDto {
    id: string;
    type: string;
    intensity: number; // (1 - 10)
    fatigue: number; // (1 - 10)
    durationMinutes: number;
    caloriesBurned: number;
    startTime: string; // ISO 8601 string format for DateTimeOffset
    note?: string | null;
}

const HomePage = () => {

    const [workoutSummary, setWorkoutSummary] = React.useState<WorkoutSummaryDto | null>(null);
    const [userInfo, setUserInfo] = React.useState<JwtPayload | null>(null);

    const [workoutLast3, setWorkoutLast3] = React.useState<WorkoutDto[]>([]);
    const [todayWorkouts, setTodayWorkouts] = React.useState<WorkoutDto[]>([]);

    const [isOpenTrainingHistory, setIsOpenTrainingHistory] = React.useState(false);
    const [isOpenTodayWorkouts, setIsOpenTodayWorkouts] = React.useState(false);

    const [loading, setLoading] = React.useState(true);


    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return;
        }

        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserInfo(decodedToken);

        handleWorkoutSummary();
        fetchWorkoutHistory();
        fetchTodayWorkouts();
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1200,
            once: true,
            offset: 0 // Animacija kreće čim element samo "postoji"
        });
    }, []);

    const fetchTodayWorkouts = async () => {
        setLoading(true);
        try {
            const response = await api.get("/workout/today");

            if (response.status === 200) {
                setTodayWorkouts(response.data);
            } else {
                console.error("Failed to fetch today's workouts");
            }

        } catch (error) {
            console.error("Error fetching today's workouts:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkoutHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get("/workout/last-3");

            if (response.status === 200) {
                setWorkoutLast3(response.data);
            } else {
                console.error("Failed to fetch workout history");
            }

        } catch (error) {
            console.error("Error fetching workout history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWorkoutSummary = async () => {

        setLoading(true);

        try {
            const response = await api.get("/workout/summary");

            if (response.status === 200) {
                setWorkoutSummary(response.data);
            } else {
                console.error("Failed to fetch workout summary");
            }

        } catch (error) {
            console.error("Error fetching workout summary:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />
    }


    return (

        <>

            {isOpenTrainingHistory && (
                <LastTrainingsHistoryView
                    trainingHistory={workoutLast3}
                    onClose={() => setIsOpenTrainingHistory(false)}
                />
            )}

            {isOpenTodayWorkouts && (
                <TodayTrainingsView
                    todayTrainings={todayWorkouts}
                    onClose={() => setIsOpenTodayWorkouts(false)}
                />
            )}


            <section className="home-section">
                <div className="w-layout-blockcontainer container w-container">
                    <div className="home-wrapper">
                        <div className="home-left-div">
                            <h1 className="heading" data-aos="slide-right">
                                Dobrodošao nazad,<br />
                                <span className="text-span-2">{userInfo?.unique_name}
                                </span>!
                            </h1>
                            <div className="div-block-2" data-aos="slide-right">
                                <Link to="/new-workout" className="button btn-2 w-button">Dodaj novi trening</Link>
                                <Link to="/progrss" className="button btn-1 w-button">Vidi napredak</Link>
                            </div>
                            <div data-aos="slide-right" className="div-block-2 mobile-home-buttons">
                                <a className="button btn-2 w-button" onClick={() => setIsOpenTodayWorkouts(true)} >Vidi današnje treninge</a>
                                <a className="button btn-1 w-button" onClick={() => setIsOpenTrainingHistory(true)}>Vidi zadnja 3 treninga</a>
                            </div>
                            <div className="home-stats-list-div" data-aos="slide-up">
                                <div className="home-stats-div">
                                    <div className="text-block-8">Ukupno odrađenih treninga<br /></div>
                                    <div className="text-block-9"><CountUp end={workoutSummary?.totalTrainings || 0} duration={2} delay={0.3} /></div>
                                </div>
                                <div className="home-stats-div">
                                    <div className="text-block-8">Ukupno potrošenih kalorija</div>
                                    <div className="text-block-9"><CountUp end={workoutSummary?.totalBurnedCalories || 0} duration={4} delay={0.3} />kcal</div>
                                </div>
                                <div className="home-stats-div">
                                    <div className="text-block-8">Ukupno vreme treniranja</div>
                                    <div className="text-block-9"><CountUp end={workoutSummary?.totalTrainingTimeMinutes || 0} duration={3} delay={0.3} />min</div>
                                </div>
                                <div className="home-stats-div">
                                    <div className="text-block-8">Prosečna težina treninga</div>
                                    <div className="text-block-9"><CountUp end={workoutSummary?.averageTrainingIntensity || 0} duration={2} decimals={1} delay={0.3} /></div>
                                </div>
                                <div className="home-stats-div">
                                    <div className="text-block-8">Prosečan umor posle treninga</div>
                                    <div className="text-block-9"><CountUp end={workoutSummary?.averageTrainingFatigue || 0} duration={2} decimals={1} delay={0.3} /></div>
                                </div>
                            </div>
                        </div>
                        <div className="home-right-div" data-aos="slide-left">
                            <div className="today-trainings-div-block mobile-visible-none">
                                <div className="text-block-6">Današnji treninzi</div>
                                <div className="today-trainings-lis-div">

                                    {todayWorkouts.length === 0 && (
                                        <div className="today-trainings-lis-div-no-trainings">
                                            <div>Nemate treninga za danas</div>
                                            <Link to="/new-workout" className="link-3">Dodaj novi trening</Link>
                                        </div>
                                    )}

                                    {todayWorkouts.map((workout) => (
                                        <div className="training-div" key={workout.id}>
                                            <div className="text-block-5"><span className="text-span-3">Tip:</span> {workout.type}</div>
                                            <div className="text-block-5"><span className="text-span-3">Težina:</span> {workout.intensity}</div>
                                            <div className="text-block-5"><span className="text-span-3">Umor:</span> {workout.fatigue}</div>
                                            <div className="text-block-5"><span className="text-span-3">Trajanje: </span>
                                                {Math.floor(workout.durationMinutes / 60)}H {workout.durationMinutes % 60}min
                                            </div>
                                            <div className="text-block-5"><span className="text-span-3">Kalorije:</span> {workout.caloriesBurned}kcal</div>
                                            <div className="text-block-5"><span className="text-span-3">Vreme početka: </span>
                                                {new Date(workout.startTime).toLocaleTimeString([], { day: 'numeric', month: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="today-training-note-div">
                                                <div className="text-block-5 note-text-width"><span className="text-span-3">Beleška:</span> <br />‍</div>
                                                <div className="text-block-5 today-training-note-text">{workout.note}</div>
                                            </div>
                                        </div>
                                    ))}


                                </div>
                            </div>
                            <div className="home-training-history-div-block mobile-visible-none">
                                <div className="text-block-6">Zadnja 3 treninga</div>
                                <div className="home-training-history-list-div">

                                    {workoutLast3.length === 0 && (
                                        <div className="today-trainings-lis-div-no-trainings">
                                            <div>Nemate treninga za danas</div>
                                            <Link to="/new-workout" className="link-3">Kreiraj svoj prvi trening!</Link>
                                        </div>
                                    )}

                                    {workoutLast3.map((workout) => (
                                        <div className="training-div" key={workout.id}>
                                            <div className="text-block-5"><span className="text-span-3">Tip:</span> {workout.type}</div>
                                            <div className="text-block-5"><span className="text-span-3">Težina:</span> {workout.intensity}</div>
                                            <div className="text-block-5"><span className="text-span-3">Umor:</span> {workout.fatigue}</div>
                                            <div className="text-block-5">
                                                <span className="text-span-3">Trajanje: </span>
                                                {Math.floor(workout.durationMinutes / 60)}H {workout.durationMinutes % 60}min
                                            </div>
                                            <div className="text-block-5"><span className="text-span-3">Kalorije:</span> {workout.caloriesBurned}kcal</div>
                                            <div className="text-block-5">
                                                <span className="text-span-3">Vreme početka: </span>
                                                {new Date(workout.startTime).toLocaleTimeString([], { day: 'numeric', month: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="today-training-note-div">
                                                <div className="text-block-5 note-text-width"><span className="text-span-3">Beleška:</span> <br /></div>
                                                <div className="text-block-5 today-training-note-text">{workout.note}</div>
                                            </div>
                                        </div>
                                    ))}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </>
    );
}

export default HomePage;