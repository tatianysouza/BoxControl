import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BadgeStatus } from "./BadgeStatus";

vi.mock("./BadgeStatus.module.css", () => ({
  default: {
    badge: "badge",
    completado: "completado",
    pendente: "pendente",
  },
}));

describe("BadgeStatus", () => {
  it("renderiza o texto do status corretamente", () => {
    render(<BadgeStatus status="Pago" />);
    expect(screen.getByText("Pago")).toBeInTheDocument();
  });

  it("aplica a classe 'completado' quando o status for 'pago'", () => {
    render(<BadgeStatus status="Pago" />);
    const badge = screen.getByText("Pago");
    expect(badge.className).toContain("completado");
  });

  it("aplica a classe 'pendente' quando o status não for 'pago'", () => {
    render(<BadgeStatus status="Pendente" />);
    const badge = screen.getByText("Pendente");
    expect(badge.className).toContain("pendente");
  });
});
