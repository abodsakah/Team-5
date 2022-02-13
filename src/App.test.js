import { render, screen } from '@testing-library/react';
import App from './App';
import Login from './components/Login'
import Index from './components/Index';

test("Login screen: When 'loading' is false the login button should show up", () => {
  render(<Login />);
  // expect button with login or mui CircularProgress
  expect(screen.getByText('Login')).toBeInTheDocument();
});
test("Login screen: When 'loading' is true circular progress should show", () => {
  render(<Login loading={true} />);
  
  expect(screen.getByText('Loading')).toBeInTheDocument();
});


test('Dashboard: When the index screens apperes Hello World is expected', () => { 
  render(<Index />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});