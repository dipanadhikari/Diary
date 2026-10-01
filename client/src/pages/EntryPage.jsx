import { useParams } from 'react-router-dom';

export default function EntryPage() {
  const { date } = useParams();

  return (
    <section className="page">
      <h1>Daily entry</h1>
      <p>Entry date: {date || 'today'}</p>

      <form className="entry-form panel">
        <label>
          Site / location
          <input type="text" placeholder="Site location" />
        </label>

        <label>
          Work done
          <textarea rows="5" placeholder="Describe what you did today..." />
        </label>

        <label>
          Learned
          <textarea rows="4" placeholder="What did you learn?" />
        </label>

        <label>
          Plan tomorrow
          <textarea rows="4" placeholder="What is next on the plan?" />
        </label>

        <label className="checkbox-row">
          <input type="checkbox" />
          Day off
        </label>

        <button type="submit">Save entry</button>
      </form>
    </section>
  );
}
