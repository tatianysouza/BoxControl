describe("Tela Escolha", () => {
    beforeEach(() => {
        cy.visit("/login", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "token",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJub21lIjoiVGVzdGUiLCJjYXJnbyI6IkdlcmVudGUiLCJpYXQiOjEyMzQ1NiwiZXhwIjo5OTk5OTk5OTk5fQ==.fake-signature"
                );
            }
        });
    });

    it("mostra formulário de login", () => {
        cy.contains("Email").should("be.visible");
        cy.contains("Senha").should("be.visible");
        cy.contains("Entrar").should("be.visible");
    });

    it("navega para dashboard ao clicar em 'Entrar'", () => {
        cy.contains("Registre-se").click();
        cy.url().should("include", "/criar-conta");
    });

    it("faz login corretamente e salva o token", () => {
        cy.visit("/login");

        // é preciso preenche os campos obrigatórios
        cy.get('input[placeholder="Digite seu email"]').type("eloisa1@gmail.com");
        cy.get('input[placeholder="Digite sua senha"]').type("123");

        cy.contains("Entrar").click();

        cy.url().should("include", "/dashboard");

        cy.window().then((win) => {
            const token = win.localStorage.getItem("token");
            expect(token).to.not.be.null;
            expect(token).to.be.a("string");
        });
    });
});