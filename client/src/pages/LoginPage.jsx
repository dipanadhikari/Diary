export default function LoginPage() {
  return (
    <section className="page login-card">
      <h1>Login</h1>
      <form className="entry-form panel">
        <label>
          Email
          <input type="email" placeholder="name@example.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </section>
  );
}
