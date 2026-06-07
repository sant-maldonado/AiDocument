import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatMessage from './ChatMessage.jsx';

describe('ChatMessage', () => {
  it('renders user message on the right', () => {
    render(<ChatMessage role="user" content="Hello" />);
    const el = screen.getByText('Hello');
    expect(el).toBeTruthy();
    expect(el.closest('div.justify-end')).toBeTruthy();
  });

  it('renders assistant message on the left with markdown', () => {
    render(<ChatMessage role="assistant" content="**bold** text" />);
    expect(screen.getByText('bold')).toBeTruthy();
    expect(screen.getByText('text')).toBeTruthy();
  });
});
