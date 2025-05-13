import React from "react";
import api from "../../api";
import Loader from "../Shared/Loader";

interface WeeklyStatistic {
    startWeek: string;
    endWeek: string;
    totalTrainings: number;
    totalBurnedCalories: number;
    totalTrainingTimeMinutes: number;
    averageTrainingFatigue: number;
    averageTrainingIntensity: number;
}

const ProgressPage = () => {

    const [selectedYear, setSelectedYear] = React.useState<string>("");
    const [selectedMonth, setSelectedMonth] = React.useState<string>("");
    const [weeklyStatistics, setWeeklyStatistics] = React.useState<WeeklyStatistic[]>([]);

    const [loading, setLoading] = React.useState<boolean>(false);


    const fetchWeeklyStatistics = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        if (selectedYear === "" || selectedMonth === "") {
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/workout/weekly-statistics", {
                year: selectedYear,
                month: selectedMonth
            });

            setWeeklyStatistics(response.data);
        } catch (error) {
            console.error("Error fetching weekly statistics:", error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section className="progress-section">
            <div className="w-layout-blockcontainer container w-container">
                <div className="progress-wrapper">
                    <div className="w-form">
                        <form className="form-4" onSubmit={fetchWeeklyStatistics}>
                            <label className="field-label-2">Izaberi godinu i mesec za prikaz</label>
                            <select id="year-select" name="year-select" className="select-field w-select"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Izaberi godinu</option>
                                {Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                            <select id="month-select" name="month-select" className="select-field w-select"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="">Izaberi mesec</option>
                                {[
                                    "Januar",
                                    "Februar",
                                    "Mart",
                                    "April",
                                    "Maj",
                                    "Jun",
                                    "Jul",
                                    "Avgust",
                                    "Septembar",
                                    "Oktobar",
                                    "Novembar",
                                    "Decembar",
                                ].map((month, index) => (
                                    <option key={index + 1} value={String(index + 1).padStart(2, "0")}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <button className="button-4" type="submit">
                                Prikazi
                            </button>
                        </form>
                    </div>
                    <div className="progrss-weeks-list-div">
                        {loading ? (
                            <Loader />
                        ) : (
                            weeklyStatistics.length > 0 ? (
                                weeklyStatistics.map((week, index) => (

                                    <div className="progress-week-div" key={index}>
                                        <div className="progress-week-date-div">
                                            <div className="progress-week-start-date">
                                                {new Date(week.startWeek).toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit" })} - {new Date(week.endWeek).toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit" })}
                                            </div>
                                        </div>

                                        {week.totalTrainings === 0 ? (
                                            <div className="progress-week-no-data-div">
                                                <div className="progress-week-no-data-text">Nema podataka za ovu nedelju.</div>
                                            </div>
                                        ) : (

                                            <>
                                                <div className="progress-week-help-div">
                                                    <div className="progress-week-total-training-div">
                                                        <div>Ukupno treninga</div>
                                                        <div className="text-block-10 temp-fs-2rem">{week.totalTrainings}</div>
                                                    </div>
                                                    <div className="progress-week-total-training-duration-div">
                                                        <div>Ukupno trajanje treninga</div>
                                                        <div className="text-block-10 temp-fs-2rem">
                                                            {Math.floor(week.totalTrainingTimeMinutes / 60)}h {week.totalTrainingTimeMinutes % 60}m
                                                            <span className="text-span-4">
                                                                ({Math.floor(week.totalTrainingTimeMinutes / week.totalTrainings / 60)}h {Math.floor((week.totalTrainingTimeMinutes / week.totalTrainings) % 60)}m/tr)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="progress-week-averge-diff">
                                                        <div>Prosecna težina</div>
                                                        <div className="progress-week-bar">
                                                            <div className="progress-week-bar-scale" style={{ width: `${week.averageTrainingIntensity * 10}%` }}></div>
                                                        </div>
                                                        <div className="text-block-10 temp-fs-1rem">{week.averageTrainingIntensity.toFixed(2)}</div>
                                                    </div>
                                                    <div className="progress-week-averge-fatigue">
                                                        <div>Prosečan umor</div>
                                                        <div className="progress-week-bar">
                                                            <div className="progress-week-bar-scale _2nd-scale-color" style={{ width: `${week.averageTrainingFatigue * 10}%` }} ></div>
                                                        </div>
                                                        <div className="text-block-10 temp-fs-1rem">{week.averageTrainingFatigue.toFixed(2)}</div>
                                                    </div>
                                                    <div className="progress-week-total-calories">
                                                        <div>Ukupno potrosenih kalorija</div>
                                                        <div className="text-block-10 temp-fs-2rem">
                                                            {week.totalBurnedCalories}kcal <span className="text-span-5">({(week.totalBurnedCalories / week.totalTrainings).toFixed(2)} kcal/tr)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>

                                        )}

                                    </div>
                                ))
                            ) : (
                                <div className="no-data-div">
                                    <div className="no-data-text">Nema podataka za izabrani mesec i godinu.</div>
                                </div>
                            ))}

                    </div>
                </div>
            </div>
        </section>

    );

}

export default ProgressPage;