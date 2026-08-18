export function Backdrop() {
  return (
    <>
      <div className="aurora-field" aria-hidden="true" />
      <div className="grid-field" aria-hidden="true" />
      <div
        className="orb left-[-6rem] top-[6rem] h-72 w-72 bg-primary/30"
        aria-hidden="true"
      />
      <div
        className="orb right-[-8rem] top-[24rem] h-96 w-96 bg-accent/25 [animation-delay:-6s]"
        aria-hidden="true"
      />
    </>
  );
}
