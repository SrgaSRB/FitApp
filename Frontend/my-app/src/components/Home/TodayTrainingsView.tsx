import React from 'react';
import { Link } from 'react-router-dom';

interface TodayTraining {
    id: string;
    type: string;
    intensity: number; // (1 - 10)
    fatigue: number; // (1 - 10)
    durationMinutes: number;
    caloriesBurned: number;
    startTime: string; // ISO 8601 string format for DateTimeOffset
    note?: string | null;
}

interface TodayTrainingsViewProps {
    todayTrainings: TodayTraining[];
    onClose(): void;
}

const todayTrainingsView: React.FC<TodayTrainingsViewProps> = ({ todayTrainings, onClose }) => {

    return (
        <section className="today-trainings-section" onClick={onClose}>
            <div className="w-layout-blockcontainer container w-container">
                <div className="today-trainings-wrapper">
                    <div className="today-trainings-div-block" onClick={(e) => e.stopPropagation()}>

                        <a className="link-block-2" onClick={onClose}>
                            <img src="assets/images/x-02.svg" loading="lazy" alt="" className="image-2" />
                        </a>

                        <div className="text-block-6">Današnji treninzi</div>

                        <div className="today-trainings-lis-div">

                            {todayTrainings.length === 0 ? (
                                <div className="today-trainings-lis-div-no-trainings">
                                    <div>Nemate treninga za danas</div>
                                    <Link to="/new-workout">Dodaj novi trening</Link>
                                </div>
                            ) : (
                                todayTrainings.map((workout) => (
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

export default todayTrainingsView;