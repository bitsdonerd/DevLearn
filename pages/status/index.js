function Capslock(props) {
  const textUpperCase = props.text.toUpperCase();
  return <span>{textUpperCase}</span>;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <Capslock text="Primeiro texto " />
    </>
  );
}
