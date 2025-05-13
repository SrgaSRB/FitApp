using Service.Domain.Enums;
using System.Text.Json.Serialization;

namespace Service.Aplication.DTOs.Workout
{
    public class CreateWorkoutDto
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public WorkoutType Type { get; set; }
        public int Intensity { get; set; } //(1 - 10)
        public int Fatigue { get; set; } //(1 - 10)
        public int DurationMinutes { get; set; }
        public int CaloriesBurned { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public string? Note { get; set; }
    }
}
