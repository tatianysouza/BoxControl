describe("Tela de Perfil", () => {
    beforeEach(() => {
        cy.intercept("GET", "http://localhost:5000/api/usuarios/perfil", {
            statusCode: 200,
            body: {
                nome: "Maria Teste",
                email: "maria@teste.com",
                cargo: "Gerente",
                status: "Ativo",
                dataAdmissao: "2025-01-01T13:00:00.000Z"
            }
        }).as("getPerfil");

        cy.intercept("PUT", "http://localhost:5000/api/usuarios/editar/*", {
            statusCode: 200,
            body: { message: "Dados atualizados com sucesso" }
        }).as("editarPerfil");

        cy.visit("/perfil", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "token",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJub21lIjoiVGVzdGUiLCJjYXJnbyI6IkdlcmVudGUiLCJpYXQiOjE3NTYyMjUyNTUsImV4cCI6MTc1NjM5ODA1NX0.-f2n96tX2wLala9-gESiXEmDg0FtdnVqrYftD20n1YY"
                );
            },
        });
    });

    it("mostra os dados do usuário no formulário", () => {
        cy.wait("@getPerfil");

        cy.get('input[placeholder="Seu nome"]').should("have.value", "Maria Teste");
        cy.get('input[placeholder="seu@email.com"]').should("have.value", "maria@teste.com");
        cy.get('input[placeholder="Seu cargo"]').should("have.value", "Gerente");
        cy.get("select").should("have.value", "Ativo");
        cy.get('input[type="date"]').should("have.value", "2025-01-01");
    });

    it("altera o nome do usuário e salva", () => {
        cy.wait("@getPerfil");

        cy.get('input[placeholder="Seu nome"]').should("have.value", "Maria Teste");

        cy.get('input[placeholder="Seu nome"]').clear().type("Maria Editada");

        cy.contains("Salvar Alterações").click();

        cy.wait("@editarPerfil").its("request.body").should((body) => {
            expect(body.nome).to.eq("Maria Editada");
            expect(body.email).to.eq("maria@teste.com");
            expect(body.cargo).to.eq("Gerente");
            expect(body.status).to.eq("Ativo");
            expect(body.dataAdmissao).to.eq("2025-01-01");
        });
    });
});