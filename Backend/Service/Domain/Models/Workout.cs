using Service.Domain.Enums;

namespace Service.Domain.Models
{
    public class Workout
    {
        public Guid Id { get; set; }
        public WorkoutType Type { get; set; }
        public int DurationMinutes { get; set; }
        public int CaloriesBurned { get; set; }
        public int Intensity { get; set; } //(1 - 10)
        public int Fatigue { get; set; } //(1 - 10)
        public string? Note { get; set; }
        public DateTimeOffset StartTime { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

    }
}