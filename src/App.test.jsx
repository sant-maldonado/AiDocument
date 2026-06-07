import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';

describe('App routing', () => {
  it('should redirect to /login when not authenticated', () => {
    localStorage.removeItem('token');
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('AiDocument')).toBeTruthy();
    expect(screen.getAllByText('Sign in').length).toBeGreaterThanOrEqual(1);
  });

  it('should render login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeTruthy();
  });

  it('should render register page', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Create account' })).toBeTruthy();
  });
});
