import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard';

const baseTask = {
  title: 'Write API docs',
  description: 'Cover all 42 routes',
  priority: 'high',
  status: 'pending',
  assignee: { name: 'Ravi Kumar' },
};

describe('TaskCard', () => {
  it('renders title, priority badge and status badge', () => {
    render(<TaskCard task={baseTask} />);

    expect(screen.getByText('Write API docs')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('falls back to Unassigned when the task has no assignee', () => {
    render(<TaskCard task={{ ...baseTask, assignee: undefined }} />);

    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('marks a past-due incomplete task as Overdue', () => {
    render(<TaskCard task={{ ...baseTask, dueDate: '2020-01-01T00:00:00Z' }} />);

    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('shows completed checklist progress as a ratio', () => {
    render(
      <TaskCard
        task={{
          ...baseTask,
          checklist: [
            { text: 'step 1', completed: true },
            { text: 'step 2', completed: false },
            { text: 'step 3', completed: false },
          ],
        }}
      />
    );

    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('invokes onClick when the card is clicked', () => {
    const onClick = vi.fn();
    render(<TaskCard task={baseTask} onClick={onClick} />);

    fireEvent.click(screen.getByText('Write API docs'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
