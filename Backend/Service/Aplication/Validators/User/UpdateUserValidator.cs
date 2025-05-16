using FluentValidation;
using Service.Aplication.DTOs.User;
using System.Data;

namespace Service.Aplication.Validators.User
{
    public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserValidator() {

            RuleFor(x => x.Username)
                .NotEmpty().Length(3, 20);

            RuleFor(x => x.Email)
                .EmailAddress();

            RuleFor(x => x.Weight)
                .InclusiveBetween(30, 300);

            RuleFor(x => x.Height)
                .InclusiveBetween(100, 250);

        }

    }
}
