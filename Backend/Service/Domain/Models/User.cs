using Service.Domain.Enums;

namespace Service.Domain.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public DateTime Birthday { get; set; }
        public double Weight { get; set; }
        public int Height { get; set; }

        public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    }
}
