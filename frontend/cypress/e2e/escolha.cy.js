describe("Tela Escolha", () => {
    beforeEach(() => {
        cy.visit("/dashboard", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "token",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJub21lIjoiVGVzdGUiLCJjYXJnbyI6IkdlcmVudGUiLCJpYXQiOjEyMzQ1NiwiZXhwIjo5OTk5OTk5OTk5fQ==.fake-signature"
                );
            }
        });
    });

    it("mostra as opções de gerente", () => {
        cy.contains("Escolha uma opção:").should("be.visible");
        cy.contains("Estoque").should("be.visible");
        cy.contains("Controle de Caixa").should("be.visible");
    });

    it("navega para perfil ao clicar em 'Meu Perfil'", () => {
        cy.contains("Meu Perfil").click();
        cy.url().should("include", "/perfil");
    });

    it("faz logout corretamente", () => {
        cy.contains("Sair").click();

        cy.url().should("include", "/login");

        cy.window().should((win) => {
            expect(win.localStorage.getItem("token")).to.be.null;
        });
    });
});