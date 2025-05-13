import React from "react";
import api from "../../api";

const NewWorkoutPage = () => {

    const [selectedExercise, setSelectedExercise] = React.useState("Cardio");
    const [intensity, setIntensity] = React.useState<number | null>(null);
    const [fatigue, setFatigue] = React.useState<number | null>(null);
    const [dugartionHours, setDurationHours] = React.useState<number | null>(null);
    const [durationMinutes, setDurationMinutes] = React.useState<number | null>(null);
    const [calories, setCalories] = React.useState<number | null>(null);
    const [manualCalories, setManualCalories] = React.useState(false);
    const [startTime, setStartTime] = React.useState<string | null>(null);
    const [note, setNote] = React.useState<string | null>(null);

    const scale = Array.from({ length: 10 }, (_, i) => i + 1);

    const [loading, setLoading] = React.useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();

        setLoading(true);

        if (intensity === null || fatigue === null || dugartionHours === null || durationMinutes === null) {
            alert("Molimo vas popunite sva obavezna polja.");
            return;
        }

        const totalDurationMinutes = durationMinutes + (dugartionHours ? dugartionHours * 60 : 0);

        const autoCalories = manualCalories
            ? calories
            : calculateCalories(selectedExercise, intensity, fatigue, dugartionHours, durationMinutes);

        const isoStart = startTime
            ? new Date(startTime).toISOString()
            : new Date().toISOString();

        try {
            const response = await api.post("/workout", {
                type: selectedExercise,
                intensity,
                fatigue,
                durationMinutes: totalDurationMinutes,
                caloriesBurned: autoCalories,
                startTime: isoStart,
                note
            });

            if (response.status === 200) {
                alert("Trening uspešno kreiran!");
                // Reset form fields
                setSelectedExercise("Cardio");
                setIntensity(null);
                setFatigue(null);
                setDurationHours(null);
                setDurationMinutes(null);
                setCalories(null);
                setManualCalories(false);
                setStartTime(null);
                setNote(null);
            } else {
                alert("Greška prilikom kreiranja treninga.");
            }

        } catch (error) {
            console.error("Error creating workout:", error);
            alert("Greška prilikom kreiranja treninga.");
        }finally{
            setLoading(false);
        }
    };

    const getBaseRate = (exerciseType: string): number => {
        switch (exerciseType) {
            case "cardio": return 600; // kcal/h
            case "strength": return 500;
            case "flexibility": return 250;
            default: return 350;
        }
    };

    const calculateCalories = (exerciseType: string, intensity: number, fatigue: number, durationHours: number, durationMinutes: number): number => {
        const baseRate = getBaseRate(exerciseType);

        const intensityFactor = 1 + (intensity - 5) * 0.1; // npr: intensity 8 → +30%
        const fatigueFactor = 1 + (fatigue - 5) * 0.05;     // npr: fatigue 8 → +15%

        const totalDuration = durationHours + (durationMinutes / 60);

        const calories = baseRate * intensityFactor * fatigueFactor * totalDuration;

        return Math.round(calories);
    };


    return (
        <section className="newtraining-section">
            <div className="w-layout-blockcontainer container w-container">
                <div className="newtraining-wrapper">
                    <div className="nt-form-div w-form">
                        <form className="nt-form" onSubmit={handleSubmit}>
                            <div className="nt-form-data-wrapper"><label className="field-label">Vežba</label>
                                <div className="nt-form-exercise-div-block">
                                    <div className={`${selectedExercise === "Cardio" ? "selected-nt-form-exercise" : ""} nt-form-exercise-div`} onClick={() => setSelectedExercise("Cardio")}>

                                        <a className="nt-form-exercise w-inline-block"><img src="assets/images/Fitness-tracker-pana.svg" loading="lazy" alt="" className="image" />
                                            <div className="text-block-2">Cardio</div>
                                        </a>
                                    </div>
                                    <div className={`${selectedExercise === "Strength" ? "selected-nt-form-exercise" : ""} nt-form-exercise-div`} onClick={() => setSelectedExercise("Strength")}>
                                        <a className="nt-form-exercise w-inline-block"><img src="assets/images/Workout-rafiki.svg" loading="lazy" alt="" className="image" />
                                            <div className="text-block-2">Test Snage</div>
                                        </a>
                                    </div>
                                    <div className={`${selectedExercise === "Flexibility" ? "selected-nt-form-exercise" : ""} nt-form-exercise-div`} onClick={() => setSelectedExercise("Flexibility")}>
                                        <a className="nt-form-exercise w-inline-block"><img src="assets/images/Stretch-pana.svg" loading="lazy" alt="" className="image" />
                                            <div className="text-block-2">Fleksibilnost</div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="nt-form-data-wrapper">
                                <label className="field-label">Težina</label>
                                <div className="nt-form-intensity-div-block">
                                    {scale.map(n => (
                                        <div
                                            key={n}
                                            className={`nt-form-intensity-div ${intensity === n ? "selected-nt-form-intensity-div" : ""}`}
                                            onClick={() => setIntensity(n)}
                                        >
                                            <a className={`nt-form-intensity w-inline-block ${intensity === n ? "selected-nt-form-intensity" : ""}`}>
                                                <div className="text-block-3">{n}</div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="nt-form-data-wrapper">
                                <label className="field-label">Umor</label>
                                <div className="nt-form-intensity-div-block">
                                    {scale.map(n => (
                                        <div
                                            key={n}
                                            className={`nt-form-intensity-div ${fatigue === n ? "selected-nt-form-intensity-div" : ""}`}
                                            onClick={() => setFatigue(n)}
                                        >
                                            <a className={`nt-form-intensity w-inline-block ${fatigue === n ? "selected-nt-form-intensity" : ""}`}>
                                                <div className="text-block-3">{n}</div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="nt-form-data-wrapper"><label className="field-label">Trajanje</label>
                                <div className="nt-form-duration-div">
                                    <div className="nt-form-duration-div-hours">
                                        <input className="text-field w-input" maxLength={256} placeholder="Unesi sate" type="number"
                                            value={dugartionHours || ""}
                                            onChange={(e) => setDurationHours(Number(e.target.value))}
                                        />
                                        <div className="text-block-4">h</div>
                                    </div>
                                    <div className="nt-form-duration-div-hours">
                                        <input className="text-field text-field-min w-input" maxLength={256} placeholder="Unesi minute" type="number"
                                            value={durationMinutes || ""}
                                            onChange={(e) => setDurationMinutes(Number(e.target.value))}
                                            required
                                        />
                                        <div className="text-block-4">min</div>
                                    </div>

                                    {/*
                                    <div className="nt-form-duration-div-hours temp-display-none">
                                        <input className="text-field text-field-sec w-input" maxLength={256} placeholder="Unesi sekunde" type="text"/>
                                        <div className="text-block-4">sec</div>
                                    </div>
                                        */}

                                </div>
                            </div>
                            <div className="nt-form-data-wrapper"><label className="field-label">Kalorije</label>
                                <div className="nt-form-calories-div">
                                    {manualCalories && (
                                        <input className="text-field w-input" maxLength={256} placeholder="Unesi kalorije" type="number"
                                            value={calories || ""}
                                            onChange={(e) => setCalories(Number(e.target.value))}
                                            required
                                        />
                                    )}
                                    <label className="w-checkbox checkbox-field">
                                        <input type="checkbox" name="Checkbox" id="Checkbox" data-name="Checkbox" className="w-checkbox-input checkbox"
                                            checked={manualCalories}
                                            onChange={(e) => setManualCalories(e.target.checked)}
                                        />
                                        <span className="w-form-label">Ručno unošenje kalorija</span>
                                    </label>
                                </div>
                            </div>
                            <div className="nt-form-data-wrapper"><label className="field-label">Vreme početka treninga</label>
                                <div className="nt-form-calories-div">
                                    <input
                                        type="datetime-local"
                                        className="text-field"
                                        value={startTime || ""}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="nt-form-data-wrapper"><label className="field-label">Dodaj belešku <span className="text-span">(opciono)</span></label>
                                <textarea placeholder="Example Text" maxLength={2048} className="textarea w-input"
                                    value={note || ""}
                                    onChange={(e) => setNote(e.target.value)}
                                    required
                                >
                                </textarea>
                            </div>
                            <input type="submit" data-wait="Please wait..." className="submit-button w-button" value="Kreiraj trening" />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NewWorkoutPage;