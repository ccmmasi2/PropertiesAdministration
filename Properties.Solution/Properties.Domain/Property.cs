namespace Properties.Domain
{
    public class Property
    {
        public int IdProperty { get; private set; }
        public string Name { get; private set; } = default!;
        public string Address { get; private set; } = default!;
        public decimal Price { get; private set; }
        public string CodeInternal { get; private set; } = default!;
        public int Year { get; private set; }

        public int IdOwner { get; private set; }
        public Owner Owner { get; private set; } = default!;

        public ICollection<PropertyImage> PropertyImages { get; private set; } = new List<PropertyImage>();
        public ICollection<PropertyTrace> PropertyTraces { get; private set; } = new List<PropertyTrace>();

        protected Property() { }

        public Property(string name, string address, decimal price, string codeInternal, int year, int idOwner)
        {
            Name = name;
            Address = address;
            Price = price;
            CodeInternal = codeInternal;
            Year = year;
            IdOwner = idOwner;
        }
    }
}
