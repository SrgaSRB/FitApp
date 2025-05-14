import React, { useEffect } from "react";
import api from "../../api";
import Loader from "./Loader";

interface WorkoutHistoryDto {
    id: string;
    type: string; // Assuming WorkoutType is a string, replace with appropriate type if needed
    durationMinutes: number;
    caloriesBurned: number;
    intensity: number; // (1 - 10)
    fatigue: number; // (1 - 10)
    note?: string;
    startTime: string; // ISO 8601 format for DateTimeOffset
}

interface TrainingHistoryViewProps {
    onClose(): void;
}

const TrainingHistoryView: React.FC<TrainingHistoryViewProps> = ({ onClose }) => {

    const [workouts, setWorkouts] = React.useState<WorkoutHistoryDto[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sort, setSort] = React.useState("");

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setLoading(true)

        try {
            const response = await api.get("/workout/")
            setWorkouts(response.data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteWorkout = async (workoutId: string) => {

        if (!window.confirm("Da li ste sigurni da zelite obrisati trening?")) {
            return;
        }

        setLoading(true)

        if (workoutId === "")
            return

        try {
            const response = await api.delete(`workout/${workoutId}`)
            if (response.status === 200) {
                setWorkouts(prev => prev.filter(w => w.id !== workoutId)); 
            }
            else
                alert("Greska pri brisanju treninga")

        } catch (error) {
            console.error("Error: ", error)
        } finally {
            setLoading(false);
        }

    }

    if (loading) {
        return <Loader />
    }

    return (
        <section className="training-history-section" onClick={onClose}>
            <div className="w-layout-blockcontainer container w-container">
                <div className="training-history-wrapper">
                    <div className="training-history-list-block" onClick={(e) => e.stopPropagation()}>

                        <div className="training-history-list-title">Istorija Treninga</div>

                        <div className="form-block-4 w-form">
                            <form>
                                <select className="select-field-2 w-select"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="">Sortiraj po</option>
                                    <option value="created-time">Vremenu kreiranja</option>
                                    <option value="Intensity">Težini</option>
                                    <option value="Fatigue">Umoru</option>
                                    <option value="training-duration">Trajanju treninga</option>
                                    <option value="calories">Potrosenim kalorijama</option>
                                </select>
                            </form>
                        </div>

                        <div className="training-history-list-div">


                            {workouts
                                .sort((a, b) => {
                                    switch (sort) {
                                        case "created-time":
                                            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                                        case "Intensity":
                                            return b.intensity - a.intensity;
                                        case "Fatigue":
                                            return b.fatigue - a.fatigue;
                                        case "training-duration":
                                            return b.durationMinutes - a.durationMinutes;
                                        case "calories":
                                            return b.caloriesBurned - a.caloriesBurned;
                                        default:
                                            return 0;
                                    }
                                })
                                .map((workout) => (
                                    <div className="training-history-div" key={workout.id}>
                                        <div id="w-node-d92754b9-cab3-5ee2-2743-d33383f3df7a-3100933c" className="div-block-9 training-history-type-div">
                                            <div className="text-block-14">Tip</div>
                                            <div className="text-block-15">{workout.type}</div>
                                        </div>
                                        <div className="div-block-9">
                                            <div className="text-block-14">Težina</div>
                                            <div className="text-block-15">{workout.intensity}</div>
                                        </div>
                                        <div className="div-block-9">
                                            <div className="text-block-14">Umor</div>
                                            <div className="text-block-15">{workout.fatigue}</div>
                                        </div>
                                        <div className="div-block-9">
                                            <div className="text-block-14">Trajanje</div>
                                            <div className="text-block-15">{workout.durationMinutes} min</div>
                                        </div>
                                        <div className="div-block-9">
                                            <div className="text-block-14">Kalorije</div>
                                            <div className="text-block-15">{workout.caloriesBurned} kcal</div>
                                        </div>
                                        <div className="div-block-9">
                                            <div className="text-block-14">Vreme početka</div>
                                            <div className="text-block-15">{new Date(workout.startTime).toLocaleDateString("en-GB")}</div>
                                        </div>
                                        <div id="w-node-_7a76c220-2a6b-5f5b-c976-eeda9e4bd2cb-3100933c" className="div-block-9">
                                            <div className="text-block-14">Beleška</div>
                                            <div className="text-block-15 training-history-div-note">{workout.note}</div>
                                        </div>
                                        <a className="link-block-4 w-inline-block" onClick={() => handleDeleteWorkout(workout.id)}>
                                            <img src="assets/icons/trash.png" loading="lazy" alt="" />
                                        </a>
                                    </div>
                                ))}

                        </div>

                        <a className="link-block-3 w-inline-block" onClick={onClose}>
                            <img src="/assets/icons/x-white-100.svg" loading="lazy" alt="" className="image-5" />
                        </a>

                    </div>
                </div>
            </div>
        </section>

    )
}

export default TrainingHistoryView;