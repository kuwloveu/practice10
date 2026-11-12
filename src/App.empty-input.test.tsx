import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

// DOM order of time inputs in App: [0] current-time, [1] start, [2] end
function timeInputs(): NodeListOf<HTMLInputElement> {
  return document.querySelectorAll('input[type="time"]');
}

// the clock text span is the only text-content occurrence of the value
function clockTextCount(value: string): number {
  return (document.body.textContent?.split(value).length ?? 1) - 1;
}

describe('App with an emptied time field', () => {
  afterEach(cleanup);

  it('clearing the start field does not crash the page and is rejected with AC1', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.clear(timeInputs()[1]);
    expect(screen.getByText(/Room Availability Checker/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /check availability/i }));
    expect(screen.getByText(/AC1/i)).toBeTruthy();
  });

  it('clearing the end field does not crash the page and is rejected with AC1', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.clear(timeInputs()[2]);
    expect(screen.getByText(/Room Availability Checker/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /check availability/i }));
    expect(screen.getByText(/AC1/i)).toBeTruthy();
  });

  it('clearing the current-time field keeps the clock at its last valid value', async () => {
    const user = userEvent.setup();
    render(<App />);
    // clock span + the timeline's 13:00 hour gridline label = 2 occurrences
    expect(clockTextCount('13:00')).toBe(2);
    await user.clear(timeInputs()[0]);
    expect(screen.getByText(/Room Availability Checker/i)).toBeTruthy();
    expect(clockTextCount('13:00')).toBe(2);
  });

  it('setting the current-time field to a valid value updates the clock display', () => {
    render(<App />);
    expect(clockTextCount('13:00')).toBe(2);
    fireEvent.change(timeInputs()[0], { target: { value: '09:15' } });
    expect(clockTextCount('09:15')).toBe(1);
    expect(clockTextCount('13:00')).toBe(1); // only the timeline gridline remains
  });
});
