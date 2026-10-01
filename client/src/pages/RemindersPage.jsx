export default function RemindersPage() {
  return (
    <section className="page">
      <h1>Reminders</h1>
      <div className="panel">
        <form className="entry-form">
          <label>
            Title
            <input type="text" placeholder="Reminder title" />
          </label>
          <label>
            Deadline
            <input type="date" />
          </label>
          <label>
            Priority
            <select>
              <option value="high">High</option>
              <option value="medium" selected>Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <button type="submit">Add reminder</button>
        </form>
      </div>
    </section>
  );
}
