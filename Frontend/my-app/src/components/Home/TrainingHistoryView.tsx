import React from "react";
import { Link } from "react-router-dom";

interface TrainingHistory {
    id: string;
    type: string;
    intensity: number; // (1 - 10)
    fatigue: number; // (1 - 10)
    durationMinutes: number;
    caloriesBurned: number;
    startTime: string; // ISO 8601 string format for DateTimeOffset
    note?: string | null;
}

interface TrainingHistoryViewProps {
    trainingHistory: TrainingHistory[];
    onClose(): void;
}

const TrainingHistoryView: React.FC<TrainingHistoryViewProps> = ({ trainingHistory, onClose }) => {

    return (
        <section className="last-3-training-section" onClick={onClose}>
            <div className="w-layout-blockcontainer container w-container">
                <div className="last-3-training-wrapper">
                    <div className="home-training-history-div-block" onClick={(e) => e.stopPropagation()}>

                        <a className="link-block-2" onClick={onClose}>
                            <img src="assets/images/x-02.svg" loading="lazy" alt="" className="image-2" />
                        </a>

                        <div className="text-block-6">Zadnja 3 treninga</div>
                        <div className="home-training-history-list-div">

                            {trainingHistory.length === 0 ? (
                                <div className="today-trainings-lis-div-no-trainings">
                                    <div>Nemate treninga za danas</div>
                                    <Link to="/new-workout">Kreiraj svoj prvi trening!</Link>
                                </div>
                            ) : (
                                trainingHistory.map((workout) => (
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
                                ))
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>

    );

}

export default TrainingHistoryView;