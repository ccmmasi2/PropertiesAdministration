namespace Properties.Domain
{
    public class Owner
    {
        public int IdOwner { get; private set; }
        public string Name { get; private set; } = default!;
        public string Address { get; private set; } = default!;
        public string Photo { get; private set; } = default!;
        public DateTime BirthDay { get; private set; } = default!;
    }
}
