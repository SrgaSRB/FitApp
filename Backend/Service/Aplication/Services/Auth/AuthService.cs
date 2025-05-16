using AutoMapper;
using FluentValidation;
using Service.Aplication.DTOs.Auth;
using Service.Aplication.Interfaces.Repositories;
using Service.Aplication.Interfaces.Security;
using Service.Aplication.Interfaces.Services;
using Service.Domain.Enums;
using Service.Domain.Models;
using Service.Aplication.Exceptions;

namespace Service.Aplication.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtGenerator _jwt;
        //private readonly IMapper _mapper;
        private readonly IValidator<LoginDto> _loginValidator;
        private readonly IValidator<CreateUserDto> _createUserValidator;


        public AuthService(IUserRepository userRepository, IMapper mapper, IJwtGenerator jwt, IValidator<LoginDto> loginValidator, IValidator<CreateUserDto> createUserValidator)
        {
            _userRepository = userRepository;
            _jwt = jwt;
            _loginValidator = loginValidator;
            _createUserValidator = createUserValidator;
            //_mapper = mapper;

        }

        public async Task RegisterUserAsync(CreateUserDto dto, CancellationToken ct = default)
        {
            await _createUserValidator.ValidateAndThrowAsync(dto, ct);

            if (await _userRepository.UsernameExistAsync(dto.Username))
            {
                throw new ConflictException("Username already exists.");
            }

            if (await _userRepository.EmailExistAsync(dto.Email))
            {
                throw new ConflictException("Email already exists.");
            }

            //var user = _mapper.Map<User>(dto);

            var user = new Domain.Models.User
            {
                Id = Guid.NewGuid(),
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Gender = Enum.Parse<Gender>(dto.Gender, true),   // string → enum
                Birthday = dto.Birthday.ToUniversalTime(),
                Weight = dto.Weight,
                Height = dto.Height,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            await _userRepository.AddAsync(user, ct);
        }

        public async Task<bool> IsUsernameAvailableAsync(string username, CancellationToken ct = default)
        {
            return !await _userRepository.UsernameExistAsync(username, ct);
        }

        public async Task<bool> IsEmailAvailableAsync(string email, CancellationToken ct = default)
        {
            return !await _userRepository.EmailExistAsync(email, ct);
        }

        public async Task<TokenDto> LoginUserAsync(LoginDto dto, CancellationToken ct = default)
        {
            await _loginValidator.ValidateAndThrowAsync(dto, ct);

            bool isEmail = dto.UsernameOrEmail.Contains("@");

            User? user = isEmail
                ? await _userRepository.GetUserByEmailAsync(dto.UsernameOrEmail, ct)
                : await _userRepository.GetUserByUsernameAsync(dto.UsernameOrEmail, ct);

            if (user is null)
                throw new Exceptions.UnauthorizedAccessException("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                throw new Exceptions.UnauthorizedAccessException("Invalid credentials");

            return _jwt.GenerateToken(user);

        }
    }
}
