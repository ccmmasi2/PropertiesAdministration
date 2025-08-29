namespace Properties.Domain
{
    public class PropertyTrace
    {
        public int IdPropertyTrace { get; private set; }
        public DateTime DateState { get; private set; } = default!;
        public string Name { get; private set; } = default!;
        public decimal Value { get; private set; } = default!;
        public decimal Tax { get; private set; } = default!;

        public int IdProperty { get; private set; }
        public Property Property { get; private set; } = default!;
    }
}
