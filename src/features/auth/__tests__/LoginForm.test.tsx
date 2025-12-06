import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  )
}

describe('LoginForm - Testes de Autenticação', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deve renderizar o formulário de login com todos os campos obrigatórios', () => {
    renderLoginForm()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('deve permitir digitação nos campos de email e senha', () => {
    renderLoginForm()

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'teste@teste.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    expect(emailInput.value).toBe('teste@teste.com')
    expect(passwordInput.value).toBe('123456')
  })

  it('deve aceitar credenciais de paciente válidas', () => {
    renderLoginForm()

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'maria.santos@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    expect(emailInput.value).toBe('maria.santos@email.com')
    expect(passwordInput.value).toBe('123456')
  })

  it('deve aceitar credenciais de profissional válidas', () => {
    renderLoginForm()

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'carlos.silva@vidaplus.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    expect(emailInput.value).toBe('carlos.silva@vidaplus.com')
    expect(passwordInput.value).toBe('123456')
  })

  it('deve aceitar credenciais de administrador válidas', () => {
    renderLoginForm()

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'admin@vidaplus.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })

    expect(emailInput.value).toBe('admin@vidaplus.com')
    expect(passwordInput.value).toBe('admin123')
  })

  it('deve ter um link para cadastro de novo usuário', () => {
    renderLoginForm()

    const signupButton = screen.getByText(/não tem conta\? cadastre-se/i)
    expect(signupButton).toBeInTheDocument()
  })
})
