namespace Service.Aplication.DTOs.Workout
{
    public class WeeklyStatistic
    {
        public DateTime StartWeek { get; set; }
        public DateTime EndWeek { get; set; }
        public int TotalTrainings { get; set; }
        public int TotalBurnedCalories { get; set; }
        public int TotalTrainingTimeMinutes { get; set; }
        public double AverageTrainingFatigue { get; set; }
        public double AverageTrainingIntensity { get; set; }

    }
}
