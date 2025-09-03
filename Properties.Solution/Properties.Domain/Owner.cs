using static Properties.Contracts.Enums.Enumerators;

namespace Properties.Domain
{
    public class Owner
    {
        public int IdOwner { get; private set; }
        public string Name { get; private set; } = default!;

        public IdentificationType IdentificationType { get; private set; }
        public string Identification { get; private set; } = default!;

        public string Address { get; private set; } = default!;
        public string? Photo { get; private set; }
        public DateTime BirthDay { get; private set; } = default!;

        public ICollection<Property> Properties { get; private set; } = new List<Property>();

        protected Owner() { }

        public Owner(string name, IdentificationType identificationType, string identification, string address, string? photo, DateTime birthDay)
        {
            Name = name;
            IdentificationType = identificationType;
            Identification = identification;
            Address = address;
            Photo = photo;
            BirthDay = birthDay;
        }

        public void Update(string name, IdentificationType identificationType, string identification, string address, string? photo, DateTime birthDay)
        {
            Name = name;
            IdentificationType = identificationType;
            Identification = identification;
            Address = address;
            Photo = photo;
            BirthDay = birthDay;
        }

        public void UpdatePhoto(string? photo)
        {
            Photo = photo;
        }
    }
}
