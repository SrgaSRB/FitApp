using Service.Aplication.DTOs.Workout;
using Service.Aplication.Interfaces.Repositories;
using Service.Aplication.Interfaces.Services;

namespace Service.Aplication.Services.Workout
{
    public class WorkoutService : IWorkoutService
    {
        private readonly IWorkoutRepository _workouts;

        public WorkoutService(IWorkoutRepository workouts)
        {
            _workouts = workouts;
        }

        public async Task<WorkoutSummaryDto> WorkoutSum(Guid userId, CancellationToken ct)
        {

            var workoutList = await _workouts.GetAllByUserAsync(userId);

            if (workoutList.Count == 0)
                return new WorkoutSummaryDto();

            return new WorkoutSummaryDto
            {
                TotalTrainings = workoutList.Count,
                TotalBurnedCalories = workoutList.Sum(w => w.CaloriesBurned),
                TotalTrainingTimeMinutes = workoutList.Sum(w => w.DurationMinutes),
                AverageTrainingFatigue = workoutList.Average(w => w.Fatigue),
                AverageTrainingIntensity = workoutList.Average(w => w.Intensity)
            };

        }
    }
}
