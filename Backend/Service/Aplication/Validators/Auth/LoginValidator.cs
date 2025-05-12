using FluentValidation;
using Service.Aplication.DTOs.Auth;

namespace Service.Aplication.Validators.Auth
{
    public class LoginValidator : AbstractValidator<LoginDto>
    {

        public LoginValidator()
        {
            RuleFor(x => x.UsernameOrEmail)
                .NotEmpty();

            RuleFor(x => x.Password)
                .NotEmpty();
        }

    }
}
