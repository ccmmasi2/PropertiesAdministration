namespace Properties.Domain
{
    public class PropertyImage
    {
        public int IdPropertyImage { get; private set; }
        public string File { get; private set; } = default!;
        public Boolean Enable { get; private set; }

        public int IdProperty { get; private set; }
        public Property Property { get; private set; } = default!;
    }
}
