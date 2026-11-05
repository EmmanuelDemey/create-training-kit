// TODO — step 1: keep what is typed in the input in a `name` state.
// TODO — step 2: on submit, without reloading the page, keep the name to greet.
// TODO — step 3: show `Hello, <name>!` in #greeting.
export default function App() {
  return (
    <>
      <form>
        <label htmlFor="name">Your name</label>
        <input id="name" autoComplete="given-name" />
        <button>Greet me</button>
      </form>
      <p id="greeting"></p>
    </>
  );
}
