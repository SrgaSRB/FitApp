using FluentValidation;
using Service.Aplication.DTOs.Workout;

namespace Service.Aplication.Validators.Workout
{
    public class CreateWorkoutValidator : AbstractValidator<CreateWorkoutDto>
    {

        public CreateWorkoutValidator() {

            RuleFor(x => x.Type)
                .IsInEnum();

            RuleFor(x => x.Intensity)
                .InclusiveBetween(1, 10);

            RuleFor(x => x.Fatigue)
                .InclusiveBetween(1, 10);

            RuleFor(x => x.CaloriesBurned)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.StartTime)
                .NotEmpty();

        }

    }
}
