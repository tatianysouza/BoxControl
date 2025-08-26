describe("Tela Estoque", () => {
    beforeEach(() => {
        cy.visit("/funcionarios", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "token",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJub21lIjoiVGVzdGUiLCJjYXJnbyI6IkdlcmVudGUiLCJpYXQiOjE3NTYyMjUyNTUsImV4cCI6MTc1NjM5ODA1NX0.-f2n96tX2wLala9-gESiXEmDg0FtdnVqrYftD20n1YY"
                );
            }
        });
        cy.intercept("PATCH", "http://localhost:5000/api/usuarios/status/*", {
            statusCode: 200,
            body: { message: "Status atualizado com sucesso" }
        }).as("atualizarStatus");
    });

    it("Mostra a tabela de funcionarios", () => {
        cy.contains("Nome").should("be.visible");
        cy.contains("Email").should("be.visible");
        cy.contains("Cargo").should("be.visible");
        cy.contains("Status").should("be.visible");
        cy.contains("Data de Admissão").should("be.visible");
    })

    it("altera o status de um usuário existente", () => {
        cy.contains("maria@gmail.com") 
            .parent("tr")
            .within(() => {

                cy.get("select").then(($select) => {
                    const valorAtual = $select.val();
                    const novoValor = valorAtual === "Ativo" ? "Inativo" : "Ativo";

                    cy.get("select").select(novoValor);

                    cy.wait("@atualizarStatus").its("request.body").should((body) => {
                        expect(body.status).to.eq(novoValor === "Ativo");
                    });

                    cy.get("select").should("have.value", novoValor);
                });
            });
    });
});