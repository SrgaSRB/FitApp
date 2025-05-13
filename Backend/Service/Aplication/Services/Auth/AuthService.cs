using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Service.Aplication.DTOs.Auth;
using Service.Aplication.Interfaces.Repositories;
using Service.Aplication.Interfaces.Security;
using Service.Aplication.Interfaces.Services;
using Service.Domain.Enums;
using Service.Domain.Models;

namespace Service.Aplication.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtGenerator _jwt;
        //private readonly IMapper _mapper;
        private readonly IValidator<LoginDto> _validator;


        public AuthService(IUserRepository userRepository, IMapper mapper, IJwtGenerator jwt, IValidator<LoginDto> validator)
        {
            _userRepository = userRepository;
            _jwt = jwt;
            _validator = validator;
            //_mapper = mapper;

        }

        public async Task RegisterUserAsync(CreateUserDto dto, CancellationToken ct = default)
        {
            if (await _userRepository.UsernameExistAsync(dto.Username))
            {
                throw new Exception("Username already exists. Please choose another one.");
            }

            if (await _userRepository.EmailExistAsync(dto.Email))
            {
                throw new Exception("Email already exists. Please choose another one.");
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

            user.Id = Guid.NewGuid();
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

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
            await _validator.ValidateAndThrowAsync(dto, ct);

            bool isEmail = dto.UsernameOrEmail.Contains("@");

            User? user = isEmail
                ? await _userRepository.GetUserByEmailAsync(dto.UsernameOrEmail, ct)
                : await _userRepository.GetUserByUsernameAsync(dto.UsernameOrEmail, ct);

            if (user is null)
                throw new UnauthorizedAccessException("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                throw new UnauthorizedAccessException("Invalid credentials");

            return _jwt.GenerateToken(user);

        }
    }
}
