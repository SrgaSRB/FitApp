namespace Service.Aplication.DTOs.Workout
{
    public class WorkoutSummaryDto
    {
        public int TotalTrainings { get; set; }
        public int TotalBurnedCalories { get; set; }
        public int TotalTrainingTimeMinutes { get; set; }
        public double AverageTrainingIntensity { get; set; }
        public double AverageTrainingFatigue { get; set; }
    }

}
