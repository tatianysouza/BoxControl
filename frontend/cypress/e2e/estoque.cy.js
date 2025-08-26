describe("Tela Estoque", () => {
    beforeEach(() => {
        cy.visit("/estoque", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "token",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJub21lIjoiVGVzdGUiLCJjYXJnbyI6IkdlcmVudGUiLCJpYXQiOjE3NTYyMjUyNTUsImV4cCI6MTc1NjM5ODA1NX0.-f2n96tX2wLala9-gESiXEmDg0FtdnVqrYftD20n1YY"
                );
            }
        });
    });

    it("Verificar se a tabela de 'Estoque' aparece corretamente", ()=>{
        
        cy.contains("Nome").should("be.visible");
        cy.contains("Código de Barras").should("be.visible");
        cy.contains("Categoria").should("be.visible");
        cy.contains("Estoque").should("be.visible");
        cy.contains("Fornecedor").should("be.visible");
        cy.contains("Ações").should("be.visible");
    });

    it("Verificar e simular o fluxo de adicionar produto", ()=>{
        cy.contains("Adicionar").click();
        cy.contains("Adicionar Produto").should("be.visible");
        cy.contains("label", "Nome").parent().find("input").type("Produto Teste");
        cy.contains("label", "Preço").parent().find("input").type("50.0");
        cy.contains("label", "Estoque").parent().find("input").type("10");
        cy.contains("label", "Código de Barras").parent().find("input").type("123456789");
        cy.contains("label", "Categoria").parent().find("input").type("Alimentos");
        cy.contains("label", "Fornecedor").parent().find("input").type("Fornecedor X");

        cy.contains("Salvar").click();
    });

    it("Verificar se o produto foi criado corretamente", ()=>{
        cy.reload();
        cy.contains("Produto Teste").should("be.visible");
        cy.contains("123456789").should("be.visible");
    });

    it("Verificar se os botões de ação funcionam", ()=>{
         cy.contains("Produto Teste").parent("tr").within(() => {
            cy.contains("Editar").click();
        });
        cy.contains("Editar Produto").should("be.visible");
        cy.contains("Cancelar").click();

        cy.on("window:confirm", (msg) => {
            expect(msg).to.include("Deseja realmente excluir esse produto do estoque?");
            return true;
        });

        cy.contains("Produto Teste").parent("tr").within(() => {
            cy.contains("Excluir").click();
        });

        cy.contains("Produto Teste").should("not.exist");
    });
});