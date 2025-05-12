using FluentValidation;
using Service.Aplication.DTOs.Auth;

namespace Service.Aplication.Validators.Auth
{
    public class CreateUserValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserValidator()
        {

            RuleFor(x => x.Username)
                .NotEmpty().Length(3, 20);

            RuleFor(x => x.Email)
                .EmailAddress();

            RuleFor(x => x.Password)
                .MinimumLength(3);

            RuleFor(x => x.Weight)
                .InclusiveBetween(30, 300);

            RuleFor(x => x.Height)
                .InclusiveBetween(100, 250);

        }
    }
}
