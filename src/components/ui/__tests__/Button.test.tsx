import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button - Testes de Componente UI', () => {
  it('deve renderizar o botão com o texto fornecido', () => {
    render(<Button>Clique aqui</Button>)

    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument()
  })

  it('deve executar a função onClick quando clicado', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Botão de Teste</Button>)

    const button = screen.getByRole('button', { name: /botão de teste/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('deve estar desabilitado quando a prop disabled é true', () => {
    render(<Button disabled>Botão Desabilitado</Button>)

    const button = screen.getByRole('button', { name: /botão desabilitado/i })
    expect(button).toBeDisabled()
  })

  it('deve aplicar a variante outline corretamente', () => {
    render(<Button variant="outline">Botão Outline</Button>)

    const button = screen.getByRole('button', { name: /botão outline/i })
    expect(button.className).toContain('border')
  })

  it('deve aplicar a variante ghost corretamente', () => {
    render(<Button variant="ghost">Botão Ghost</Button>)

    const button = screen.getByRole('button', { name: /botão ghost/i })
    expect(button.className).toContain('hover:bg')
  })

  it('deve renderizar com tamanho small', () => {
    render(<Button size="sm">Botão Pequeno</Button>)

    const button = screen.getByRole('button', { name: /botão pequeno/i })
    expect(button).toBeInTheDocument()
  })

  it('deve renderizar com tamanho large', () => {
    render(<Button size="lg">Botão Grande</Button>)

    const button = screen.getByRole('button', { name: /botão grande/i })
    expect(button).toBeInTheDocument()
  })
})
